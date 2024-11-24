import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const port = process.env.PORT || 5050

const corsOptions = {
    origin: true
}

app.get('/', (req,res)=>{
    res.send('Api is working')
})

//database connection
mongoose
    .set('strictQuery',false)
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Connected to DB')
    })
    .catch((err)=>{
        console.log(err.message)
    });

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


app.listen(port, ()=>{
    console.log('Server is running on port ' + port);
})