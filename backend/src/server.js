import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import http from "http";
import cookieParser from "cookie-parser";
import { GoogleGenAI } from '@google/genai';
import { Server } from "socket.io";
import { fileURLToPath } from "url"; // Required to fix __dirname in production

// Routes
import registerRoutes from "./routes/register.route.js";
import taskRoutes from "./routes/task.route.js";
import jobRoutes from "./routes/jobs.route.js";
import { connectDb } from "./lib/db.js";

dotenv.config();

// --- Production Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Correctly gets the current directory
const PORT = process.env.PORT || 5001;

// Allow specific domains or fallback to localhost for dev
// In production, set CLIENT_URL in your .env file (e.g., https://my-app.com)
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8080";

const app = express();
const server = http.createServer(app);

// --- Socket.io Setup ---
const io = new Server(server, {
    cors: {
        origin: [CLIENT_URL, "http://localhost:5001"], // Allow frontend URL and self
        methods: ["GET", "POST"],
        credentials: true
    },
    connectionStateRecovery: {} // Helps recover session if connection drops temporarily
});

// --- Middleware ---
app.use(cors({
    origin: [CLIENT_URL, "http://localhost:5001"],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// --- API Routes ---
app.use("/api/tasks", taskRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/jobs", jobRoutes);

// --- Gemini AI Logic ---
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

app.post('/api/optimize-cv', async (req, res) => {
    try {
        const { resumeText, userInstruction } = req.body;
        if (!resumeText) return res.status(400).json({ error: "Resume text is required." });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
            You are an expert AI Resume Builder and Career Coach.
            Rewrite and optimize the resume based on the following instruction:
            USER INSTRUCTION: ${userInstruction || "Improve grammar, tone, and clarity."}
            RAW RESUME TEXT: ${resumeText}
            OUTPUT REQUIREMENTS:
            - Only output the improved resume.
            - Use Markdown formatting.
            - No extra explanations or commentary.
        `,
        });

        res.json({ success: true, data: response.text });
    } catch (error) {
        console.error("Error generating CV:", error);
        res.status(500).json({ success: false, error: "Failed to process request." });
    }
});

app.post('/api/ai-assistant', async (req, res) => {
    try {
        const { userMessage, jobsData, userData } = req.body;
        if (!userMessage) return res.status(400).json({ error: "Prompt is required." });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                You are "TaskLink Advisor," an expert career coach.
                Your task is to analyze a user's profile and a list of available jobs, then provide a single, top recommendation.
                
                DATA TO ANALYZE:
                1. USER: ${JSON.stringify(userData)}
                2. JOBS: ${JSON.stringify(jobsData)}
                
                USER REQUEST: "${userMessage}"
                
                OUTPUT REQUIREMENTS:
                - Start with a direct recommendation.
                - Explain why based on Skills (primary), Location/Type (secondary), and Context (tertiary).
                - No markup, just text.
                `,
        });

        res.json({ success: true, data: response.text });
    } catch (error) {
        console.error("Error in AI Assistant:", error);
        res.status(500).json({ success: false, error: "Failed to process request." });
    }
});

// --- Production Static File Serving ---
// Logic: This file is likely in /backend or /backend/src. 
// We navigate out to find frontend/dist. 
// Adjust "../frontend/dist" if your folder structure is different.
const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// --- Socket Events ---
io.on("connection", (socket) => {
    // In production, too many logs fill up disk space/logs. Only log connections.
    // console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
    });

    socket.on("send_message", (data) => {
        const { room, message } = data;
        // Broadcast to everyone in the room EXCEPT the sender
        socket.to(room).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
        // console.log("User Disconnected", socket.id);
    });
});

// --- Start Server ---
server.listen(PORT, () => {
    console.log(`Production server running on port ${PORT}`);
    connectDb();
});