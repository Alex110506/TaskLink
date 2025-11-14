import express from 'express';
import { signup,login,logout,update } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router=express.Router();

router.post("/user/signup",signup)
router.post("/user/login",login)
router.post("/user/logout",logout)

router.post("/business/signup",signup)
router.post("/business/login",login)
router.post("/business/logout",logout)


export default router