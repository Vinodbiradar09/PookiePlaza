import multer from "multer";
import { ApiError } from "../utils/ApiError.js";


const storage = multer.diskStorage({
    destination : (req , file , cb)=>{
        cb(null , "./public/temp")
    },
    filename : (req , file , cb)=>{
        const fileName = file.originalname;
        if(!fileName){
            throw new ApiError(401 , "File name is not available");
        }
        cb(null , fileName);
    }
})

export const upload = multer({storage : storage});