const mongoose = require("mongoose");

const connectDB = async()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log("db is connected");
    } catch (error) {
        console.log(error);
    }
   
}

module.exports = connectDB;