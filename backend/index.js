import { app } from "./app.js";
import { connectDB } from "./src/db.config/db.js";
import dotenv from "dotenv";
dotenv.config();

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000 , ()=>{
         console.log(`server is running at local host ${process.env.PORT}`);
    }) 
})
.catch((err)=>{
  console.log("Connection failed for database" , err);
})