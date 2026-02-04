import jwt from "jsonwebtoken";
import UserData from "../Models/PersonDetails.js";

export const Protect = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Provide Token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        const user = await UserData.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // ✅ FULL USER OBJECT
        next();

    } catch (error) {
        return res.status(401).json({
            message:
                error.name === "TokenExpiredError"
                    ? "Token Expired"
                    : "Invalid Token",
            error: true,
            success: false,
        });
    }
};
