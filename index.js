const express = require("express");
//create app.
const app = express();
// adding other library
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

//using exported route
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
// to use 
dotenv.config();
//to connect to mongodb using mongoose (making connection)
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));
//adding middleware
app.use(express.json()); //bug imparser
app.use(helmet());
app.use(morgan("common"));
// using app
// "/" means homepage.
// app.get("/", (req, res) => {
//     res.send("welcome to homepage");
// });
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute); //address for rest api,whenever we go to /api/users it is going to run userRoute.
app.use("/api/posts", postRoute);

app.listen(8800, () => {
    console.log("Backend server is running");
});