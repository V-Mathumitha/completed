import express from "express";
import cors from'cors'
import { adminRouter } from "./routes/AdminRoute.js";


const app = express();
app.use(cors({
    origin:["http://localhost:3000"],
    methods:['GET','POST','PUT'],
    credentials:true
}))

app.use(express.json())
app.use('/',adminRouter)

app.listen(5000,()=>{
    console.log("server is running")
})

export default app