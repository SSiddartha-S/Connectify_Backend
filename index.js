import express from "express"; // Import Express framework
import bodyParser from "body-parser"; // Middleware for parsing request bodies
import mongoose from "mongoose"; // MongoDB object modeling
import cors from "cors"; // Middleware for enabling CORS
import dotenv from "dotenv"; // Load environment variables
import multer from "multer"; // Middleware for handling file uploads
import helmet from "helmet"; // Security middleware
import morgan from "morgan"; // HTTP request logger
import path from "path"; // Node.js path module
import { fileURLToPath } from "url"; // Module to handle file paths in ES modules
import authRoutes from "./routes/auth.js"; // Authentication routes
import userRoutes from "./routes/users.js"; // User-related routes
import postRoutes from "./routes/posts.js"; // Post-related routes
import { register } from "./controllers/auth.js"; // Register controller
import { createPost } from "./controllers/posts.js"; // Create post controller
import { verifyToken } from "./middleware/auth.js"; // Middleware to verify tokens
import User from "./models/User.js"; // User model
import Post from "./models/Post.js"; // Post model
import { users, posts } from "./data/index.js"; // Sample data

// Configs
const __filename = fileURLToPath(import.meta.url); // Get the current filename
const __dirname = path.dirname(__filename); // Get the directory name
dotenv.config(); // Load environment variables from .env file

const app = express(); // Initialize Express app

app.use(helmet()); // Use Helmet for security
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // Log requests in dev format
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.json({ limit: "30mb", extended: true })); // Body parser for JSON
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // Body parser for URL-encoded data

// Serve static assets
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));


// Storage configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets"); // Destination for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use original file name
    }
});
const upload = multer({ storage }); // Initialize multer with storage config

// Routes
app.post("/auth/register", upload.single("picture"), register); // Register route with file upload
app.post("/posts", verifyToken, upload.single("picture"), createPost); // Create post route

// Use defined routes for authentication, users, and posts
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 6001; // Set the port
// mongoose.connect(process.env.MONGO_URL)
mongoose
  .connect("mongodb+srv://connectify1:sricharan123@cluster0.kz6hjzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: false,
    useUnifiedTopology: false,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`)); // Start server and log the port
        // Uncomment these if you want to seed your database
        //  User.insertMany(users); // Insert sample users
        //  Post.insertMany(posts); // Insert sample posts
    })
    .catch((error) => console.log(`${error} did not connect`)); // Log connection errors
