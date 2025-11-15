import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import http from "http"
dotenv.config()
import cookieParser from "cookie-parser"
import { GoogleGenAI } from '@google/genai';
import registerRoutes from "./routes/register.route.js"
import taskRoutes from "./routes/task.route.js"
import jobRoutes from "./routes/jobs.route.js"

import { connectDb } from "./lib/db.js";

const app=express();
const PORT=process.env.PORT

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);



const __dirname=path.resolve()

app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
//test
app.use(express.json())
app.use(cookieParser())

// app.use("/api/chat",chatRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/register",registerRoutes)
app.use("/api/jobs",jobRoutes)



/**
 * POST /optimize-cv
 * Body: { resumeText: string, userInstruction: string }
 */
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



const server = http.createServer(app);


server.listen(PORT,()=>{
    console.log(`listnening on port ${PORT}...`);
    connectDb();
})