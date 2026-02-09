


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAll } from "../GlobalProvider/UsesContext";

const CategoryCart = () => {
  const { Category } = useAll();

  return (
    <div className="w-full py-8 bg-gradient-to-b from-[#F3F1EC] to-white -z-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-2">
            Shop by Category
          </h2>
        </div>

        {/* Scroll container */}
        <div className="relative">
          {/* Gradient overlays for scroll hint */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none md:hidden"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden"></div>

          <div className="flex gap-6 overflow-x-auto px-4 pb-4 scrollbar-hide md:justify-center md:flex-wrap">
            {Category && Category.length > 0 ? (
              Category.map((item, index) => (
                <Link
                  to={`/category/${item.name}/${item._id}`}
                  key={item._id}
                  className="flex flex-col items-center shrink-0 group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >     
                  {/* Responsive Circle with enhanced styling */}
                  <div
                    className="
                      relative
                      w-20 h-20
                      sm:w-24 sm:h-24
                      md:w-28 md:h-28
                      lg:w-32 lg:h-32
                      rounded-full 
                      overflow-hidden 
                      shadow-lg 
                      bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7]
                      border-4 border-white
                      transition-all duration-300
                      group-hover:shadow-2xl
                      group-hover:scale-110
                      group-hover:border-[#1D9C7A]
                    "
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1D9C7A]/0 to-[#88C7B3]/0 group-hover:from-[#1D9C7A]/20 group-hover:to-[#88C7B3]/20 transition-all duration-300 z-10"></div>

                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#88C7B3] text-2xl font-bold">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Animated ring on hover */}
                    <div className="absolute inset-0 rounded-full border-2 border-[#1D9C7A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  </div>

                  {/* Category name with animation */}
                  <div className="mt-3 text-center">
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg  text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors duration-300 whitespace-nowrap">
                      {item.name}
                    </p>
                    {/* Underline animation */}
                    <div className="w-0 h-0.5 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] mx-auto group-hover:w-full transition-all duration-300 rounded-full mt-1"></div>
                  </div>

                  {/* Badge or count (optional - you can add product count here) */}
                  <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs text-[#88C7B3] font-medium">
                      Explore →
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="w-full text-center py-12">
                <div className="inline-block p-6 bg-white rounded-2xl shadow-lg border-2 border-[#E4E3E7]">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-full flex items-center justify-center">
                    <span className="text-3xl text-[#88C7B3]">📦</span>
                  </div>
                  <p className="text-[#0F172A] font-semibold text-lg">
                    No categories available
                  </p>
                  <p className="text-[#88C7B3] text-sm mt-2">
                    Check back soon for new collections
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile scroll indicator */}
        <div className="mt-4 text-center md:hidden">
          <p className="text-xs text-[#88C7B3] animate-pulse">
            ← Swipe to see more →
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCart;