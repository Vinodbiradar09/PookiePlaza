// stream.js
import {StreamChat} from "stream-chat"
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;



if(!apiKey || !apiSecret){
    throw new Error("Stream API credentials missing from environment variables");
}

const serverClient = StreamChat.getInstance(apiKey, apiSecret);


const generateStreamToken = (userId) => {
    try {
      
        const userIdStr = userId.toString();
      
        
        if (!userIdStr) {
            throw new Error("Invalid user ID");
        }
        
       
        const token = serverClient.createToken(userIdStr);
        console.log(" Token created:", token);
        console.log(" Token type:", typeof token);
        console.log(" Token length:", token?.length);
        
        if (!token) {
            throw new Error("Failed to generate token");
        }
        
        return token;
    } catch (error) {
        console.error(' Stream token generation error:', error);
        throw error;
    }
}

// ASYNC function - keep asyncHandler
const upsertStreamUser = asyncHandler(async (userData) => {
    const data = await serverClient.upsertUsers([userData]);
    
    if (!data) {
        throw new ApiError(403, "The user data is not here !!");
    }
    
    return data;
})

export {upsertStreamUser, generateStreamToken};