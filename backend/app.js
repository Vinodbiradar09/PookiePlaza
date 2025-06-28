import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials : true,
}))

app.use(express.json());
app.use( express.urlencoded({extended : true}));
app.use(cookieParser());

import authRoute from "./src/routes/api.routes.js";
import chatRoute from "./src/routes/chat.routes.js";
import userRoute from "./src/routes/user.routes.js";

app.use("/api/v1/auth" , authRoute);
app.use("/api/v1/chat" , chatRoute);
app.use("/api/v1/user" , userRoute);



export {app};