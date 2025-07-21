import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials : true,
}))

app.use(express.json());
app.use( express.urlencoded({extended : true}));
app.use(cookieParser());

import {authRouter} from "./src/routes/api.routes.js";
import {chatRouter} from "./src/routes/chat.routes.js";
import {userRouter} from "./src/routes/user.routes.js";

app.use("/api/v1/auth" , authRouter);
app.use("/api/v1/chat" , chatRouter);
app.use("/api/v1/user" , userRouter);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

  
    app.get("*" , (req , res)=>{
        res.sendFile(path.join(__dirname , "../frontend" , "dist" , "index.html"));
    });
}

export {app};