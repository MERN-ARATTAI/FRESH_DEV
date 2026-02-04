// import React, { useEffect, useState } from "react";
// import { addToCart, getFeaturedProducts, getProductHomePage } from "../Api/interceptor";
// import { useAll } from "../GlobalProvider/UsesContext";
// import { FaRegHeart } from "react-icons/fa";
// import { useNavigate, useParams } from "react-router-dom";

// const Product = () => {
//   const { addCart, setCartCount, Wishlist, addWishlist, removeFromWishlist } = useAll();


//   const [homeproduct, setHomeProduct] = useState([]);
//   // const [products, setProducts] = useState([])
//   const navigate = useNavigate()
//   const { subCategoryId } = useParams()

//   const HomeProductPage = async () => {
//     try {
//       const HomeData = await getProductHomePage(subCategoryId);
//       console.log("HomeData", HomeData);
//       setHomeProduct(HomeData);
//     } catch (error) {
//       console.log("error", error.message);
//     }
//   };


//   useEffect(() => {
//     HomeProductPage();
//   }, [subCategoryId]);

//   const handleToCart = async (productId) => {
//     try {
//       const res = await addToCart(productId);
//       if (!res.success) {
//         setCartCount(prev => prev + 1);
//       }
//     } catch (error) {
//       navigate('/');
//     }
//   };

//   const toggleWishlist = (item) => {
//     const exists = Wishlist.some((p) => p._id === item._id);
//     if (exists) {
//       removeFromWishlist(item._id);
//     } else {
//       addWishlist(item);
//     }
//   };


//   return (

//     <div className="min-h-screen px-4 py-8">
//       <p className="text-3xl font-bold mb-8 text-center">
//         Our Most Buy Products
//       </p>

//       <div className="max-w-7xl mx-auto grid gap-8 
//                   grid-cols-1 
//                   sm:grid-cols-2 
//                   md:grid-cols-3 
//                   lg:grid-cols-4">
//         {homeproduct.map((item) => (
//           <div
//             key={item._id}
//             className="bg-white shadow-lg rounded-xl p-5 relative transition hover:shadow-xl"
//           >
//             {/* Wishlist */}
//             <div
//               onClick={() => toggleWishlist(item)}
//               className={`absolute top-4 right-4 z-10 p-2 rounded-full shadow cursor-pointer transition
//             ${Wishlist.some((p) => p._id === item._id)
//                   ? "bg-red-100"
//                   : "bg-white"
//                 }`}
//             >
//               <FaRegHeart
//                 className={`text-2xl transition-colors ${Wishlist.some((p) => p._id === item._id)
//                   ? "text-red-500"
//                   : "text-gray-500"
//                   }`}
//               />
//             </div>

//             {/* Image */}
//             <div className="w-full h-87.5 overflow-hidden rounded-lg">
//               <img
//                 onClick={() => navigate(`/product/${item._id}`)}
//                 src={item.image?.[0]?.url}
//                 alt={item.name}
//                 className="w-full h-full object-cover hover:scale-105 transition"
//               />
//             </div>

//             {/* Info */}
//             <p className="mt-2 font-semibold text-center text-lg">
//               {item.name}
//             </p>

//             <div className="flex items-center justify-evenly p-2">
//               <h2 className="text-l font-bold my-1">
//                 ${item.price}
//               </h2>

//               <button
//                 onClick={() => handleToCart(item._id)}
//                 className="p-2 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-700 transition"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default Product;
import React, { useEffect, useMemo, useState } from "react";
import Api, { getProductHomePage, getData } from "../Api/interceptor";
import { useAll } from "../GlobalProvider/UsesContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';

// Reusable product card used in both home (compact) and full-page list
const ProductCard = ({ item, onAddToCart, onToggleWishlist, isInWishlist, onView }) => {
  return (
    <div
      key={item._id}
      className="bg-white rounded-2xl p-4 relative shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div
        onClick={() => onToggleWishlist(item)}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full cursor-pointer backdrop-blur bg-white/90 shadow-md transition ${isInWishlist ? 'ring-2 ring-pink-400' : ''}`}>
        {isInWishlist ? <FaHeart className="text-xl text-pink-500" /> : <FaRegHeart className="text-xl text-gray-500 hover:text-pink-500" />}
      </div>

      <div className="w-full h-80 overflow-hidden rounded-xl bg-gray-50">
        <img
          onClick={() => onView(item)}
          src={item.image?.[0]?.url || '/no-image.png'}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </div>

      <p className="mt-4 font-semibold text-center text-lg text-gray-800 truncate">{item.name}</p>

      <div className="flex items-center justify-between mt-4 px-2">
        <h2 className="text-lg font-bold text-gray-900">₹{item.price}</h2>

        <button
          onClick={() => onAddToCart(item._id)}
          className="px-4 py-2 rounded-lg text-white font-semibold text-sm bg-gradient-to-r from-[#7b7cff] via-[#b695ff] to-[#f3b3ff] hover:opacity-90 transition"
        >
          Add to Cart
        </button>
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
  const handleView = (item) => navigate(`/product/${item._id}`)
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

  // Page mode
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">Browse and filter products</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="md:hidden btn btn-outline" onClick={() => setShowFiltersMobile(true)}>Filters</button>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="hidden lg:block col-span-1 bg-white p-4 rounded shadow sticky top-24 h-[calc(100vh-6rem)] overflow-auto">
          <h2 className="font-semibold mb-3">Filters</h2>

          <div className="mb-4">
            <h3 className="font-medium">Category</h3>
            <div className="mt-2 space-y-2">
              {categories.map(cat => (
                <label key={cat._id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selectedCategories.includes(cat._id)} onChange={(e) => {
                    const id = cat._id
                    setSelectedCategories(prev => e.target.checked ? [...prev, id] : prev.filter(x => x !== id))
                  }} />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Price Range</h3>
            <div className="flex gap-2 mt-2">
              <input type="number" className="input w-1/2" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value||0), priceRange[1]])} />
              <input type="number" className="input w-1/2" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value||0)])} />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Brand</h3>
            <div className="mt-2 space-y-2 max-h-40 overflow-auto">
              {brands.map(b => (
                <label key={b} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selectedBrands.includes(b)} onChange={e => setSelectedBrands(prev => e.target.checked ? [...prev, b] : prev.filter(x => x !== b))} />
                  {b}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Size</h3>
            <div className="mt-2 space-y-2">
              {['S','M','L','XL'].map(s => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selectedSizes.includes(s)} onChange={e => setSelectedSizes(prev => e.target.checked ? [...prev, s] : prev.filter(x => x !== s))} />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Color</h3>
            <div className="mt-2 space-y-2 max-h-40 overflow-auto">
              {colors.length > 0 ? colors.map(c => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selectedColors.includes(c)} onChange={e => setSelectedColors(prev => e.target.checked ? [...prev, c] : prev.filter(x => x !== c))} />
                  {c}
                </label>
              )) : <p className="text-sm text-gray-500">No color data</p>}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Rating</h3>
            <div className="mt-2 space-y-2">
              {[4,3,2].map(r => (
                <label key={r} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="rating" checked={ratingFilter===r} onChange={() => setRatingFilter(r)} />
                  {r}★ & up
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="rating" checked={ratingFilter===0} onChange={() => setRatingFilter(0)} />Any</label>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={onlyInStock} onChange={e => setOnlyInStock(e.target.checked)} />
              In Stock Only
            </label>
          </div>

          <div className="mt-4">
            <button className="btn btn-secondary mr-2" onClick={clearFilters}>Clear Filters</button>
          </div>
        </aside>

        <section className="col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <p className="text-sm text-gray-600">{displayed.length} products</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Showing {displayed.length} products</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded shadow p-3 flex flex-col animate-pulse">
                  <div className="h-40 mb-3 bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 w-3/4" />
                    <div className="h-3 bg-gray-200 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayed.map(p => (
                <div key={p._id} className="bg-white rounded shadow p-3 flex flex-col hover:shadow-lg transition">
                  <div className="relative h-40 mb-3 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {p.discount ? <div className="absolute left-2 top-2 bg-green-600 text-white text-xs px-2 py-1 rounded">{p.discount}% OFF</div> : null}
                    <img src={p.image?.[0]?.url || '/no-image.png'} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1 truncate">{p.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 truncate">{p.brand || ''}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        {p.discount ? (
                          <div className="text-lg font-bold">₹{(p.price - (p.price * p.discount / 100)).toFixed(2)}</div>
                        ) : (
                          <div className="text-lg font-bold">₹{p.price}</div>
                        )}
                        {p.discount ? <div className="text-sm text-gray-400 line-through">₹{p.price}</div> : null}
                      </div>
                      <div className="text-sm text-gray-500">{p.rating ? `${p.rating}★` : ''}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => navigate(`/product/${p._id}`)} className="btn btn-outline flex-1">View</button>
                    <button onClick={() => handleAddToCart(p._id)} className="btn btn-primary flex-1">Add to cart</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-start justify-center p-4">
          <div className="bg-white w-full max-w-md rounded shadow p-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button className="text-sm text-gray-500" onClick={() => setShowFiltersMobile(false)}>Close</button>
            </div>
            <div>
              <div className="mb-4">
                <h3 className="font-medium">Category</h3>
                <div className="mt-2 space-y-2">
                  {categories.map(cat => (
                    <label key={cat._id} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={selectedCategories.includes(cat._id)} onChange={(e) => {
                        const id = cat._id
                        setSelectedCategories(prev => e.target.checked ? [...prev, id] : prev.filter(x => x !== id))
                      }} />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium">Price Range</h3>
                <div className="flex gap-2 mt-2">
                  <input type="number" className="input w-1/2" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value||0), priceRange[1]])} />
                  <input type="number" className="input w-1/2" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value||0)])} />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button className="btn btn-secondary" onClick={() => { clearFilters(); setShowFiltersMobile(false); }}>Clear</button>
                <button className="btn btn-primary" onClick={() => setShowFiltersMobile(false)}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Product;

