import AddressModel from '../Models/AddressDetails.js';
import UserData from '../Models/PersonDetails.js';

export const createAddress = async (req, res) => {
    try {
        const userId = req.user._id;   // from protect middleware

        const {
            address_line,
            city,
            state,
            country,
            pincode,
            mobile
        } = req.body;

        // ✅ Validation
        if (!city || !state || !mobile) {
            return res.status(400).json({
                success: false,
                message: "City, state and mobile are required"
            });
        }

        // ✅ Create address
        const address = await AddressModel.create({
            address_line,
            city,
            state,
            country,
            pincode,
            mobile,
            userId
        });

        // ✅ Link address to user
        await UserData.findByIdAndUpdate(userId, {
            $push: {
                address_details: address._id
            }
        });

        return res.status(201).json({
            success: true,
            message: "Address created successfully",
            data: address
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateAddress = async (req, res) => {
    try {
        const userIds = req.user._id

        const {
            userId,
            address_line,
            city,
            state,
            country,
            pincode,
            mobile
        } = req.body;

        const update = await AddressModel.updateOne({ userId: userIds }, {
            address_line,
            city,
            state,
            country,
            pincode,
            mobile
        })
        return res.json({
            message: "Address Update",
            success: true,
            error: false,
            data: update
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAddress = async (req, res) => {
    try {
        const userId = req.user._id
        // console.log("UserId", userId);


        const data = await AddressModel
            .find({ userId, status: true })
            .sort({ createdAt: -1 })

        return res.json({
            message: "List of Address",
            error: false,
            success: true,
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params;
        const address = await AddressModel.findOneAndDelete(
            { _id: id, userId },
            { status: false },
            { new: true }
        )
        if (!address) {
            return res.json({
                message: "Address Not Found",
                success: false
            })
        }
        await UserData.findByIdAndUpdate(req.user._id, {
            $pull: { address_details: id }
        })
        return res.json({
            success: true,
            message: "Address delete Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}




