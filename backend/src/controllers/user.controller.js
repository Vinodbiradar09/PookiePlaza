import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { FriendRequest } from "../model/friendReq.model.js";
import { User } from "../model/user.model.js";
import mongoose, { isValidObjectId } from "mongoose";


const sendFriendRequest = asyncHandler(async (req, res) => {
    // first get the senderId , check it 
    // get the reciver Id , check it 
    // match if the sendId === reciverId same 
    // check if both are already friends or not 
    // check the friend request exist between both or not 
    // now send the friend request
    const userId = req.user._id;
    if (!userId) {
        new ApiError(403, "Unauthorized access");
    }
    const { receiverId } = req.params;
    if (!receiverId || !isValidObjectId(receiverId)) {
        throw new ApiError(403, "Invalid Id and format");
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        throw new ApiError(404, "The receiver does not exist");
    }

    if (userId === receiverId) {
        throw new ApiError(402, "can't send request to yourself");
    }

  

    const arefrnds = await User.exists({
        _id : receiverId,
       
        friends : {$in : [userId]}, 
        
    })

    if(arefrnds){
        throw new ApiError(403 , "you both are friends so can't send the request");
    }


    const existingRequest = await FriendRequest.findOne({
        $or: [
            { sender: userId, receiver: receiverId },
            { sender: receiverId, receiver: userId }
        ]
    })

    if (existingRequest) {
        throw new ApiError(403, "The request exist between both of you");
    }

    const friendReq = await FriendRequest.create({
        sender: userId,
        receiver: receiverId
    });

    if (!friendReq) {
        throw new ApiError(404, "Failed to send the friend request");
    }

    res.status(200).json(new ApiResponse(200, friendReq, "Successfully sent the friend request"));

})

const acceptFriendRequest = asyncHandler(async (req, res) => {
    // ok first get the friendRequest Id from the params, check it 
    // now using findById , check it 
    // check if receiver id === req.user._id
    // accept the friend request 

    const { friendRequestId } = req.params;
    if (!friendRequestId || !isValidObjectId(friendRequestId)) {
        throw new ApiError(403, "Invalid format and Id");
    }

    const frndreq = await FriendRequest.findById(friendRequestId);
    if (!frndreq) {
        throw new ApiError(404, "Not found the friend req Id");
    }

    if (frndreq.receiver.toString() !== req.user.id) {
       
        throw new ApiError(403, "you are not allowed to accept the friend request");
    }

    const accepted = await FriendRequest.findByIdAndUpdate(friendRequestId, {
        $set: {
            status: "accepted",
        }
    },
        {
            new: true
        }
    )

    if (!accepted) {
        throw new ApiError(404, "failed to accept the friend request");
    }

    await User.findByIdAndUpdate(frndreq.sender, {
        $addToSet: { // instead of push we are adding addToSet because it prevents duplications , it won't allow duplicate user
            friends: frndreq.receiver,
        }
    },
        {
            new: true,
        }
    )

    await User.findByIdAndUpdate(frndreq.receiver, {
        $addToSet: {
            friends: frndreq.sender,
        }
    },
        {
            new: true,
        }
    )

    res.status(200).json(new ApiResponse(200, { accepted }, "friend request accepted"));


})

const getMyFriends = asyncHandler(async (req, res) => {
    // first get the loggedIn user Id check it 
    // now do the populate for the friends field and send res


    const userId = await req.user._id;
    const { page = 1, limit = 10, search = "" } = req.query;

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid UserId format and Id");
    }
    const skip = (page - 1) * limit;
    const limitInt = parseInt(limit);
    const skipInt = parseInt(skip);

    const user = await User.findById(userId).select("friends");

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const filter =  { _id: { $in: user.friends } };
    if (search) {
        filter.fullName = { $regex: search, $options: "i" };
    }

    const [friends, totalFriends] = await Promise.all([
     await User.find(filter)
            .select("fullName email profilePic nativeLanguage learningLanguage bio location")
            .skip(skipInt)
            .limit(limitInt),

       await User.countDocuments(filter)
    ]);

    res.status(200).json(new ApiResponse(200, {
        friends,
        pagination: {
            currentPage: parseInt(page),
            totalPage: Math.ceil(totalFriends / limitInt),
            totalFriends,
            hasNextPage: (skipInt + limitInt) < totalFriends,
            hasPrevPage: page > 1
        }
    }, friends.length > 0 ? "friends got successfully" : "no friends"

    ));



})

const getRecommendedUsers = asyncHandler ( async (req , res)=>{
 // get the Id of current user 
 const currentUserId = req.user._id;
 const currentUser = req.user;
 if(!currentUserId || !currentUser){
    throw new ApiError(403 , "Unauthorized user");
 }

 const recommendedUsers = await User.find({
    $and : [
        {_id : {$ne : currentUserId}},
        {_id : {$nin : currentUser.friends}},
        {isOnboarded : true}
    ]
 }).select("-password -refreshTokens");
 if(!recommendedUsers){
    throw new ApiError(403 , "Failed to get recommended user");
 }

 res.status(200).json(new ApiResponse(200 , recommendedUsers , "recomendation done successfully"));
})

const getFriendRequest = asyncHandler ( async (req , res)=>{
    // i want to get the sender details 
    // i want to get the receiver details , who accepted my req

    const userId = req.user._id;
    if(!userId){
        throw new ApiError(403 , "user not found");
    }

    const incomingreqs = await FriendRequest.find({
        receiver : userId,
        status : "pending",
    }).populate("sender", "fullName email profilePic nativeLanguage learningLanguage")

    const acceptedreqs = await FriendRequest.find({
        sender : userId,
        status : "accepted",
    }).populate("receiver" , "fullName email profilePic nativeLanguage learningLanguage")

    if(!incomingreqs){
        throw new ApiError(402 , "there is no incoming request");
    }

    if(!acceptedreqs){
        throw new ApiError(403 , "there is no accepted request");
    }

    res.status(200).json(new ApiResponse(200 , {incomingreqs , acceptedreqs} , "success"));
})

const getOutGoingFriendReq = asyncHandler(async (req , res)=>{
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(403 , "Unauthorized userId");
    }

    const outgoingreqs = await FriendRequest.find({
        sender : userId ,
        status : "pending",
    }).populate("receiver" , "fullName email profilePic  nativeLanguage learningLanguage");

    if(!outgoingreqs){
        throw new ApiError(404 , "error in outgoing reqs");
    }

    res.status(200).json(new ApiResponse(200 , outgoingreqs , "suucess"));

})

export { sendFriendRequest, acceptFriendRequest, getMyFriends , getRecommendedUsers , getFriendRequest , getOutGoingFriendReq};

