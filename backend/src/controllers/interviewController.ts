import { Request, Response } from "express";
import Interview from "../models/Interview.js";
import {
  buildInterviewPrompt,
  buildEvaluationPrompt,
} from "../utils/prompts.js";
import User from "../models/User.js";

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || "";
const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";

/** Helper: call Together AI and parse a JSON response */
async function callTogetherAI(
  systemPrompt: string,
  userMessage: string,
): Promise<any> {
  const model = "meta-llama/Llama-3.3-70B-Instruct-Turbo";
  const fullPrompt = `${systemPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no extra text.\n\n${userMessage}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    console.log(`Calling Together AI model: ${model}`);
    const response = await fetch(TOGETHER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 1024,
        temperature: 0.3,
        top_p: 0.9,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Together API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";

    // JSON extraction
    let clean = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      clean = jsonMatch[0];
    }

    try {
      return JSON.parse(clean);
    } catch (parseErr) {
      console.error("Failed to parse AI JSON. Raw text:", text);
      // Attempt a more aggressive clean if it's just markdown fences
      const ultraClean = clean.replace(/```json|```/g, "").trim();
      try {
        return JSON.parse(ultraClean);
      } catch (e) {
        throw new Error("AI returned an invalid JSON format. Please try again.");
      }
    }
  } catch (err: any) {
    console.error("Together AI error:", err.message);
    throw err;
  }
}

// Helper to sanitize score numbers — clamp to AI spec range (-15 to +20)
const clampDelta = (val: any): number => {
  const n = Number(val);
  if (isNaN(n)) return 0;
  return Math.max(-15, Math.min(20, n));
};

// ═══════════════════════════════════════════════════════════
// START INTERVIEW — Create session + generate first question
// ═══════════════════════════════════════════════════════════

const startInterview = async (req: any, res: Response) => {
  const {
    role,
    experienceLevel,
    techStack,
    interviewType = "mixed",
    numberOfQuestions = 10,
    difficulty = "medium",
  } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const candidateName = user?.name || "Candidate";

    // Parse techStack — accept string or array
    const stackArray = Array.isArray(techStack)
      ? techStack
      : typeof techStack === "string"
        ? techStack
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

    // Generate the first question via AI
    const prompt = buildInterviewPrompt(
      candidateName,
      role,
      stackArray,
      experienceLevel,
      interviewType,
      difficulty,
      numberOfQuestions,
      1,
    );

    console.log(
      `Starting interview for ${candidateName} - Role: ${role}, Type: ${interviewType}`,
    );

    let firstQuestion = `Hi ${candidateName}! I'm Maya, your interviewer today. Great to have you here. Let's start — can you walk me through your background and what brought you to this role?`;

    try {
      console.log("Calling Gemini for first question...");
      const parsed = await callTogetherAI(
        prompt,
        `[Interview starting. This is the first message. Generate a warm greeting and the first question for ${candidateName} applying for ${role}.]`,
      );
      if (parsed.next_question) {
        firstQuestion = parsed.next_question;
        console.log("Gemini successfully generated first question.");
      }
    } catch (aiErr: any) {
      console.warn(
        "AI first question generation failed, using fallback:",
        aiErr.message,
      );
    }

    // Create the interview record
    try {
      console.log("Creating interview record in database...");
      const interview = await Interview.create({
        user: req.user._id,
        role,
        experienceLevel,
        techStack: stackArray,
        interviewType,
        numberOfQuestions,
        difficulty,
        currentQuestionIndex: 0,
        scores: { technical: 50, communication: 50, confidence: 50 },
        status: "in_progress",
        questions: [
          {
            question: firstQuestion,
            answer: "",
            feedback: { positive: "", improvement: "" },
            scoreDelta: { technical: 0, communication: 0, confidence: 0 },
            score: 0,
          },
        ],
      });

      console.log(`Interview created successfully with ID: ${interview._id}`);

      res.status(201).json({
        interviewId: interview._id,
        questions: [firstQuestion], // Added for frontend compatibility
        currentQuestion: firstQuestion,
        questionNumber: 1,
        totalQuestions: numberOfQuestions,
        scores: interview.scores,
      });
    } catch (dbErr: any) {
      console.error("Database error creating interview:", dbErr.message);
      throw dbErr;
    }
  } catch (error: any) {
    console.error("Start interview error:", error.message);
    res
      .status(500)
      .json({ message: `Failed to start interview session: ${error.message}` });
  }
};

// ═══════════════════════════════════════════════════════════
// SUBMIT ANSWER — Process answer, get feedback + next question
// ═══════════════════════════════════════════════════════════

const submitAnswer = async (req: any, res: Response) => {
  const { interviewId, answer } = req.body;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview)
      return res.status(404).json({ message: "Interview session not found." });

    const user = await User.findById(req.user._id);
    const candidateName = user?.name || "Candidate";
    const currentIdx = interview.currentQuestionIndex || 0;
    const questionNumber = currentIdx + 1;
    const isLastQuestion = questionNumber >= interview.numberOfQuestions;

    // Save the answer to current question
    if (interview.questions[currentIdx]) {
      interview.questions[currentIdx].answer = answer;
    }

    // Build conversation context
    const context: Array<{ role: "assistant" | "user"; content: string }> = [];
    for (const q of interview.questions) {
      if (q.question) context.push({ role: "assistant", content: q.question });
      if (q.answer) context.push({ role: "user", content: q.answer });
    }

    // Build the prompt for the next question
    const prompt = buildInterviewPrompt(
      candidateName,
      interview.role || "",
      interview.techStack || [],
      interview.experienceLevel || "",
      interview.interviewType || "mixed",
      interview.difficulty || "medium",
      interview.numberOfQuestions,
      questionNumber + 1,
    );

    let aiResponse = {
      next_question: `I'm interested in hearing more about your experience as a ${interview.role}. Could you describe a particularly complex challenge you faced in your work and how you approached it?`,
      verdict: "Mediocre",
      feedback_on_last_answer: {
        positive: "I'm still calibrating my assessment of your technical depth.",
        improvement: "I need you to be much more specific. Use technical terms and describe the actual results of your work. Don't just give surface-level explanations.",
        score_delta: { technical: 0, communication: 0, confidence: 0 },
      },
      is_interview_complete: isLastQuestion,
    };

    try {
      // Build conversation history as a single string for Gemini
      const conversationHistory = context
        .map(
          (m) =>
            `${m.role === "assistant" ? "Interviewer" : "Candidate"}: ${m.content}`,
        )
        .join("\n");

      const parsed = await callTogetherAI(prompt, conversationHistory);

      // Validate and sanitize the AI response
      if (parsed.next_question) aiResponse.next_question = parsed.next_question;
      if (parsed.verdict) aiResponse.verdict = parsed.verdict;
      if (parsed.sentiment) (aiResponse as any).sentiment = parsed.sentiment;
      if (parsed.feedback_on_last_answer) {
        aiResponse.feedback_on_last_answer = {
          positive:
            parsed.feedback_on_last_answer.positive ||
            aiResponse.feedback_on_last_answer.positive,
          improvement:
            parsed.feedback_on_last_answer.improvement ||
            aiResponse.feedback_on_last_answer.improvement,
          score_delta: {
            technical: clampDelta(
              parsed.feedback_on_last_answer.score_delta?.technical,
            ),
            communication: clampDelta(
              parsed.feedback_on_last_answer.score_delta?.communication,
            ),
            confidence: clampDelta(
              parsed.feedback_on_last_answer.score_delta?.confidence,
            ),
          },
        };
      }
      if (typeof parsed.is_interview_complete === "boolean") {
        aiResponse.is_interview_complete = parsed.is_interview_complete;
      }

      // Force completion if we've hit the question limit
      if (isLastQuestion) {
        aiResponse.is_interview_complete = true;
      }
    } catch (aiErr: any) {
      console.error("AI response error:", aiErr.message);
      aiResponse.feedback_on_last_answer.improvement = `[AI SERVICE ERROR: ${aiErr.message}] Try checking your API key. ${aiResponse.feedback_on_last_answer.improvement}`;
    }

    const { score_delta } = aiResponse.feedback_on_last_answer;

    // Update the current question with feedback
    if (interview.questions[currentIdx]) {
      interview.questions[currentIdx].feedback = {
        positive: aiResponse.feedback_on_last_answer.positive,
        improvement: aiResponse.feedback_on_last_answer.improvement,
      };
      interview.questions[currentIdx].scoreDelta = score_delta;
    }

    // Update running scores (clamped 0-100)
    const scores = interview.scores || {
      technical: 50,
      communication: 50,
      confidence: 50,
    };
    scores.technical = clampScore(scores.technical + score_delta.technical);
    scores.communication = clampScore(
      scores.communication + score_delta.communication,
    );
    scores.confidence = clampScore(scores.confidence + score_delta.confidence);
    interview.scores = scores;
    interview.markModified("scores");

    // Add next question if interview is not complete
    if (!aiResponse.is_interview_complete) {
      interview.questions.push({
        question: aiResponse.next_question,
        answer: "",
        feedback: { positive: "", improvement: "" },
        scoreDelta: { technical: 0, communication: 0, confidence: 0 },
        score: 0,
      });
      interview.currentQuestionIndex = currentIdx + 1;
    } else {
      interview.status = "completed";
    }

    interview.markModified("questions");
    await interview.save();

    res.status(200).json({
      feedback: aiResponse.feedback_on_last_answer,
      verdict: aiResponse.verdict,
      nextQuestion: aiResponse.is_interview_complete
        ? null
        : aiResponse.next_question,
      questionNumber: aiResponse.is_interview_complete
        ? questionNumber
        : questionNumber + 1,
      totalQuestions: interview.numberOfQuestions,
      scores,
      scoreDelta: score_delta,
      sentiment: (aiResponse as any).sentiment || "Observing...",
      isFinished: aiResponse.is_interview_complete,
    });
  } catch (error: any) {
    console.error("Submit answer error:", error.message);
    res.status(500).json({ message: "Failed to process answer." });
  }
};

// ═══════════════════════════════════════════════════════════
// EVALUATE INTERVIEW — Generate final report with SWOT
// ═══════════════════════════════════════════════════════════

const evaluateInterview = async (req: any, res: Response) => {
  const { interviewId } = req.params;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview)
      return res.status(404).json({ message: "Interview session not found." });

    // Use actual running scores as the base — these were accumulated during the interview
    const runningTech = interview.scores?.technical ?? 50;
    const runningComm = interview.scores?.communication ?? 50;
    const runningConf = interview.scores?.confidence ?? 50;
    const runningOverall = Math.round(runningTech * 0.4 + runningComm * 0.3 + runningConf * 0.3);

    // Build transcript
    const answeredQuestions = interview.questions.filter(q => q.answer && q.answer.trim().length > 5);
    const transcript = interview.questions
      .map(
        (q, i) =>
          `Q${i + 1}: ${q.question}\nA${i + 1}: ${q.answer || "[No answer provided]"}`,
      )
      .join("\n\n");

    const evalPrompt = buildEvaluationPrompt(
      interview.role || "Software Engineer",
      interview.experienceLevel || "Mid",
      transcript,
      interview.interviewType || "technical",
    );

    // Seed fallback with REAL running scores
    let evaluation: any = {
      communicationScore: runningComm,
      technicalScore: runningTech,
      confidenceScore: runningConf,
      overallScore: runningOverall,
      strengths: answeredQuestions.length > 0 
        ? ["Completed the interview session", "Attempted all questions", "Engaged with the interviewer"]
        : ["Completed the interview session", "Attempted all questions"],
      weaknesses: ["Could provide more specific technical examples with metrics"],
      opportunities: ["Deep-dive into system design", "Practice behavioral questions with STAR method"],
      threats: ["May struggle with advanced topics under time pressure"],
      topDoneWell: [
        "Showed up and completed the full interview session",
        "Communicated ideas in a structured manner",
        "Demonstrated baseline knowledge of the required stack",
      ],
      topToImprove: [
        "Add quantifiable metrics to project descriptions",
        "Use STAR method for behavioral answers",
        "Practice explaining technical tradeoffs in depth",
      ],
      suggestedResources: [
        "System Design Interview by Alex Xu",
        "LeetCode Top 150 problems",
        "Cracking the Coding Interview",
      ],
      summary: `${runningOverall >= 70 ? "HIRE." : "NO HIRE."} The candidate ${runningOverall >= 70 ? "demonstrated adequate knowledge" : "needs further preparation"} for the ${interview.role || "role"} position. Technical score: ${runningTech}/100, Communication: ${runningComm}/100, Confidence: ${runningConf}/100.`,
    };

    try {
      const parsed = await callTogetherAI(
        evalPrompt,
        `Running scores accumulated during interview — Technical: ${runningTech}/100, Communication: ${runningComm}/100, Confidence: ${runningConf}/100. Use these as your baseline when scoring. Generate the full evaluation report as JSON.`,
      );

      // Only merge valid non-zero AI scores — if AI returns 0s, keep running scores
      if (parsed.communicationScore && parsed.communicationScore > 0)
        evaluation.communicationScore = parsed.communicationScore;
      if (parsed.technicalScore && parsed.technicalScore > 0)
        evaluation.technicalScore = parsed.technicalScore;
      if (parsed.confidenceScore && parsed.confidenceScore > 0)
        evaluation.confidenceScore = parsed.confidenceScore;

      // Recalculate overall from final scores
      evaluation.overallScore = Math.round(
        evaluation.technicalScore * 0.4 +
        evaluation.communicationScore * 0.3 +
        evaluation.confidenceScore * 0.3
      );
      if (parsed.overallScore && parsed.overallScore > 0)
        evaluation.overallScore = parsed.overallScore;

      // Merge text fields if present
      if (parsed.strengths?.length > 0) evaluation.strengths = parsed.strengths;
      if (parsed.weaknesses?.length > 0) evaluation.weaknesses = parsed.weaknesses;
      if (parsed.opportunities?.length > 0) evaluation.opportunities = parsed.opportunities;
      if (parsed.threats?.length > 0) evaluation.threats = parsed.threats;
      if (parsed.topDoneWell?.length > 0) evaluation.topDoneWell = parsed.topDoneWell;
      if (parsed.topToImprove?.length > 0) evaluation.topToImprove = parsed.topToImprove;
      if (parsed.suggestedResources?.length > 0) evaluation.suggestedResources = parsed.suggestedResources;
      if (parsed.summary) evaluation.summary = parsed.summary;

    } catch (aiErr: any) {
      console.error("Evaluation AI error:", aiErr.message);
      // Keep fallback with real running scores
    }

    interview.evaluation = evaluation;
    interview.status = "completed";
    await interview.save();

    res.status(200).json({ evaluation });
  } catch (error: any) {
    console.error("Evaluate interview error:", error.message);
    res.status(500).json({ message: "Failed to generate evaluation." });
  }
};

// ═══════════════════════════════════════════════════════════
// GET INTERVIEWS — Fetch user's interview history
// ═══════════════════════════════════════════════════════════

const getInterviews = async (req: any, res: Response) => {
  try {
    const interviews = await Interview.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(interviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch interview history." });
  }
};

// ═══════════════════════════════════════════════════════════
// GET ALL CANDIDATES — Admin/recruiter view
// ═══════════════════════════════════════════════════════════

const getAllCandidates = async (req: any, res: Response) => {
  try {
    const interviews = await Interview.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(interviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch candidates." });
  }
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function clampScore(val: number): number {
  return Math.max(0, Math.min(100, Math.round(val)));
}

export {
  startInterview,
  submitAnswer,
  evaluateInterview,
  getInterviews,
  getAllCandidates,
};
