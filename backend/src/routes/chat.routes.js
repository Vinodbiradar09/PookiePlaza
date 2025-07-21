import { Router } from "express";
import {getStreamTokens} from "../controllers/chat.controller.js"
import { protectedAuth } from "../middleware/auth.middleware.js";

const chatRouter = Router();

chatRouter.route("/token").get(protectedAuth, getStreamTokens);
export {chatRouter};