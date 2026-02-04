
// import { motion, AnimatePresence } from "framer-motion";
// import React, { useEffect, useState } from 'react'

// const offers = [
//     "Flash Sale With First Order 20% Offer",
//     "Free Delivery On Orders Above ₹999",
//     "Limited Time Mega Discount 🔥"
// ];

// const OfferPage = () => {
//     const [index, setIndex] = useState(0);
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setIndex((prev) => (prev + 1) % offers.length)
//         }, 2000)
//         return () => clearInterval(interval)
//     }, [])
//     return (
//         <div className="w-full h-12 flex items-center justify-center bg-black overflow-hidden">

//             <AnimatePresence mode="wait">
//                 <motion.p
//                     key={index}
//                     className="text-white text-lg font-semibold absolute"
//                     initial={{ opacity: 0, x: "-100%" }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: "100%" }}
//                     transition={{ duration: 0.6, ease: "easeInOut" }}
//                 >
//                     {offers[index]}
//                 </motion.p>
//             </AnimatePresence>
//         </div>
//     )
// }

// export default OfferPage

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from 'react'

const offers = [
  "Flash Sale With First Order 20% Offer",
  "Free Delivery On Orders Above ₹999",
  "Limited Time Mega Discount 🔥"
];

const OfferPage = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % offers.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="
      w-full h-11 md:h-12
      flex items-center justify-center
      bg-gradient-to-r from-[#7b7cff] via-[#b695ff] to-[#f3b3ff]
      overflow-hidden relative
    ">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className="
            text-white
            text-sm md:text-base lg:text-lg
            font-semibold
            absolute
            px-4 text-center
            whitespace-nowrap
          "
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {offers[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

export default OfferPage
