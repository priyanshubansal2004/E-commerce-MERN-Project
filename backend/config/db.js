const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongoose Connected")
    }catch(err){
        console.error("Connection failed" , err);
    }
}

module.exports = connectDB;