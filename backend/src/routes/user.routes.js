import { Router } from "express";
import { protectedAuth } from "../middleware/auth.middleware.js";
import {sendFriendRequest , acceptFriendRequest , getMyFriends , getRecommendedUsers , getFriendRequest , getOutGoingFriendReq} from "../controllers/user.controller.js"
const userRouter = Router();


userRouter.route("/sendReq/:receiverId").post(protectedAuth, sendFriendRequest);
userRouter.route("/acceptReq/:friendRequestId").put(protectedAuth, acceptFriendRequest);
userRouter.route("/getMyFrnds").get(protectedAuth, getMyFriends );
userRouter.route("/recomendation").get(protectedAuth, getRecommendedUsers);
userRouter.route("/friendreq").get(protectedAuth, getFriendRequest);
userRouter.route("/outgoingreqs").get(protectedAuth, getOutGoingFriendReq);

export{userRouter};