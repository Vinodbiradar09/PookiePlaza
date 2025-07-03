import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../model/user.model.js";
import {upsertStreamUser , generateStreamToken} from "../db.config/stream.js";
import {uploadOnCloudinary , deleteOnCloudinary} from "../utils/cloudinary.js"



const generateAccessRefreshTokens = async ( userId) =>{
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404 , "user not found");
    }
   const accessToken =  await user.generateAccessToken();
   const refreshToken = await user.generateRefreshToken(); 

  

   user.refreshTokens = refreshToken;
 await user.save({ validateBeforeSave: false });

   return {accessToken , refreshToken};
}

const cookieOptions = {
    httpOnly: true,
     secure: true,
}
const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, password} = req.body;

  
    if ([fullName, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    
    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

   
    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new ApiError(409, "User with email already exists");
    }

   
    const profilePicLocalPath = req.file?.path;
    if (!profilePicLocalPath) {
        throw new ApiError(400, "Profile picture is required");
    }

    const profilePic = await uploadOnCloudinary(profilePicLocalPath);
    if (!profilePic?.secure_url) {
        throw new ApiError(500, "Failed to upload profile picture");
    }

  
    const user = await User.create({
        email,
        fullName,
        password,
        profilePic: profilePic.secure_url
    });

    if (!user) {
        throw new ApiError(500, "Failed to create user");
    }

   
    try {
        await upsertStreamUser({
            id: user._id.toString(),  
            name: user.fullName,
            image: user.profilePic || ""
        });
        console.log(`New Stream user created: ${user.fullName}`);
    } catch (error) {
        console.error("Stream user creation error:", error);
      
    }

   
    const createdUser = await User.findById(user._id).select("-password");

   
    res.status(201).json(
        new ApiResponse(201, {
            user: createdUser,
            message: "User registered successfully"
        })
    );
});

const loginUser = asyncHandler ( async (req , res)=>{
  
    const {email , password} = req.body;

    if(!email && !password){
        throw new ApiError(403 , "the email and password are required");
    }

    const user = await User.findOne({email : email});

    if(!user){
        throw new ApiError(403 , "User not found");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(404 , "Invalid password");
    }

    const {accessToken , refreshToken} = await generateAccessRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshTokens");
    if(!loggedInUser){
        throw new ApiError(404 , "loggedIn user not found");
    }

   return res.status(200)
   .cookie("accessToken" , accessToken , cookieOptions)
   .cookie("refreshToken" , refreshToken , cookieOptions)
   .json(new ApiResponse(200  , {loggedUser : loggedInUser , accessToken , refreshToken} , "successfully loggedIn user"));

} )

const logoutUser = asyncHandler(async ( req , res)=>{
  

    const userId = req.user._id;
    if(!userId){
        throw new ApiError(401 , "Empty userId");
    }
    await User.findByIdAndUpdate(userId , {
        $unset : {
            refreshTokens : 1,
        }
    },
    {
        new : true,
    })

   return res.status(200)
    .clearCookie("accessToken" , cookieOptions)
    .clearCookie("refreshToken" , cookieOptions)
    .json(new ApiResponse(200 , {} , "loggedOut successfully"));

})

const onBoard = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(403, "userId is not available");
    }

    const { fullName, bio ,nativeLanguage, learningLanguage, location } = req.body;

    console.log("f" , fullName);
  
    if ([ fullName ,bio , nativeLanguage, learningLanguage, location].some((field) => 
        !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

  
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                bio,
                fullName,
                nativeLanguage,
                learningLanguage,
                location,
                isOnboarded: true  
            }
        },
        { new: true }
    ).select("-password -refreshTokens")

    if (!user) {
        throw new ApiError(404, "Failed to update user details");
    }

    // Sync with Stream
    try {
        await upsertStreamUser({
            id: user._id.toString(),
            name: user.fullName,  
            email: user.email,
            image: user.profilePic || "",
        });
        console.log(`stream user updated after on boarding ${user.fullName}`);
    } catch (error) {
        console.error("Stream sync failed:", error.message);
     
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Onboarding completed successfully")
    );
});

const getCurrentUser = asyncHandler(async(req , res)=>{
    const user = req.user;
    if(!user){
        throw new ApiError(403 , "unauthorized user");
    }

    return res.status(200).json(new ApiResponse(200 , {user} , "current loggedInUser"));
})



export{registerUser , loginUser , logoutUser , onBoard , getCurrentUser };

