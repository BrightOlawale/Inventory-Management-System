const express = require('express');
const connectDB = require('./config/connectDB');
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoute");
const cors = require("cors")
const errorHandler = require("./middleWare/errorMiddleware")
const cookieParser = require("cookie-parser");


const app = express();
const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.send("Briteemah Inventory Management System");
})

//Middleware
app.use(express.json());
// app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api/users", userRoutes);
app.use(errorHandler);
app.use(cookieParser);


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('Server is running on port %s', PORT);
    });    
  } catch (error) {
    console.error(error);
  }
}

startServer();


