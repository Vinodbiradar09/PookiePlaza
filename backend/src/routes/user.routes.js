import { Router } from "express";
import { protectedAuth } from "../middleware/auth.middleware.js";
import {sendFriendRequest , acceptFriendRequest , getMyFriends , getRecommendedUsers , getFriendRequest , getOutGoingFriendReq} from "../controllers/user.controller.js"
const router = Router();


router.route("/sendReq/:receiverId").post(protectedAuth, sendFriendRequest);
router.route("/acceptReq/:friendRequestId").put(protectedAuth, acceptFriendRequest);
router.route("/getMyFrnds").get(protectedAuth, getMyFriends );
router.route("/recomendation").get(protectedAuth, getRecommendedUsers);
router.route("/friendreq").get(protectedAuth, getFriendRequest);
router.route("/outgoingreqs").get(protectedAuth, getOutGoingFriendReq);

export default router;