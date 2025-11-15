import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import http from "http";
import cookieParser from "cookie-parser";
import { GoogleGenAI } from '@google/genai';
import { Server } from "socket.io";

// Routes
import registerRoutes from "./routes/register.route.js";
import taskRoutes from "./routes/task.route.js";
import jobRoutes from "./routes/jobs.route.js";
import { connectDb } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Good practice to have a fallback
const __dirname = path.resolve();

// 1. Create the HTTP server explicitly to share with Express and Socket.io
const server = http.createServer(app);

// 2. Initialize Socket.io attached to that server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080", // Match your Express CORS origin for consistency
        methods: ["GET", "POST"]
    },
});

// --- Middleware ---
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));

// Only use this once (handles the limit)
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// --- Routes ---
app.use("/api/tasks", taskRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/jobs", jobRoutes);

// --- Gemini Setup ---
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

app.post('/api/optimize-cv', async (req, res) => {

    try {
        const { resumeText, userInstruction } = req.body;

        if (!resumeText) {
            return res.status(400).json({ error: "Resume text is required." });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
            You are an expert AI Resume Builder and Career Coach.
            Rewrite and optimize the resume based on the following instruction:

            USER INSTRUCTION:

            ${userInstruction || "Improve grammar, tone, and clarity."}

            RAW RESUME TEXT:

            ${resumeText}

            OUTPUT REQUIREMENTS:
            - Only output the improved resume.
            - Use Markdown formatting.
            - No extra explanations or commentary.
        `,
        });

        res.json({
            success: true,
            data: response.text
        });
    } catch (error) {
        console.error("Error generating CV:", error);
        res.status(500).json({
            success: false,
            error: "Failed to process the request. Please try again."
        });
    }
});

app.post('/api/ai-assistant', async (req, res) => {
    try {
        const { userMessage, jobsData, userData } = req.body

        if (!userMessage) {
            return res.status(400).json({ error: "Prompt is required." });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                You are "TaskLink Advisor," an expert career coach integrated into the TaskLink platform.
                Your task is to analyze a user's profile and a list of available jobs, then provide a single, top recommendation for the user.
                You should make the message concise to give the user what it needs, remember that.
                DO NOT USE MARKUP JUST TEXT AND ONLY TELL THE USER THE DATA YOU GET DONT'T INVENT JOBS.

                You MUST follow these rules:
                1.  **PERSONA:** You are professional, encouraging, and insightful.
                2.  **GOAL:** Recommend the *single best job* for the user from the list.
                3.  **PRIMARY CRITERIA (Skills):** This is the most important factor. Analyze the user's 'skills' string and compare it to each job's 'skills' string. Count the number of matches.
                4.  **SECONDARY CRITERIA (Location & Type):**
                    * **Location:** Strongly prefer jobs that match the user's 'location'.
                    * **Employment Type:** Note if the job's 'employmentType' (e.g., "remote", "on-site") aligns with the user's profile or seems like a good fit.
                5.  **TERTIARY CRITERIA (Context):**
                    * **Description:** Analyze the user's 'bio' against the job's 'description' for contextual fit (e.g., user's experience level, stated interests).
                    * **Company:** Mention the 'company.name' and its relevance (e.g., "This role at [Company Name] seems perfect because...").
                6.  **OUTPUT FORMAT:**
                    * Start with a clear, direct recommendation (e.g., "Based on your profile, the best match for you is the [Job Name] position at [Company Name].").
                    * Provide a step-by-step "Why it's a match:" section.
                    * In your reasoning, explicitly reference the skills, location, and other criteria you used to make your decision.

                ---
                HERE IS THE DATA TO ANALYZE:
                ---
                
                **1. THE USER'S PROFILE:**
                ${JSON.stringify(userData, null, 2)}

                **2. THE LIST OF AVAILABLE JOBS:**
                ${JSON.stringify(jobsData, null, 2)}

                ---
                HERE IS THE USER'S REQUEST:
                ---

                "${userMessage}"

                Provide your expert recommendation now.
                `,
        });

        res.json({
            success: true,
            data: response.text
        });
    } catch (error) {
        console.error("Error sending a response:", error);
        res.status(500).json({
            success: false,
            error: "Failed to process the request. Please try again."
        });
    }
});

// --- Socket Logic ---
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // 1. Handle Joining Rooms
    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    // 2. Handle Sending Messages to Specific Room
    socket.on("send_message", (data) => {
        const { room, message } = data;
        console.log("message", message);

        // Broadcast to everyone in the room EXCEPT the sender
        // (This works perfectly with your frontend logic because 
        // your frontend adds its own message manually)
        socket.to(room).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// --- Start Server ---
// Listen on 'server', not 'app'
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
    connectDb();
});