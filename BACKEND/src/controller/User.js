import UserData from '../Models/PersonDetails.js';
import jwt from 'jsonwebtoken';
// import { sendWelcomeMail } from '../Utils/Mailer.js';
import WishlistData from '../Models/WishlistDetails.js';
import { sendWelcomeEmail } from '../Utils/Mailer.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: "25d" })
}

export const Register = async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body
        //Check fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields required ",
                error: true,
                success: false
            })
        }
        //Check Password
        if (password !== confirm_password) {
            return res.status(400).json({
                message: "Password MisMatch",
                error: true,
                success: false
            })
        }

        const checkData = await UserData.findOne({ email })
        //Check Already registered Mail
        if (checkData) {
            return res.status(400).json({
                message: "User already exits",
                error: true,
                success: false
            })
        }
        const user = await UserData.create({ ...req.body })
                // Send email BEFORE responding (with error handling)
        // try {
        //     await sendWelcomeMail(email)
        //     console.log("Welcome mail sent successfully")
        // } catch (emailError) {
        //     console.error("Mail failed:", emailError)
        //     // Don't fail registration if email fails
        // }

            try {
      await sendWelcomeEmail(email,name);
      console.log("Welcome mail sent successfully");
    } catch (emailError) {
      console.error("Mail failed:", emailError.message);
      // registration should NOT fail if mail fails
    }


        res.status(201).json({
            message: "Register Successfully",
            error: false,
            success: true,
            data: user
        })
            
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });

    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body
        const checkData = await UserData.findOne({ email });
        if (!checkData) {
            return res.status(401).json({
                message: "Invalid User",
                error: true,
                success: false
            })
        }
        //check User Status
        if (checkData.status !== "Active") {
            return res.status(403).json({
                message: "Contact Admin",
                error: true,
                success: false
            })
        }
        //check password
        const isMatch = await checkData.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password",
                error: true,
                success: false
            });
        }
        const token = generateToken(checkData._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 25 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "Login Successfull",
            error: false,
            success: true,
            token,
            data: {
                _id: checkData._id,
                name: checkData.name,
                email: checkData.email,
                role: checkData.role
            }
        })
    } catch (error) {
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });

    }
}
export const Logout = async (req, res) => {

    try {
        const userId = req.userId;

        // Clear wishlist on logout
        await WishlistData.deleteMany({ user: userId });

        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: "lax",

        })
        return res.json({ success: true, message: "Logged out" })

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
}
export const UpdateUserDetails = async (req, res) => {

}
export const getMe = async (req, res) => {
    try {
        // req.user is set by Protect middleware
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all users/customers
export const getAllUsers = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const users = await UserData.find()
            .select('-password')
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await UserData.countDocuments();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total: total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserData.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Toggle user status (Active/Inactive)
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserData.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
        await user.save();

        res.status(200).json({
            success: true,
            message: `User status updated to ${user.status}`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
