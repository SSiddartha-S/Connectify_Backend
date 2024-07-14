import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import {fileURLToPath} from "url";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import {register}  from "./controllers/auth.js";
import  {createPost} from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js"; 
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";



// configs 
const __filename = fileURLToPath(import.meta.url);
//  to get file paths in __filename , fileURLToPath convert to path
const __dirname = path.dirname(__filename);
dotenv.config();
// to read .env files
const app = express();
//app has express.js applications 

app.use(helmet.frameguard({ action: "SAMEORIGIN" }));
// for preventing clickjacking attaks
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

app.use(morgan("dev"));
// here morgan is used for requesests and responses
//dev for shoe them in human-readable form

app.use("/assets", express.static(path.join(__dirname, 'public/assets'), {
    maxAge: '1y',
    // age of cache control header to 1year 
    setHeaders: (res, path) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }}))

app.use(express.json());
// to recieve json data
app.use(helmet());
// helmet used to security of application f
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
// CORP used to load resources from other ports and domains
app.use(morgan("common"));
// it is logging middleware
app.use(bodyParser.json({limit: "30mb", extended: true}));
// boday parser for processing requests , 30mb for size of that allowed body
// extended allows parsing of big data like nested arrays objects
app.use(bodyParser.urlencoded({ limit: "30mb",extended: true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));

//storage of files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // request , file to be uploaded , callback func
        cb(null,"public/assets");
    },
    filename: function (req, file, cb){
        cb(null,file.originalname);
        //cb  function returns its original file name
    }
});
//diskstoragr creayes a storage for storing uploaded files 
//destination is a function 
// here multer is used to store the files given by there name in assets
const upload = multer({ storage });


//routes (files)
app.post("/auth/register",upload.single("picture"), register);
//it waits for post to be uploaded (Picture) and 
//after uploading it call register function

app.post("/posts", verifyToken , upload.single("picture"), createPost );
//  here a route is created for post with a singlo pic

app.use("/auth",authRoutes);
// authRoutes handles authentication routes like login, register, logout

app.use("/users",userRoutes);
// here response and req are passed to userRoutes

app.use("/posts",postRoutes);

//Mongoose 
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
  
}).then(()=> {
    app.listen(PORT,() => console.log(`Server Port: ${PORT}`));

    // User.insertMany(users);
    // Post.insertMany(posts);

}).catch((error) => console.log(`${error} did not connect`));




