import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import banner from "../assets/bannerMen.png";
import vedio from "../assets/vedio.mp4";
import bannermen from "../assets/banner1.webp";

const banners = [
    { type: "image", url: banner, duration: 3000 },
    { type: "video", url: vedio },
    { type: "image", url: bannermen, duration: 3000 },
];

const BannerImage = () => {
    const [index, setIndex] = useState(0);
    const [showText, setShowText] = useState(false);
    const videoRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        setShowText(false);
        const current = banners[index];

        if (current.type === "image") {
            timeoutRef.current = setTimeout(() => {
                setIndex((prev) => (prev + 1) % banners.length);
            }, current.duration);
        }

        return () => clearTimeout(timeoutRef.current);
    }, [index]);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;

        const remaining = video.duration - video.currentTime;

        // show text in last 1.5 seconds
        if (remaining <= 1.5) {
            setShowText(true);
        }
    };

    const handleVideoEnd = () => {
        setShowText(false);
        setIndex((prev) => (prev + 1) % banners.length);
    };

    return (
        <div className="relative w-full min-h-screen border-none overflow-hidden">
            <AnimatePresence mode="wait">
                {banners[index].type === "image" ? (
                    <motion.img
                        key={banners[index].url}
                        src={banners[index].url}
                        className="absolute w-full h-full px-4 object-cover"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.8 }}
                    />
                ) : (
                    <motion.div
                        key={banners[index].url}
                        className="absolute w-full px-4 h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <video
                            ref={videoRef}
                            src={banners[index].url}
                            autoPlay
                            muted
                            playsInline
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={handleVideoEnd}
                            className="w-full h-full px-4 object-cover"
                        />

                        {/* 🔥 TEXT OVERLAY */}
                        <AnimatePresence>
                            {showText && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 30 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <h1 className="text-black text-9xl md:text-7xl font-bold tracking-wide">
                                        Our Premium Collection
                                    </h1>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>




//  <div className="relative w-full overflow-hidden bg-white">
//    <AnimatePresence mode="wait">
//      {banners[index].type === "image" ? (
//             <motion.img
//                 key={banners[index].url}
//                 src={banners[index].url}
//                 className="w-full h-auto block sm:h-screen sm:object-cover"
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -50 }}
//                 transition={{ duration: 0.8 }}
//                 style={{ display: 'block' }}
//             />
//         ) : (
//             <motion.div
//                 key={banners[index].url}
//                 className="relative w-full block"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 style={{ lineHeight: 0 }}
//             >
//                 <video
//                     ref={videoRef}
//                     src={banners[index].url}
//                     autoPlay
//                     muted
//                     playsInline
//                     onTimeUpdate={handleTimeUpdate}
//                     onEnded={handleVideoEnd}
//                     className="w-full h-auto block sm:h-screen sm:object-cover"
//                     style={{ display: 'block' }}
//                 />
//             </motion.div>
//         )}
//     </AnimatePresence>
// </div> 





    );
};

export default BannerImage;

