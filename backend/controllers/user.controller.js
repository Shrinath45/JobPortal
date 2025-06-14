import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// export const register = async (req, res) => {
//     try {
//         const { fullname, email, phoneNumber, password, role } = req.body;

//         if (!fullname || !email || !phoneNumber || !password || !role) {
//             return res.status(400).json({
//                 message: "Something is missing",
//                 success: false
//             });
//         }

//         const file = req.file;
//         const fileUri = getDataUri(file);
//         const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 message: 'User already exists with this email.',
//                 success: false,
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         await User.create({
//             fullname,
//             email,
//             phoneNumber,
//             password: hashedPassword,
//             role,
//             profile: {
//                 profilePhoto: cloudResponse.secure_url,
//             }
//         });

//         return res.status(201).json({
//             message: "Account created successfully.",
//             success: true
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    // Check for missing fields
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // ✅ Check if file is present
    if (!req.file) {
      return res.status(400).json({
        message: "Profile photo is required.",
        success: false,
      });
    }

    // ✅ Safely process image
    const fileUri = getDataUri(req.file);
    if (!fileUri || !fileUri.content) {
      return res.status(400).json({
        message: "Failed to process profile photo.",
        success: false,
      });
    }

    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // Check for duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success: true
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


// export const updateProfile = async (req, res) => {
//     try {
//         const { fullname, email, phoneNumber, bio, skills } = req.body;
//         const file = req.file;

//         let skillsArray;
//         if (skills) {
//             skillsArray = skills.split(",").map(skill => skill.trim());
//         }

//         const userId = req.id;
//         let user = await User.findById(userId);

//         if (!user) {
//             return res.status(400).json({
//                 message: "User not found.",
//                 success: false
//             });
//         }

//         if (fullname) user.fullname = fullname;
//         if (email) user.email = email;
//         if (phoneNumber) user.phoneNumber = phoneNumber;
//         if (bio) user.profile.bio = bio;
//         if (skillsArray) user.profile.skills = skillsArray;

//         // Only upload to Cloudinary if a file exists
//         if (file) {
//             const fileUri = getDataUri(file);

//             const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
//                 resource_type: "raw",        // IMPORTANT: allow PDF and other non-image formats
//                 folder: "resumes"            // optional: stores in a "resumes" folder on Cloudinary
//             });

//             user.profile.resume = cloudResponse.secure_url;
//             user.profile.resumeOriginalName = file.originalname;
//         }

//         await user.save();

//         // Prepare user object to return
//         user = {
//             _id: user._id,
//             fullname: user.fullname,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             role: user.role,
//             profile: user.profile
//         };

//         return res.status(200).json({
//             message: "Profile updated successfully.",
//             user,
//             success: true
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };


export const getMyProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error in /me:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};



// export const updateProfile = async (req, res) => {
//     try {
//         const { fullname, email, phoneNumber, bio, skills } = req.body;
//         const { resume, profilePhoto } = req.files || {}; // multer.fields support

//         let skillsArray;
//         if (skills) {
//             skillsArray = skills.split(",").map(skill => skill.trim());
//         }

//         const userId = req.id;
//         let user = await User.findById(userId);

//         if (!user) {
//             return res.status(400).json({
//                 message: "User not found.",
//                 success: false
//             });
//         }

//         if (fullname) user.fullname = fullname;
//         if (email) user.email = email;
//         if (phoneNumber) user.phoneNumber = phoneNumber;
//         if (bio) user.profile.bio = bio;
//         if (skillsArray) user.profile.skills = skillsArray;

//         // Upload resume if provided
//         if (resume) {
//             const fileUri = getDataUri(resume[0]);
//             const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
//                 resource_type: "raw",
//                 folder: "resumes"
//             });

//             user.profile.resume = cloudResponse.secure_url;
//             user.profile.resumeOriginalName = resume[0].originalname;
//         }

//         // Upload profile photo if provided
//         if (profilePhoto) {
//             const fileUri = getDataUri(profilePhoto[0]);
//             const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
//             user.profile.profilePhoto = cloudResponse.secure_url;
//         }

//         await user.save();

//         // Prepare user object to return
//         user = {
//             _id: user._id,
//             fullname: user.fullname,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             role: user.role,
//             profile: user.profile
//         };

//         return res.status(200).json({
//             message: "Profile updated successfully.",
//             user,
//             success: true
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const { resume, profilePhoto } = req.files || {}; // multer.fields expected

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",").map(skill => skill.trim());
        }

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skillsArray) user.profile.skills = skillsArray;

        // Upload resume if provided and non-empty
        if (resume && resume.length > 0) {
            const fileUri = getDataUri(resume[0]);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "raw",
                folder: "resumes"
            });

            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = resume[0].originalname;
        }

        // Upload profile photo if provided and non-empty
        if (profilePhoto && profilePhoto.length > 0) {
            const fileUri = getDataUri(profilePhoto[0]);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            user.profile.profilePhoto = cloudResponse.secure_url;
        }

        await user.save();

        // Prepare user object to return (avoid sending password or other sensitive fields)
        const returnedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: returnedUser,
            success: true
        });

    } catch (error) {
        console.error("updateProfile error:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
