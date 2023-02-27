const express = require('express');
const connectDB = require('./config/connectDB');
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoute");


const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(userRoutes);

app.get("/", (req, res) => {
    res.send("Briteemah Inventory Management System");
})



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


