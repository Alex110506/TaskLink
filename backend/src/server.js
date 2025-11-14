import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import http from "http"
dotenv.config()
import cookieParser from "cookie-parser"

// import authRoutes from "./routes/auth.route.js"
// import userRoutes from "./routes/user.route.js"
// import chatRoutes from "./routes/chat.route.js"
// import DocumentModel from "./models/Document.js";

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
// app.use("/api/tasks",taskRoutes)
// app.use("/api/register",registerRoutes)
// app.use("/api/jobs",jobRoutes)


const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: process.env.NODE_ENV === "production" 
//       ? true
//       : "http://localhost:5173",
//     credentials: true,
//   },
// });



server.listen(PORT,()=>{
    console.log(`listnening on port ${PORT}...`);
    connectDb();
})