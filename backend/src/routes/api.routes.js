import { Router } from "express";
import {registerUser , loginUser , logoutUser , onBoard , getCurrentUser} from "../controllers/auth.controller.js"
import {protectedAuth} from "../middleware/auth.middleware.js"
import {upload} from "../middleware/multer.middleware.js"
const router = Router();

    router.route("/register").post(
    upload.single("profilePic")
    ,registerUser);
    
    router.route("/login").post(loginUser);

    router.route("/logout").post( protectedAuth , logoutUser);

    router.route("/board").post(protectedAuth , onBoard);

    router.route("/user").get(protectedAuth , getCurrentUser);

export default router;

