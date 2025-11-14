import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getTasks } from "../controllers/user.tasks.js";
import { getTasksB,createTask,updateTask } from "../controllers/business.tasks.js"

const router=express.Router()

router.use(protectedRoute)

router.get("/user/getTasks",getTasks)

router.get("/business/getTasks",getTasksB)
router.post("/business/createTask",createTask)
router.patch("/business/updateTask/:id",updateTask)

export default router