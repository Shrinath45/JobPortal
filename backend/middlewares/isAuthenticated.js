import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Ensure dotenv is loaded
dotenv.config();

// const isAuthenticated = async (req, res, next) => {
//     try {
//         if (!process.env.JWT_SECRET) {
//             console.error("⚠️ JWT_SECRET is missing in environment variables!");
//             return res.status(500).json({
//                 message: "Internal server error: JWT secret missing",
//                 success: false,
//             });
//         }

//         const token = req.cookies?.token;
//         if (!token) {
//             return res.status(401).json({
//                 message: "User not authenticated",
//                 success: false,
//             });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (!decoded) {
//             return res.status(401).json({
//                 message: "Invalid token",
//                 success: false,
//             });
//         }

//         req.id = decoded.userId;
//         next();
//     } catch (error) {
//         console.error("JWT Authentication Error:", error.message);
//         return res.status(401).json({
//             message: "Authentication failed",
//             success: false,
//             error: error.message,
//         });
//     }
// };

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "User not authenticated", success: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token", success: false });
        }

        req.id = decoded.userId;  // Set userId from JWT token to req.id
        next();
    } catch (error) {
        console.error("JWT Authentication Error:", error.message);
        return res.status(401).json({ message: "Authentication failed", success: false, error: error.message });
    }
};


export default isAuthenticated;


// import User from "../models/user.model.js"; // import your User model
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// const isAuthenticated = async (req, res, next) => {
//     try {
//         if (!process.env.JWT_SECRET) {
//             console.error("⚠️ JWT_SECRET is missing in environment variables!");
//             return res.status(500).json({
//                 message: "Internal server error: JWT secret missing",
//                 success: false,
//             });
//         }

//         const token = req.cookies?.token;
//         if (!token) {
//             return res.status(401).json({
//                 message: "User not authenticated",
//                 success: false,
//             });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (!decoded) {
//             return res.status(401).json({
//                 message: "Invalid token",
//                 success: false,
//             });
//         }

//         // Attach full user to request
//         const user = await User.findById(decoded.userId).select("-password");
//         if (!user) {
//             return res.status(404).json({ message: "User not found", success: false });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error("JWT Authentication Error:", error.message);
//         return res.status(401).json({
//             message: "Authentication failed",
//             success: false,
//             error: error.message,
//         });
//     }
// };

// export default isAuthenticated;
