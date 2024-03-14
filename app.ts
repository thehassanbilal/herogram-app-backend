import express from "express";
import { login, signUp } from "./controllers/auth";
const cors = require("cors");
import { getUserById } from "./controllers/user";
require("dotenv").config();
const connectDB = require("./db");
const multer = require("multer");
const path = require("path");
import fs from "fs";

const app: express.Application = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    // Check if the file is an image or a video
    const isImage = file.mimetype.startsWith("image/");
    const uploadFolder = isImage ? "uploads/images" : "uploads/videos";
    cb(null, uploadFolder);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Rename the file with a unique identifier
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// Upload endpoint
app.post(
  "/api/upload",
  upload.single("file"),
  (req: express.Request, res: express.Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    return res.status(200).json({ message: "File uploaded successfully" });
  }
);

app.get("/api/images", (req: express.Request, res: express.Response) => {
  const imagesDir = path.join(__dirname, "uploads/images");
  fs.readdir(imagesDir, (err: any, files: any) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const images = files.map((file: any) => `/uploads/images/${file}`);
    res.json(images);
  });
});

app.get("/api/videos", (req: express.Request, res: express.Response) => {
  const videosDir = path.join(__dirname, "uploads/videos");
  fs.readdir(videosDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const videos = files.map((file) => `/uploads/videos/${file}`);
    res.json(videos);
  });
});

app.post("/api/login", login);
app.post("/api/signup", signUp);

app.get("/api/user/:id", getUserById);

const port = process.env.PORT || 3030;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
