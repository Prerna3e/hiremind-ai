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

    // Build transcript
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

    let evaluation: any = {
      communicationScore: interview.scores?.communication || 50,
      technicalScore: interview.scores?.technical || 50,
      confidenceScore: interview.scores?.confidence || 50,
      overallScore: Math.round(
        (interview.scores?.technical || 50) * 0.4 +
          (interview.scores?.communication || 50) * 0.3 +
          (interview.scores?.confidence || 50) * 0.3,
      ),
      strengths: ["Completed the full interview", "Attempted all questions"],
      weaknesses: ["Could provide more specific examples"],
      opportunities: [
        "Deep-dive into system design",
        "Practice behavioral questions",
      ],
      threats: ["May struggle with advanced topics under pressure"],
      topDoneWell: [
        "Showed enthusiasm",
        "Communicated ideas clearly",
        "Good problem-solving approach",
      ],
      topToImprove: [
        "Add more technical depth",
        "Use STAR method for behavioral answers",
        "Practice time management",
      ],
      suggestedResources: [
        "System Design Interview by Alex Xu",
        "LeetCode Top 150",
        "Cracking the Coding Interview",
      ],
      summary:
        "The candidate showed potential but needs more preparation in key areas.",
    };

    try {
      const parsed = await callTogetherAI(
        evalPrompt,
        "Generate the full evaluation report as JSON.",
      );
      evaluation = { ...evaluation, ...parsed };
    } catch (aiErr: any) {
      console.error("Evaluation AI error:", aiErr.message);
      // Use fallback evaluation above
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
