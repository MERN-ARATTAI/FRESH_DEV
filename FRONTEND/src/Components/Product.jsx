
import React, { useEffect, useMemo, useState } from "react";
import Api, { getProductHomePage, getData } from "../Api/interceptor";
import { useAll } from "../GlobalProvider/UsesContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';

// Reusable product card used in both home (compact) and full-page list
const ProductCard = ({ item, onAddToCart, onToggleWishlist, isInWishlist, onView }) => {
  console.log("ProductCard", ProductCard)

  return (
    // <div
    //   key={item._id}
    //   className="bg-white rounded-2xl p-4 relative shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E4E3E7]"
    // >
    //   <div
    //     onClick={() => onToggleWishlist(item)}
    //     className={`absolute top-4 right-4 z-10 p-2.5 rounded-full cursor-pointer transition-all duration-300 ${isInWishlist
    //       ? 'bg-[#1D9C7A] shadow-lg scale-110'
    //       : 'bg-white shadow-md hover:bg-[#F3F1EC] hover:scale-110'
    //       }`}
    //   >
    //     {isInWishlist ? (
    //       <FaHeart className="text-xl text-white" />
    //     ) : (
    //       <FaRegHeart className="text-xl text-[#0F172A] hover:text-[#1D9C7A]" />
    //     )}
    //   </div>

    //   <div className="w-full h-80 overflow-hidden rounded-xl bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] shadow-inner">
    //     <img
    //       onClick={() => onView(item)}
    //       src={item.image?.[0]?.url || '/no-image.png'}
    //       alt={item.name}
    //       className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
    //     />
    //   </div>

    //   <div className="mt-4 space-y-3">
    //     <p className="font-bold text-center text-lg text-[#0F172A] truncate hover:text-[#1D9C7A] transition-colors">
    //       {item.name}
    //     </p>

    //     <div className="flex items-center justify-between px-2 pt-2 border-t border-[#E4E3E7]">
    //       <div className="flex flex-col">
    //         <span className="text-xs text-[#88C7B3] font-medium">Price</span>
    //         <h2 className="text-xl font-bold text-[#0F172A]">₹{item.price}</h2>
    //       </div>

    //       <button
    //         onClick={() => onAddToCart(item._id)}
    //         className="px-6 py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
    //       >
    //         Add to Cart
    //       </button>
    //     </div>
    //   </div>
    // </div>

//     <div
//   key={item._id}
//   className="bg-white rounded-2xl p-4 relative shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E4E3E7] hover:border-[#1D9C7A] group"
// >
//   {/* Wishlist Button */}
//   <div
//     onClick={() => onToggleWishlist(item)}
//     className={`absolute top-4 right-4 z-10 p-2.5 rounded-full cursor-pointer transition-all duration-300 ${
//       isInWishlist
//         ? 'bg-[#1D9C7A] shadow-lg scale-110'
//         : 'bg-white shadow-md hover:bg-[#F3F1EC] hover:scale-110'
//     }`}
//   >
//     {isInWishlist ? (
//       <FaHeart className="text-xl text-white" />
//     ) : (
//       <FaRegHeart className="text-xl text-[#0F172A] hover:text-[#1D9C7A]" />
//     )}
//   </div>

//   {/* Discount Badge */}
//   {item.discount && (
//     <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
//       {item.discount}% OFF
//     </div>
//   )}

//   {/* Product Image */}
//   <div className="w-full aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] shadow-inner">
//     <img
//       onClick={() => onView(item)}
//       src={item.image?.[0]?.url || '/no-image.png'}
//       alt={item.name}
//       className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500 cursor-pointer"
//     />
//   </div>

//   {/* Product Details */}
//   <div className="mt-4 space-y-3">
//     {/* Product Name */}
//     <div className="text-center">
//       <p className="font-bold text-lg text-[#0F172A] truncate group-hover:text-[#1D9C7A] transition-colors cursor-pointer">
//         {item.name}
//       </p>
//       {item.brand && (
//         <p className="text-xs text-[#88C7B3] font-medium mt-1">
//           {item.brand}
//         </p>
//       )}
//     </div>

//     {/* Rating */}
//     {item.rating && (
//       <div className="flex items-center justify-center gap-1">
//         <div className="flex items-center gap-1 bg-[#1D9C7A] text-white px-2 py-1 rounded-lg text-xs font-semibold">
//           <span>{item.rating}</span>
//           <span>★</span>
//         </div>
//       </div>
//     )}

//     {/* Price & Add to Cart Section */}
//     <div className="pt-3 border-t border-[#E4E3E7]">
//       {/* Price Display */}
//       <div className="mb-3">
//         {item.discount ? (
//           <div className="text-center space-y-1">
//             <div className="flex items-center justify-center gap-2">
//               <h2 className="text-2xl font-bold text-[#1D9C7A]">
//                 ₹{(item.price - (item.price * item.discount / 100)).toFixed(2)}
//               </h2>
//               <span className="text-base font-medium text-[#88C7B3] line-through">
//                 ₹{item.price}
//               </span>
//             </div>
//             <p className="text-xs text-[#1D9C7A] font-semibold">
//               You save ₹{(item.price * item.discount / 100).toFixed(2)}
//             </p>
//           </div>
//         ) : (
//           <div className="text-center">
//             <span className="text-xs text-[#88C7B3] font-medium block mb-1">Price</span>
//             <h2 className="text-2xl font-bold text-[#0F172A]">₹{item.price}</h2>
//           </div>
//         )}
//       </div>

//       {/* Add to Cart Button */}
//       <button
//         onClick={() => onAddToCart(item._id)}
//         className="w-full px-6 py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
//       >
//         Add to Cart
//       </button>
//     </div>
//   </div>
// </div>

//    <div
//   key={item._id}
//   className="bg-white rounded-2xl p-4 relative shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E4E3E7] hover:border-[#1D9C7A] group"
// >
//   {/* Wishlist Button */}
//   <div
//     onClick={() => onToggleWishlist(item)}
//     className={`absolute top-4 right-4 z-10 p-2.5 rounded-full cursor-pointer transition-all duration-300 ${
//       isInWishlist
//         ? 'bg-[#1D9C7A] shadow-lg scale-110'
//         : 'bg-white shadow-md hover:bg-[#F3F1EC] hover:scale-110'
//     }`}
//   >
//     {isInWishlist ? (
//       <FaHeart className="text-xl text-white" />
//     ) : (
//       <FaRegHeart className="text-xl text-[#0F172A] hover:text-[#1D9C7A]" />
//     )}
//   </div>

//   {/* Discount Badge */}
//   {item.discount && (
//     <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
//       {item.discount}% OFF
//     </div>
//   )}

//   {/* Product Image - Original Size */}
//   <div className="w-full h-80 overflow-hidden rounded-xl bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] shadow-inner">
//     <img
//       onClick={() => onView(item)}
//       src={item.image?.[0]?.url || '/no-image.png'}
//       alt={item.name}
//       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
//     />
//   </div>

//   {/* Product Details - Reduced Spacing */}
//   <div className="mt-3 space-y-2">
//     {/* Product Name */}
//     <div className="text-center">
//       <p className="font-bold text-lg text-[#0F172A] truncate group-hover:text-[#1D9C7A] transition-colors cursor-pointer">
//         {item.name}
//       </p>
//       {item.brand && (
//         <p className="text-xs text-[#88C7B3] font-medium mt-0.5">
//           {item.brand}
//         </p>
//       )}
//     </div>

//     {/* Rating */}
//     {item.rating && (
//       <div className="flex items-center justify-center gap-1">
//         <div className="flex items-center gap-1 bg-[#1D9C7A] text-white px-2 py-0.5 rounded-lg text-xs font-semibold">
//           <span>{item.rating}</span>
//           <span>★</span>
//         </div>
//       </div>
//     )}

//     {/* Price & Add to Cart Section */}
//     <div className="pt-2 border-t border-[#E4E3E7]">
//       {/* Price Display */}
//       <div className="mb-2">
//         {item.discount ? (
//           <div className="text-center space-y-0.5">
//             <div className="flex items-center justify-center gap-2">
//               <h2 className="text-2xl font-bold text-[#1D9C7A]">
//                 ₹{(item.price - (item.price * item.discount / 100)).toFixed(2)}
//               </h2>
//               <span className="text-base font-medium text-[#88C7B3] line-through">
//                 ₹{item.price}
//               </span>
//             </div>
//             <p className="text-xs text-[#1D9C7A] font-semibold">
//               You save ₹{(item.price * item.discount / 100).toFixed(2)}
//             </p>
//           </div>
//         ) : (
//           <div className="text-center">
//             <span className="text-xs text-[#88C7B3] font-medium block mb-0.5">Price</span>
//             <h2 className="text-2xl font-bold text-[#0F172A]">₹{item.price}</h2>
//           </div>
//         )}
//       </div>

//       {/* Add to Cart Button */}
//       <button
//         onClick={() => onAddToCart(item._id)}
//         className="w-full px-6 py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
//       >
//         Add to Cart
//       </button>
//     </div>
//   </div>
// </div>

<div
  key={item._id}
  className="bg-white rounded-2xl p-4 relative shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E4E3E7] hover:border-[#1D9C7A] group"
>
  {/* Wishlist Button */}
  <div
    onClick={() => onToggleWishlist(item)}
    className={`absolute top-4 right-4 z-10 p-2.5 rounded-full cursor-pointer transition-all duration-300 ${
      isInWishlist
        ? 'bg-[#1D9C7A] shadow-lg scale-110'
        : 'bg-white shadow-md hover:bg-[#F3F1EC] hover:scale-110'
    }`}
  >
    {isInWishlist ? (
      <FaHeart className="text-xl text-white" />
    ) : (
      <FaRegHeart className="text-xl text-[#0F172A] hover:text-[#1D9C7A]" />
    )}
  </div>

  {/* Discount Badge */}
  {item.discount && (
    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
      {item.discount}% OFF
    </div>
  )}

  {/* Product Image - Original Size */}
  <div className="w-full h-80 overflow-hidden rounded-xl bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] shadow-inner">
    <img
      onClick={() => onView(item)}
      src={item.image?.[0]?.url || '/no-image.png'}
      alt={item.name}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
    />
  </div>

  {/* Product Details - Reduced Spacing */}
  <div className="mt-3 space-y-2">
    {/* Product Name */}
    <div className="text-center">
      <p className="font-bold text-lg text-[#0F172A] truncate group-hover:text-[#1D9C7A] transition-colors cursor-pointer">
        {item.name}
      </p>
      {item.brand && (
        <p className="text-xs text-[#88C7B3] font-medium mt-0.5">
          {item.brand}
        </p>
      )}
    </div>

    {/* Rating */}
    {item.rating && (
      <div className="flex items-center justify-center gap-1">
        <div className="flex items-center gap-1 bg-[#1D9C7A] text-white px-2 py-0.5 rounded-lg text-xs font-semibold">
          <span>{item.rating}</span>
          <span>★</span>
        </div>
      </div>
    )}

    {/* Price & Add to Cart Section */}
    <div className="pt-2 border-t border-[#E4E3E7]">
      {/* Price Display */}
      <div className="mb-2">
        {item.discount ? (
          <div className="text-center space-y-0.5">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-bold text-[#1D9C7A]">
                ₹{(item.price - (item.price * item.discount / 100)).toFixed(2)}
              </h2>
              <span className="text-base font-medium text-[#88C7B3] line-through">
                ₹{item.price}
              </span>
            </div>
            <p className="text-xs text-[#1D9C7A] font-semibold">
              You save ₹{(item.price * item.discount / 100).toFixed(2)}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-xs text-[#88C7B3] font-medium block mb-0.5">Price</span>
            <h2 className="text-2xl font-bold text-[#0F172A]">₹{item.price}</h2>
          </div>
        )}
      </div>

      {/* Add to Cart Button - Improved */}
      <button
        onClick={() => onAddToCart(item._id)}
        className="w-full px-6 py-3 rounded-xl text-white font-bold text-sm bg-[#1D9C7A] hover:bg-[#16875E] active:bg-[#0F5D42] transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-xl"
      >
        Add to Cart
      </button>
    </div>
  </div>
</div>

    
  )
}



const Product = ({ pageMode = false }) => {
  const { Wishlist, handleAddToCart, handleAddToWishlist, handleRemoveFromWishlist } = useAll();
  const navigate = useNavigate();
  const { subCategoryId } = useParams();

  // Wishlist ids
  const [wishlistProductIds, setWishlistProductIds] = useState(new Set());
  useEffect(() => {
    const ids = new Set(Wishlist.map(item => item.product?._id));
    setWishlistProductIds(ids);
  }, [Wishlist]);

  // Home (compact grid)
  const [homeproduct, setHomeProduct] = useState([]);
  const HomeProductPage = async () => {
    try {
      const HomeData = await getProductHomePage(subCategoryId);
      setHomeProduct(HomeData);
    } catch (error) {
      console.log('error', error.message);
    }
  };
  useEffect(() => { HomeProductPage(); }, [subCategoryId]);

  // Full page variables (only used when pageMode === true)
  const [allProducts, setAllProducts] = useState([])
  const [displayed, setDisplayed] = useState([])
  const [categories, setCategories] = useState([])

  // Filters
  const [selectedCategories, setSelectedCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [sizes, setSizes] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [colors, setColors] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [priceRange, setPriceRange] = useState([0, 9999999])
  const [sortBy, setSortBy] = useState('newest')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)

  useEffect(() => {
    if (pageMode) fetchInitial()
  }, [pageMode])

  const fetchInitial = async () => {
    try {
      setLoading(true)
      const response = await Api.get('/product/list-product', { params: { page: 1, limit: 1000 } });
      const products = response?.data?.data || [];
      setAllProducts(products)

      const catRes = await getData()
      setCategories(catRes?.data || [])

      // derive brands / sizes / colors
      const brandSet = new Set()
      const sizeSet = new Set()
      const colorSet = new Set()

      products.forEach((p) => {
        if (p.brand) brandSet.add(p.brand)
        const md = p.more_details || {}
        if (md.size) {
          if (Array.isArray(md.size)) md.size.forEach(s => sizeSet.add(s))
          else sizeSet.add(md.size)
        }
        if (md.color) colorSet.add(md.color)
        if (p.colors && Array.isArray(p.colors)) p.colors.forEach(c => colorSet.add(c))
      })

      setBrands(Array.from(brandSet))
      setSizes(Array.from(sizeSet))
      setColors(Array.from(colorSet))

    } catch (error) {
      console.error('Failed to fetch products', error)
    } finally {
      setLoading(false)
    }
  }

  // Filters application
  useEffect(() => {
    if (!pageMode) return
    applyFilters()
  }, [allProducts, selectedCategories, selectedBrands, selectedSizes, selectedColors, priceRange, sortBy, ratingFilter, onlyInStock])

  const applyFilters = () => {
    let result = [...allProducts]

    if (selectedCategories.length > 0) {
      result = result.filter(p => {
        const catId = p.category?._id || p.category
        return selectedCategories.includes(String(catId))
      })
    }

    if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand))

    if (selectedSizes.length > 0) {
      result = result.filter(p => {
        const md = p.more_details || {}
        const s = md.size
        if (!s) return false
        if (Array.isArray(s)) return s.some(v => selectedSizes.includes(v))
        return selectedSizes.includes(s)
      })
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => {
        const md = p.more_details || {}
        if (md.color) return selectedColors.includes(md.color)
        if (p.colors && Array.isArray(p.colors)) return p.colors.some(c => selectedColors.includes(c))
        return false
      })
    }

    result = result.filter(p => {
      const price = Number(p.price || 0)
      return price >= Number(priceRange[0]) && price <= Number(priceRange[1])
    })

    if (ratingFilter > 0) result = result.filter(p => (p.rating || 0) >= ratingFilter)
    if (onlyInStock) result = result.filter(p => (p.stock || 0) > 0)

    if (sortBy === 'price-asc') result.sort((a, b) => (a.price || 0) - (b.price || 0))
    else if (sortBy === 'price-desc') result.sort((a, b) => (b.price || 0) - (a.price || 0))
    else if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    else if (sortBy === 'popular') result.sort((a, b) => (b.rating || 0) - (a.rating || 0))

    setDisplayed(result)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([0, 9999999])
    setRatingFilter(0)
    setOnlyInStock(false)
    setSortBy('newest')
  }

  // Handlers shared by both modes
  const handleView = (item) => { window.scrollTo(0, 0); navigate(`/product/${item._id}`) }
  const toggleWishlist = (item) => {
    const exists = wishlistProductIds.has(item._id)
    if (exists) {
      handleRemoveFromWishlist(item._id)
      toast.success('Removed from wishlist')
    } else {
      handleAddToWishlist(item)
      toast.success('Added to wishlist')
    }
  }

  // Render
  if (!pageMode) {
    return (
      <div className="min-h-screen bg-white px-4 py-10">
        <p className="text-3xl font-bold mb-10 text-center text-gray-800">Our Most Buy Products</p>
        <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {homeproduct.map(item => (
            <ProductCard
              key={item._id}
              item={item}
              onAddToCart={handleAddToCart}
              onToggleWishlist={toggleWishlist}
              isInWishlist={wishlistProductIds.has(item._id)}
              onView={handleView}
            />
          ))}
        </div>
      </div>
    )
  }
  //page mode
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      {/* <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#E4E3E7]">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-1">Products</h1>
          <p className="text-sm text-[#88C7B3]">Browse and filter products</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="md:hidden px-4 py-2 border-2 border-[#1D9C7A] text-[#1D9C7A] rounded-lg font-semibold hover:bg-[#1D9C7A] hover:text-white transition-all duration-300"
            onClick={() => setShowFiltersMobile(true)}
          >
            Filters
          </button>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2 border-2 border-[#E4E3E7] rounded-lg bg-white text-[#0F172A] font-medium focus:border-[#1D9C7A] focus:outline-none transition-all duration-300 cursor-pointer hover:border-[#88C7B3]"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div> */}
      <div className="mb-6 pb-4 border-b-2 border-[#E4E3E7]">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    {/* Title Section */}
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1">Products</h1>
      <p className="text-xs sm:text-sm text-[#88C7B3] font-medium">Browse and filter products</p>
    </div>

    {/* Controls Section */}
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Mobile Filter Button */}
      <button
        className="md:hidden flex items-center gap-2 px-3 py-2 border-2 border-[#1D9C7A] text-[#1D9C7A] rounded-lg text-sm font-semibold hover:bg-[#1D9C7A] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        onClick={() => setShowFiltersMobile(true)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span>Filters</span>
      </button>

      {/* Sort Dropdown */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="appearance-none pl-3 pr-9 py-2 border-2 border-[#E4E3E7] rounded-lg bg-white text-[#0F172A] text-sm font-medium focus:border-[#1D9C7A] focus:outline-none focus:ring-2 focus:ring-[#1D9C7A]/20 transition-all duration-300 cursor-pointer hover:border-[#88C7B3] shadow-sm hover:shadow-md"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>   
        {/* Custom Dropdown Icon */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-[#1D9C7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
       </div>



      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block col-span-1 bg-gradient-to-br from-white to-[#F3F1EC] p-6 rounded-2xl shadow-lg border border-[#E4E3E7] sticky top-24 h-[calc(100vh-6rem)] overflow-auto">
          <h2 className="font-bold text-xl text-[#0F172A] mb-4 pb-2 border-b-2 border-[#1D9C7A]">Filters</h2>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#1D9C7A] rounded"></span>
              Category
            </h3>
            <div className="mt-2 space-y-2">
              {categories.map(cat => (
                <label key={cat._id} className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer hover:text-[#1D9C7A] transition-colors duration-200 group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat._id)}
                    onChange={(e) => {
                      const id = cat._id
                      setSelectedCategories(prev => e.target.checked ? [...prev, id] : prev.filter(x => x !== id))
                    }}
                    className="w-4 h-4 accent-[#1D9C7A] cursor-pointer"
                  />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          {/* <div className="mb-6">
            <h3 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#1D9C7A] rounded"></span>
              Price Range
            </h3>
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                className="w-1/2 px-3 py-2 border-2 border-[#E4E3E7] rounded-lg focus:border-[#1D9C7A] focus:outline-none transition-all duration-300"
                placeholder="Min"
                value={priceRange[0]}
                onChange={e => setPriceRange([Number(e.target.value || 0), priceRange[1]])}
              />
              <input
                type="number"
                className="w-1/2 px-3 py-2 border-2 border-[#E4E3E7] rounded-lg focus:border-[#1D9C7A] focus:outline-none transition-all duration-300"
                placeholder="Max"
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value || 0)])}
              />
            </div>
          </div> */}

    <div className="mb-6">
  <h3 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
    <span className="w-1 h-4 bg-[#1D9C7A] rounded"></span>
    Price Range
  </h3>
  
  {/* Price Input Fields */}
  <div className="flex gap-2 mt-2">
    <input
      type="number"
      className="w-1/2 px-3 py-2 border-2 border-[#E4E3E7] rounded-lg focus:border-[#1D9C7A] focus:outline-none transition-all duration-300"
      placeholder="Min"
      min="0"
      value={priceRange[0] || ''}
      onChange={e => setPriceRange([Number(e.target.value || 0), priceRange[1]])}
    />
    <input
      type="number"
      className="w-1/2 px-3 py-2 border-2 border-[#E4E3E7] rounded-lg focus:border-[#1D9C7A] focus:outline-none transition-all duration-300"
      placeholder="Max"
      min="0"
      value={priceRange[1] || ''}
      onChange={e => setPriceRange([priceRange[0], Number(e.target.value || 0)])}
    />
  </div>

  {/* Range Slider */}
  <div className="mt-4 px-1">
    <input
      type="range"
      min="0"
      max="10000"
      step="100"
      value={priceRange[0]}
      onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
      className="w-full h-2 bg-[#E4E3E7] rounded-lg appearance-none cursor-pointer accent-[#1D9C7A]"
    />
    <input
      type="range"
      min="0"
      max="10000"
      step="100"
      value={priceRange[1]}
      onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
      className="w-full h-2 bg-[#E4E3E7] rounded-lg appearance-none cursor-pointer accent-[#1D9C7A] -mt-2"
    />
  </div>

  {/* Quick Preset Buttons */}
  <div className="mt-3 flex flex-wrap gap-2">
    {[
      { label: 'Under 200', range: [0, 200] },
      { label: '500-1000', range: [500, 1000] },
      { label: '1000-2000', range: [1000, 2000] },
      { label: '2000-3000', range: [2000, 3000] },
      { label: '3000+', range: [3000, 10000] },
      { label: '4000+', range: [4000, 10000] },
    ].map(preset => (
      <button
        key={preset.label}
        onClick={() => setPriceRange(preset.range)}
        className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-all duration-300 ${
          priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1]
            ? 'bg-[#1D9C7A] text-white border-[#1D9C7A]'
            : 'bg-white text-gray-700 border-[#E4E3E7] hover:border-[#1D9C7A]'
        }`}
      >
        {preset.label}
      </button>
    ))}
  </div>

  {/* Current Selection Display */}
  <div className="mt-3 text-sm text-gray-600 text-center">
    {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
  </div>
    </div>
          {/* Brand Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#1D9C7A] rounded"></span>
              Brand
            </h3>
            <div className="mt-2 space-y-2 max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-[#88C7B3] scrollbar-track-[#F3F1EC]">
              {brands.map(b => (
                <label key={b} className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer hover:text-[#1D9C7A] transition-colors duration-200 group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={e => setSelectedBrands(prev => e.target.checked ? [...prev, b] : prev.filter(x => x !== b))}
                    className="w-4 h-4 accent-[#1D9C7A] cursor-pointer"
                  />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          {/* <div className="mb-6">
            <h3 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#1D9C7A] rounded"></span>
              Size
            </h3>
            <div className="mt-2 flex gap-2 flex-wrap">
              {['S', 'M', 'L', 'XL'].map(s => (
                <label
                  key={s}
                  className={`px-4 py-2 border-2 rounded-lg cursor-pointer font-semibold transition-all duration-300 ${selectedSizes.includes(s)
                    ? 'bg-[#1D9C7A] text-white border-[#1D9C7A] shadow-md transform scale-105'
                    : 'bg-white text-[#0F172A] border-[#E4E3E7] hover:border-[#88C7B3] hover:scale-105'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(s)}
                    onChange={e => setSelectedSizes(prev => e.target.checked ? [...prev, s] : prev.filter(x => x !== s))}
                    className="hidden"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div> */}

          {/* Color Filter */}
          {/* <div className="mb-6">
            <h3 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#1D9C7A] rounded"></span>
              Color
            </h3>
            <div className="mt-2 space-y-2 max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-[#88C7B3] scrollbar-track-[#F3F1EC]">
              {colors.length > 0 ? colors.map(c => (
                <label key={c} className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer hover:text-[#1D9C7A] transition-colors duration-200 group">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(c)}
                    onChange={e => setSelectedColors(prev => e.target.checked ? [...prev, c] : prev.filter(x => x !== c))}
                    className="w-4 h-4 accent-[#1D9C7A] cursor-pointer"
                  />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">{c}</span>
                </label>
              )) : <p className="text-sm text-[#88C7B3]">No color data</p>}
            </div>
          </div> */}

          {/* Rating Filter */}
          {/* <div className="mb-6">
            <h3 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#1D9C7A] rounded"></span>
              Rating
            </h3>
            <div className="mt-2 space-y-2">
              {[4, 3, 2].map(r => (
                <label key={r} className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer hover:text-[#1D9C7A] transition-colors duration-200 group">
                  <input
                    type="radio"
                    name="rating"
                    checked={ratingFilter === r}
                    onChange={() => setRatingFilter(r)}
                    className="w-4 h-4 accent-[#1D9C7A] cursor-pointer"
                  />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">{r}★ & up</span>
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer hover:text-[#1D9C7A] transition-colors duration-200 group">
                <input
                  type="radio"
                  name="rating"
                  checked={ratingFilter === 0}
                  onChange={() => setRatingFilter(0)}
                  className="w-4 h-4 accent-[#1D9C7A] cursor-pointer"
                />
                <span className="group-hover:translate-x-1 transition-transform duration-200">Any</span>
              </label>
            </div>
          </div> */}

          {/* In Stock Filter */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer hover:text-[#1D9C7A] transition-colors duration-200 group">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={e => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 accent-[#1D9C7A] cursor-pointer"
              />
              <span className="font-semibold group-hover:translate-x-1 transition-transform duration-200">In Stock Only</span>
            </label>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-6">
            <button
              className="w-full px-4 py-3 bg-gradient-to-r from-[#E4E3E7] to-[#D5D5E1] text-[#0F172A] rounded-xl font-bold hover:from-[#D5D5E1] hover:to-[#E4E3E7] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Products Grid - RESPONSIVE 3 COLUMNS ON DESKTOP */}
        {/* <section className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-[#F3F1EC] to-[#E4E3E7] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[#0F172A]">{displayed.length} products found</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-[#88C7B3]">Showing {displayed.length} products</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col animate-pulse border border-[#E4E3E7]">
                  <div className="h-56 mb-4 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-[#E4E3E7] w-3/4 rounded" />
                    <div className="h-3 bg-[#D5D5E1] w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map(p => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-lg p-4 flex flex-col hover:shadow-2xl transition-all duration-300 border border-[#E4E3E7] hover:border-[#1D9C7A] transform hover:scale-103 group"
                >
                  <div className="relative h-56 mb-4 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-xl flex items-center justify-center overflow-hidden">
                    {p.discount ? (
                      <div className="absolute left-3 top-3 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 animate-pulse">
                        {p.discount}% OFF
                      </div>
                    ) : null}
                    <img
                      src={p.image?.[0]?.url || '/no-image.png'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-base mb-1 truncate text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors duration-300">
                      {p.name}
                    </h3>
                    <p className="text-sm text-[#88C7B3] mb-3 truncate font-medium">
                      {p.brand || 'No Brand'}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {p.discount ? (
                          <>
                            <div className="text-xl font-bold text-[#1D9C7A]">
                              ₹{(p.price - (p.price * p.discount / 100)).toFixed(2)}
                            </div>
                            <div className="text-sm text-[#88C7B3] line-through">
                              ₹{p.price}
                            </div>
                          </>
                        ) : (
                          <div className="text-xl font-bold text-[#0F172A]">
                            ₹{p.price}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-[#1D9C7A] bg-[#F3F1EC] px-2 py-1 rounded-lg">
                        {p.rating ? `${p.rating}★` : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => { window.scrollTo(0, 0); navigate(`/product/${p._id}`) }}
                      className="flex-1 px-3 py-2 border-2 border-[#1D9C7A] text-[#1D9C7A] rounded-lg font-semibold hover:bg-[#1D9C7A] hover:text-white transition-all duration-300 transform hover:scale-105"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleAddToCart(p._id)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] text-white rounded-lg font-semibold hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section> */}
        <section className="lg:col-span-3">
  <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-[#F3F1EC] to-[#E4E3E7] p-4 rounded-xl">
    <div className="flex items-center gap-3">
      <div className="hidden md:block">
        <p className="text-sm font-semibold text-[#0F172A]">{displayed.length} products found</p>
      </div>
    </div>
    <div>
      <p className="text-sm font-medium text-[#88C7B3]">Showing {displayed.length} products</p>
    </div>
  </div>

  {loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col animate-pulse border border-[#E4E3E7]">
          <div className="h-56 mb-4 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-xl" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-[#E4E3E7] w-3/4 rounded" />
            <div className="h-3 bg-[#D5D5E1] w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayed.map(p => (
        <div
          key={p._id}
          className="bg-white rounded-2xl shadow-lg p-3 flex flex-col hover:shadow-2xl transition-all duration-300 border border-[#E4E3E7] hover:border-[#1D9C7A] transform hover:scale-103 group"
        >
          <div className="relative aspect-square mb-3 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-xl overflow-hidden">
            {p.discount ? (
              <div className="absolute left-2 top-2 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10 animate-pulse">
                {p.discount}% OFF
              </div>
            ) : null}
            <img
              src={p.image?.[0]?.url || '/no-image.png'}
              alt={p.name}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-base mb-1 truncate text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors duration-300">
              {p.name}
            </h3>
            <p className="text-sm text-[#88C7B3] mb-2 truncate font-medium">
              {p.brand || 'No Brand'}
            </p>

            <div className="flex items-center justify-between mb-2">
              <div>
                {p.discount ? (
                  <>
                    <div className="text-xl font-bold text-[#1D9C7A]">
                      ₹{(p.price - (p.price * p.discount / 100)).toFixed(2)}
                    </div>
                    <div className="text-sm text-[#88C7B3] line-through">
                      ₹{p.price}
                    </div>
                  </>
                ) : (
                  <div className="text-xl font-bold text-[#0F172A]">
                    ₹{p.price}
                  </div>
                )}
              </div>
              <div className="text-sm font-semibold text-[#1D9C7A] bg-[#F3F1EC] px-2 py-1 rounded-lg">
                {p.rating ? `${p.rating}★` : 'N/A'}
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => { window.scrollTo(0, 0); navigate(`/product/${p._id}`) }}
              className="flex-1 px-3 py-2 border-2 border-[#1D9C7A] text-[#1D9C7A] rounded-lg font-semibold hover:bg-[#1D9C7A] hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              View
            </button>
            <button
              onClick={() => handleAddToCart(p._id)}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] text-white rounded-lg font-semibold hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
            >
              Add to cart
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>
      </div>

      {/* Mobile Filters Modal */}
     {showFiltersMobile && (
  <div className="fixed inset-0 z-50 bg-[#0F172A] bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden border-2 border-[#1D9C7A] animate-slideUp">
      
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-6 pb-4 border-b-2 border-[#E4E3E7] bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#0F172A]">Filters</h3>
        </div>
        <button
          className="p-2 hover:bg-[#F3F1EC] rounded-lg transition-colors duration-300 group"
          onClick={() => setShowFiltersMobile(false)}
        >
          <svg className="w-6 h-6 text-[#88C7B3] group-hover:text-[#1D9C7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 160px)' }}>
        
        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="font-bold text-base text-[#0F172A] mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-[#1D9C7A] to-[#88C7B3] rounded-full"></span>
            Category
          </h3>
          <div className="space-y-2">
            {categories.map((cat, index) => (
              <label 
                key={cat._id} 
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#F3F1EC] to-white border border-[#E4E3E7] cursor-pointer hover:border-[#1D9C7A] transition-all duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat._id)}
                  onChange={(e) => {
                    const id = cat._id
                    setSelectedCategories(prev => e.target.checked ? [...prev, id] : prev.filter(x => x !== id))
                  }}
                  className="w-5 h-5 accent-[#1D9C7A] cursor-pointer rounded"
                />
                <span className="text-sm font-medium text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors flex-1">
                  {cat.name}
                </span>
                {selectedCategories.includes(cat._id) && (
                  <svg className="w-4 h-4 text-[#1D9C7A]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="font-bold text-base text-[#0F172A] mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-[#1D9C7A] to-[#88C7B3] rounded-full"></span>
            Price Range
          </h3>
          <div className="bg-gradient-to-r from-[#F3F1EC] to-white p-4 rounded-xl border border-[#E4E3E7]">
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-[#88C7B3] mb-1 block">Min Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#88C7B3] font-bold">₹</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-3 py-2.5 border-2 border-[#E4E3E7] rounded-lg focus:border-[#1D9C7A] focus:outline-none transition-all duration-300 font-semibold"
                    placeholder="0"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value || 0), priceRange[1]])}
                  />
                </div>
              </div>
              <div className="flex items-end pb-2">
                <svg className="w-5 h-5 text-[#88C7B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-[#88C7B3] mb-1 block">Max Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#88C7B3] font-bold">₹</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-3 py-2.5 border-2 border-[#E4E3E7] rounded-lg focus:border-[#1D9C7A] focus:outline-none transition-all duration-300 font-semibold"
                    placeholder="∞"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value || 0)])}
                  />
                </div>
              </div>
            </div>
            {/* Price Range Display */}
            <div className="text-center pt-2 border-t border-[#E4E3E7]">
              <span className="text-xs font-semibold text-[#1D9C7A]">
                ₹{priceRange[0]} - ₹{priceRange[1] || '∞'}
              </span>
            </div>
          </div>
        </div>

        {/* Brand Filter (Optional - Add if needed) */}
        {brands && brands.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-base text-[#0F172A] mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-[#1D9C7A] to-[#88C7B3] rounded-full"></span>
              Brand
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand, index) => (
                <label 
                  key={brand} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#F3F1EC] to-white border border-[#E4E3E7] cursor-pointer hover:border-[#1D9C7A] transition-all duration-200 group"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands?.includes(brand)}
                    onChange={(e) => {
                      setSelectedBrands(prev => e.target.checked ? [...prev, brand] : prev.filter(x => x !== brand))
                    }}
                    className="w-5 h-5 accent-[#1D9C7A] cursor-pointer rounded"
                  />
                  <span className="text-sm font-medium text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors flex-1">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] > 0) && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#1D9C7A]/10 to-[#88C7B3]/10 rounded-xl border border-[#1D9C7A]/30">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-[#1D9C7A]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <span className="text-xs font-bold text-[#1D9C7A]">Active Filters</span>
            </div>
            <div className="text-xs text-[#0F172A] space-y-1">
              {selectedCategories.length > 0 && (
                <div>• {selectedCategories.length} categories selected</div>
              )}
              {(priceRange[0] > 0 || priceRange[1] > 0) && (
                <div>• Price: ₹{priceRange[0]} - ₹{priceRange[1] || '∞'}</div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Footer Buttons - Fixed */}
      <div className="p-6 pt-4 border-t-2 border-[#E4E3E7] bg-white sticky bottom-0">
        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-3 bg-white border-2 border-[#E4E3E7] text-[#0F172A] rounded-xl font-bold hover:bg-[#F3F1EC] hover:border-[#1D9C7A] transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
            onClick={() => { clearFilters(); setShowFiltersMobile(false); }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear
          </button>
          <button
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] text-white rounded-xl font-bold hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            onClick={() => setShowFiltersMobile(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Apply Filters
          </button>
        </div>
      </div>

    </div>
  </div>
)}
    </div>
  )
}

export default Product;

