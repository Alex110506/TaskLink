import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getTasks } from "../controllers/user.tasks.js";

const router=express.Router()

router.use(protectedRoute)

router.get("/user/getTasks",getTasks)

export default router