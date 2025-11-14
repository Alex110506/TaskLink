import express from 'express';
import { signup,login,logout,getUserProfile, updateUser } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router=express.Router();

router.post("/user/signup",signup)
router.post("/user/login",login)
router.get("/user/logout",logout)
router.patch("/user/update/:id",updateUser)
router.get("/user/profileInfo/:id",getUserProfile)

router.post("/business/signup",signup)
router.post("/business/login",login)
router.get("/business/logout",logout)
router.patch("/business/update/:id",logout)
router.get("/business/profileInfo/:id",logout)


export default router