import express from "express";
import {
    getUsersForSidebar,
    getCurrentUser,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar); // Only authenticated users can access this route
router.get("/me", protectRoute, getCurrentUser);

export default router;
