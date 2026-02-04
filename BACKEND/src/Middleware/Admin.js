export const Admin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                message: "Permission Denied",
                error: true,
                success: false,
            });
        }
        next(); // ✅ allow access
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false,
        });
    }
};
