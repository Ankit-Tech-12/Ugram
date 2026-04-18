import express, { json, urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(cookieParser())
app.use(express.static("/public"))


import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"

//route declaration

app.use("/api/v1/users",userRouter)  //https://localhost:8000/api/v1/users...
app.use("/api/v1/posts", postRouter); 
export default app;