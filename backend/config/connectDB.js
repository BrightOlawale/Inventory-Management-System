const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB Connected successfully...")
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}


module.exports = connectDB