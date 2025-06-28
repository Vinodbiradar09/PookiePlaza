import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



const protectedAuth = asyncHandler(async(req , res , next)=>{
   try {
     const tokens = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
     if(!tokens){
        throw new ApiError(403 , "UnAuthorized User");
     }
     const decodedToken =  jwt.verify(tokens , process.env.ACCESS_TOKEN_SECRET);
     if(!decodedToken){
        throw new ApiError(401 , "Failed to get the decoded token");
     }
     const user = await User.findById(decodedToken._id).select("-password -refreshTokens");
     if(!user){
        throw new ApiError(403 , "failed to find the user by decoded tokens");
     }

     req.user = user;
     next();
   } catch (error) {
        throw new ApiError( 404 , error.message || "InValid Tokens");
   }
})

export{protectedAuth};
