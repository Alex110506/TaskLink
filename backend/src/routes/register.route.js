import express from 'express';
import { signupU,loginU,logoutU,getUserProfileU, updateUserU } from '../controllers/auth.user.controller.js';
import { signupB,loginB,logoutB,getBusinessProfileB, updateBusinessB  } from '../controllers/auth.business.controller.js';

const router=express.Router();

router.post("/user/signup",signupU)
router.post("/user/login",loginU)
router.get("/user/logout",logoutU)
router.patch("/user/update/:id",updateUserU)
router.get("/user/profileInfo/:id",getUserProfileU)

router.post("/business/signup",signupB)
router.post("/business/login",loginB)
router.get("/business/logout",logoutB)
router.patch("/business/update/:id",getBusinessProfileB)
router.get("/business/profileInfo/:id",updateBusinessB)


export default router