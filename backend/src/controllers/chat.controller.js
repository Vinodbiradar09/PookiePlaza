
import {generateStreamToken} from "../db.config/stream.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getStreamTokens = asyncHandler(async (req, res) => {
    console.log(" getStreamTokens called");
    
    const userId = req.user._id;
    console.log(" User ID from request:", userId);
    console.log(" User ID type:", typeof userId);
    
    if (!userId) {
        throw new ApiError(404, "Unauthorized user");
    }

    try {
        console.log("🎫 About to generate token...");
      
        const tokens = generateStreamToken(userId);
        console.log(" Received tokens:", tokens);
        console.log(" Tokens type:", typeof tokens);
        
        if (!tokens) {
            console.log(" Tokens are falsy!");
            throw new ApiError(403, "Tokens are not generated");
        }

       
        res.status(200).json(new ApiResponse(200, { tokens }, "Successfully got the tokens"));
        
    } catch (error) {
        console.error(" Error in getStreamTokens:", error);
        throw new ApiError(500, "Failed to generate stream tokens: " + error.message);
    }
});

export {getStreamTokens};