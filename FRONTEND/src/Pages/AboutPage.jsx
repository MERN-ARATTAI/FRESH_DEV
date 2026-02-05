

import React from "react";
import { motion } from "framer-motion";

import about from "../assets/about1.jpg"
import next from "../assets/NextGen.png"
import banner from "../assets/banner1.webp"

export default function AboutPage() {
  return (
 
    <div className="bg-white text-gray-900 min-h-screen">

      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center">
        <img
          src={banner}
          alt="About NextGen Men"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 " />

        <motion.div

          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center px-4 text-white"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            About NextGen Men
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Modern menswear designed for confidence, comfort, and timeless style.
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-[#1D9C7A]">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              NextGen Men was born from a simple idea — modern men deserve clothing
              that looks powerful, feels comfortable, and reflects confidence.
              We believe fashion should elevate everyday life without
              compromising on quality.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our collections include <strong>Shirts, Sherwani, Hoodies, Pants,</strong>{" "}
              and <strong>Perfumes</strong>. Each product is crafted with premium
              fabrics, clean cuts, and attention to detail.
            </p>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src={about}
            alt="NextGen Men Style"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-20 bg-[#F3F1EC]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1D9C7A]">
            What We Stand For
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              "Premium Quality",
              "Modern Design",
              "Comfort Fit",
              "Next-Gen Style",
            ].map((value) => (
              <motion.div
                whileHover={{ y: -6 }}
                key={value}
                className="
                  bg-white
                  p-6 rounded-2xl
                  text-center
                  shadow-md hover:shadow-lg
                  transition
                "
              >
                <div className="w-40 mb-8 mx-auto">
                  <img src={next} alt="nextgen products" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {value}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4 text-[#1D9C7A]">
          Our Mission
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Our mission at NextGen Men is to redefine men's fashion by delivering
          premium-quality clothing and accessories that empower men to look
          confident, modern, and authentic — every single day.
        </p>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Dress Smart. Think NextGen.
        </h2>
        <p className="text-white/90 mb-6">
          Explore our latest collections crafted for the next generation of men.
        </p>
        <button className="
          px-10 py-3 rounded-full
          bg-white text-[#0F172A]
          font-semibold
          hover:bg-gray-100
          transition
        ">
          Shop Now
        </button>
      </section>
    </div>
  );
}
