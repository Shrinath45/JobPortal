// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// // Ensure dotenv is loaded
// dotenv.config();


// // const isAuthenticated = async (req, res, next) => {
// //     try {
// //         const token = req.cookies?.token;
// //         if (!token) {
// //             return res.status(401).json({ message: "User not authenticated", success: false });
// //         }

// //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //         if (!decoded) {
// //             return res.status(401).json({ message: "Invalid token", success: false });
// //         }

// //         req.id = decoded.userId;  // Set userId from JWT token to req.id
// //         next();
// //     } catch (error) {
// //         console.error("JWT Authentication Error:", error.message);
// //         return res.status(401).json({ message: "Authentication failed", success: false, error: error.message });
// //     }
// // };

// const isAuthenticated = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({ message: "User not authenticated", success: false });
//         }

//         const token = authHeader.split(" ")[1];
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         req.id = decoded.userId;
//         next();
//     } catch (error) {
//         console.error("JWT Authentication Error:", error.message);
//         return res.status(401).json({ message: "Authentication failed", success: false });
//     }
// };



// export default isAuthenticated;

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.id = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error.message);
    return res.status(401).json({ message: "Authentication failed", success: false });
  }
};

export default isAuthenticated;
