// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./utils/db.js";
// import userRoute from "./routes/user.route.js";
// import companyRoute from "./routes/company.route.js";
// import jobRoute from "./routes/job.route.js";
// import applicationRoute from "./routes/application.route.js";
// import messageRoutes from "./routes/message.routes.js";
// import Message from "./models/message.model.js";


// dotenv.config({});

// const app = express();

// // middleware
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(cookieParser());
// const corsOptions = {
//     origin:['http://127.0.0.1:5173', 'http://localhost:5173'],
//     credentials:true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }

// app.use(cors(corsOptions));

// const PORT = process.env.PORT || 3000;


// // api's
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/company", companyRoute);
// app.use("/api/v1/job", jobRoute);
// app.use("/api/v1/application", applicationRoute);



// app.listen(PORT,()=>{
//     connectDB();
//     console.log(`Server running at port ${PORT}`);
// })

// app.use("/api/messages", messageRoutes);

// // Inside socket.io.on("connection"):
// socket.on("sendMessage", async (data) => {
//   io.to(data.roomId).emit("receiveMessage", data);

//   // Save to DB
//   try {
//     const message = new Message(data);
//     await message.save();
//   } catch (err) {
//     console.error("Message save error:", err.message);
//   }
// });

// backend/index.js

// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import dotenv from "dotenv";
// import http from "http";
// import { Server } from "socket.io";

// import connectDB from "./utils/db.js";
// import userRoute from "./routes/user.route.js";
// import companyRoute from "./routes/company.route.js";
// import jobRoute from "./routes/job.route.js";
// import applicationRoute from "./routes/application.route.js";
// import messageRoutes from "./routes/message.routes.js";
// import Message from "./models/message.model.js";

// dotenv.config();

// const app = express();
// const server = http.createServer(app); // Required for socket.io

// const io = new Server(server, {
//   cors: {
//     origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
//   }
// });

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors({
//   origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// // Connect to DB and start server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   connectDB();
//   console.log(`🚀 Server running at port ${PORT}`);
// });

// // API routes
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/company", companyRoute);
// app.use("/api/v1/job", jobRoute);
// app.use("/api/v1/application", applicationRoute);
// app.use("/api/messages", messageRoutes);

// // 💬 SOCKET.IO chat logic
// io.on("connection", (socket) => {
//   console.log("✅ User connected:", socket.id);

//   socket.on("joinRoom", ({ roomId }) => {
//     socket.join(roomId);
//     console.log(`🟡 Joined room: ${roomId}`);
//   });

//   socket.on("sendMessage", async (data) => {
//     try {
//       const message = new Message(data);
//       await message.save();

//       io.to(data.roomId).emit("receiveMessage", data);
//     } catch (err) {
//       console.error("❌ Error saving message:", err.message);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });


// backend/index.js

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import messageRoutes from "./routes/message.routes.js";
import savedJobRoutes from "./routes/savedJob.route.js"; // ✅ New route for saved jobs

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ['https://jobportal-frontend-3uyu.onrender.com', 'https://jobportal-frontend-3uyu.onrender.com'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/messages", messageRoutes);
app.use("/api/saved-jobs", savedJobRoutes); // ✅ Save for later jobs route

// Connect to DB and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running at port ${PORT}`);
});
