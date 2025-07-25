import mongoose,{Schema , model} from "mongoose";

const friendRequestSchema = new Schema(
    
    {
        sender : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        receiver : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        status : {
            type : String,
            enum : ["pending" , "accepted"],
            default : "pending",
        }
    } , 
    
    {timestamps : true}
);

const FriendRequest = model("FriendRequest" , friendRequestSchema);

export {FriendRequest};