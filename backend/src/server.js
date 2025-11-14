import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import http from "http"
dotenv.config()
import cookieParser from "cookie-parser"

import registerRoutes from "./routes/register.route.js"
import taskRoutes from "./routes/task.route.js"
import jobRoutes from "./routes/jobs.route.js"

import { connectDb } from "./lib/db.js";

const app=express();
const PORT=process.env.PORT

const __dirname=path.resolve()

app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? true // allow same-origin in production
    : "http://localhost:5173",
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser())

// app.use("/api/chat",chatRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/register",registerRoutes)
app.use("/api/jobs",jobRoutes)


const server = http.createServer(app);



server.listen(PORT,()=>{
    console.log(`listnening on port ${PORT}...`);
    connectDb();
})