import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { 
    getJobs,
    sendApplication
} from "../controllers/user.jobs.js";
const router=express.Router()

router.use(protectedRoute)

router.get("/user/getJobs",getJobs)
router.post("user/:jobId/sendApplication", sendApplication);

export default router
