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
//
const multer = require("multer");
//to prevent the restapi to make get request to the file location.
const path = require("path");
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
//it will prevent any request on /images instead it will go to public/images directory.
app.use("/images", express.static(path.join(__dirname, "public/images")));
//adding middleware
app.use(express.json()); //bug imparser
app.use(helmet());
app.use(morgan("common"));

// to indicate storage and directory for the upload files.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        //req.body.name contains the filename which we will send to client side. 
        cb(null, req.body.name);
    },
});
const upload = multer({ storage: storage });
//writting a request here for uploading files.(we can do this by making separate routes like before . like we did for users ,posts)
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        //  upload.single() will automatically upload our file ,so we will just return the response.
        return res.status(200).json("file uploaded successfully.");
    }
    catch (error) {
        console.log(error);
    }
})
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