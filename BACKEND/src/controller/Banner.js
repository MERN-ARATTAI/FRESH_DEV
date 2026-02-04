import BannerImage from "../Models/BannerDetails.js";
import uploadImageCloudinary from "../Utils/Cloudinary.js";

// CREATE banner
export const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file" });
    }

    const result = await uploadImageCloudinary(
      req.file.buffer,
      "Ecommerce/banners"
    );
    console.log(result);


    const banner = await BannerImage.create({
      images: [
        {
          public_id: result.public_id,
          url: result.secure_url,
          type: result.resource_type === "video" ? "video" : "image",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Banner uploaded successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all active banners
export const getBanners = async (req, res) => {
  try {
    const banners = await BannerImage.find({ isActive: true }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single banner
export const getSingleBanner = async (req, res) => {
  try {
    const banner = await BannerImage.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE banner
export const updateBanner = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      isActive: req.body.isActive,
    };

    if (req.file) {
      updateData.image = req.file.originalname;
    }

    const banner = await BannerImage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE banner
export const deleteBanner = async (req, res) => {
  try {
    await BannerImage.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
