import express from "express"
import cors from "cors"
import {config} from "./config.js"
import { registerUploadroutes } from "./routes/Upload.js"




const app=express()
app.use(cors())
app.use(express.json())
const port=process.env.PORT

app.get("/",(req,res)=>{
    res.json({ok:true,service:"mail-process"})
})
 registerUploadroutes(app)

app.listen(config.port,()=>{
    console.log("app is running on port",port);
    
})
