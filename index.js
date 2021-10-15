const express = require("express");
const app = express();
// adding other library
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
// to use 
dotenv.config();
//to connect to mongodb using mongoose
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Connected to MONGODB");
})
app.listen(8800, () => {
    console.log("Backend server is running");
})