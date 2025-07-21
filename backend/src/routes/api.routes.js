import { Router } from "express";
import {registerUser , loginUser , logoutUser , onBoard , getCurrentUser} from "../controllers/auth.controller.js"
import {protectedAuth} from "../middleware/auth.middleware.js"
import {upload} from "../middleware/multer.middleware.js"
const authRouter = Router();

    authRouter.route("/register").post(upload.single("profilePic"),registerUser);
    
    authRouter.route("/login").post(loginUser);

    authRouter.route("/logout").post(protectedAuth, logoutUser);

    authRouter.route("/board").post(protectedAuth, onBoard);

    authRouter.route("/user").get(protectedAuth, getCurrentUser);

export {authRouter};

