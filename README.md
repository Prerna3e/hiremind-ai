# HireMind AI - Production-Level AI Interview Simulator

HireMind AI is a full-stack platform designed to help students and job seekers practice technical and HR interviews using advanced LLMs. It provides a realistic interview experience with voice support, real-time feedback, and comprehensive analytics.

## 🚀 Features

- **AI Interview Generator**: Tailored questions based on Role, Tech Stack, and Experience.
- **Live Interview Mode**: Interactive chat UI with a persistent AI interviewer.
- **AI Evaluation System**: Instant scoring on technical accuracy, communication, and confidence.
- **Recruiter Dashboard**: Analytics and reports for candidate performance tracking.
- **Stunning UI**: Modern glassmorphism design inspired by Linear and Vercel.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express.js, MongoDB, JWT.
- **AI**: OpenAI API (GPT-4 / GPT-3.5).
- **Icons**: Lucide React.
- **Charts**: Recharts.

---

## ⚙️ Setup Instructions

### Backend Setup
1. Navigate to the `backend/` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file from the template provided (see below).
4. Start the server: `npm run dev`.

### Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. Open `http://localhost:5173` in your browser.

---

## 📄 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

---

## 🧠 How AI Evaluation Works

1. **Per-Answer Feedback**: As the candidate submits each answer, the AI evaluates it for technical correctness and provides immediate, subtle feedback.
2. **Comprehensive Final Analysis**: Upon completion, the entire conversation is analyzed.
3. **Multi-Metric Scoring**: The AI assigns scores (0-100) for:
   - **Technical Ability**: Mastery of the chosen stack.
   - **Communication**: Clarity and structure of explanations.
   - **Confidence**: Tone and conviction in responses.
4. **SWOT Analysis**: Clearly defined Strengths, Weaknesses, and actionable Suggestions for improvement.

---

## 🚢 Deployment Steps

### Frontend (Vercel)
1. Push the code to GitHub.
2. Connect the `frontend/` folder to a new Vercel project.
3. Set the build command to `npm run build` and output directory to `dist`.
4. Add environment variables if needed.

### Backend (Render / Railway)
1. Push the code to GitHub.
2. Select the `backend/` folder on Render.
3. Use the Node.js runtime.
4. Add `MONGO_URI`, `JWT_SECRET`, and `OPENAI_API_KEY` to the environment settings.

---

## 👨‍💻 Project Structure
- `frontend/src/pages`: Interactive routes (Landing, Interview, Dashboard).
- `frontend/src/components/ui`: Premium glassmorphism UI components.
- `backend/src/controllers`: Logic for AI processing and user management.
- `backend/src/models`: Data schemas for Users and Interviews.
