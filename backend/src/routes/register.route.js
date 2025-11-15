import express from 'express';
import { signupU,loginU,logoutU, updateUserU } from '../controllers/auth.user.controller.js';
import { signupB,loginB,logoutB, updateBusinessB  } from '../controllers/auth.business.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router=express.Router();

router.post("/user/signup",signupU)
router.post("/user/login",loginU)
router.get("/user/logout",logoutU)
router.patch("/user/update",protectedRoute,updateUserU)

router.post("/business/signup",signupB)
router.post("/business/login",loginB)
router.get("/business/logout",logoutB)
router.patch("/business/update",protectedRoute,updateBusinessB)


export default router