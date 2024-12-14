const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const authRoute = require('./Routes/auth.js');
const userRoute = require('./Routes/user.js');
const doctorRoute = require('./Routes/doctor.js');
const reviewRoute = require('./Routes/review.js');
const path= require('path')


dotenv.config();

const app = express()
const port = process.env.PORT || 5050

const corsOptions = {
    origin: true
}

// app.get('/', (req,res)=>{
//     res.send('Api is working')
// })

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
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/reviews', reviewRoute);


app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve the frontend's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Undefined Route Implement
app.use("*",(req,res)=>{
    res.status(404).json({status:"fail",data:"Not Found"})
})

app.listen(port, ()=>{
    console.log('Server is running on port ' + port);
})