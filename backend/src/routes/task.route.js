import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getTasks, getTeams } from "../controllers/user.tasks.js";
import { getTasksB,createTask,updateTask, getAssignedUsersByBusiness } from "../controllers/business.tasks.js"

const router=express.Router()

router.use(protectedRoute)

router.get("/user/getTasks",getTasks)
router.get("/user/getTeams",getTeams)

router.get("/business/getTasks",getTasksB)
router.post("/business/createTask",protectedRoute,createTask)
router.patch("/business/updateTask/:id",updateTask)
router.get("/business/getUsers",protectedRoute,getAssignedUsersByBusiness)

export default router