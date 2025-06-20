import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import msgRoutes from "./routes/msg.route.js";
import cors from "cors";
import path from "path";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/msg", msgRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../Frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
//   });
// }

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../../Frontend/dist");
  const indexPath = path.join(distPath, "index.html");
  console.log("🔹 NODE_ENV:", process.env.NODE_ENV);
  console.log("🔹 Checking dist at:", distPath);
  console.log("🔹 Checking index.html:", indexPath);
  
  app.use(express.static(distPath));
  app.get("*", (req, res) => res.sendFile(indexPath));
}

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });
