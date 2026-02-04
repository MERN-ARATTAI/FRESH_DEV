import express from "express";
import { Protect } from "../Middleware/User.js";
import { Admin } from "../Middleware/Admin.js";
import upload from "../Middleware/Multer.js";
import {
  createBanner,
  getBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
} from "../controller/Banner.js";

const bannerRouter = express.Router();

// PUBLIC
bannerRouter.get("/banners", getBanners);

// ADMIN
bannerRouter.post(
  "/",
  Protect,
  Admin,
  upload.single("image"),
  createBanner
);

bannerRouter.get("/:id", Protect, Admin, getSingleBanner);

bannerRouter.put(
  "/:id",
  Protect,
  Admin,
  upload.single("image"),
  updateBanner
);

bannerRouter.delete("/:id", Protect, Admin, deleteBanner);

export default bannerRouter;
