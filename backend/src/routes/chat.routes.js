import { Router } from "express";
import {getStreamTokens} from "../controllers/chat.controller.js"
import { protectedAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/token").get(protectedAuth , getStreamTokens);
export default router;