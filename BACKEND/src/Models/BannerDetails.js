import mongoose from "mongoose";


const bannerSchema = new mongoose.Schema(
  {
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], required: true }
      }
    ]
  },
  { timestamps: true }
);

const BannerImage = mongoose.model("Banner", bannerSchema);

export default BannerImage;