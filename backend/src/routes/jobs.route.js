import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { 
    getBusinesses,
    getJobs,
    sendApplication
} from "../controllers/user.jobs.js";

import {
    getJobsB,
    createJob,
    acceptCandidate,
    rejectCandidate,
    getUsers
} from "../controllers/business.jobs.js"

const router=express.Router()

router.use(protectedRoute)

router.get("/user/getJobs",getJobs)
router.post("/user/:jobId/sendApplication", sendApplication);
router.get("/user/getBusinesses",getBusinesses)

router.get("/business/getJobs",getJobsB)
router.post("/business/createJob",createJob)
router.patch("/business/acceptCandidate/:id",acceptCandidate)
router.patch("/business/rejectCandidate/:id",rejectCandidate)
router.get("/business/getUsers",getUsers)

export default router
