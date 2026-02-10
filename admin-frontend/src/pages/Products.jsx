
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Search,
  Filter,
  Eye,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Archive,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { productAPI, categoryAPI, subcategoryAPI } from '../services/api';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    totalNoPage: 1,
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: [],
    stock: '',
    brand: '',
    unit: '',
    discount: 0,
    isPublic: true,
  });

  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pagination.currentPage, searchQuery]);

  const fetchInitialData = async () => {
    try {
      console.log('📦 Fetching categories and subcategories...');
      const [categoriesRes, subcategoriesRes] = await Promise.all([
        categoryAPI.getAll(),
        subcategoryAPI.getAll(),
      ]);
      console.log('✅ Categories:', categoriesRes.data);
      console.log('✅ Subcategories:', subcategoriesRes.data);
      setCategories(categoriesRes.data?.data || categoriesRes.data || []);
      setSubcategories(subcategoriesRes.data?.data || subcategoriesRes.data || []);
    } catch (error) {
      console.error('❌ Failed to load categories/subcategories', error.message);
      setCategories([]);
      setSubcategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching products with params:', { page: pagination.currentPage, limit: 12, search: searchQuery });
      const response = await productAPI.getAll({
        page: pagination.currentPage,
        limit: 12,
        search: searchQuery,
      });

      console.log('✅ API Response:', response.data);

      const productsData = response.data?.data || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);

      setPagination({
        currentPage: pagination.currentPage,
        totalPages: response.data?.totalNoPage || 1,
        totalCount: response.data?.totalCount || 0,
        totalNoPage: response.data?.totalNoPage || 1,
      });
      console.log('✅ Products loaded:', productsData.length);
    } catch (error) {
      console.error('❌ Failed to load products:', error);
      toast.error('Failed to load products: ' + (error.response?.data?.message || error.message));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('📝 Submitting product form:', formData);
      const formDataObj = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key === 'subCategory') {
          // append each selected subcategory as repeated field so multer/express builds an array
          if (Array.isArray(formData.subCategory)) {
            formData.subCategory.forEach((subId) => {
              formDataObj.append('subCategory', subId);
            });
          }
        } else if (key !== 'image') {
          formDataObj.append(key, formData[key]);
        }
      });

      // Add image files
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formDataObj.append('image', file);
        });
      }

      if (selectedProduct) {
        console.log('🔄 Updating product:', selectedProduct._id);
        await productAPI.update(selectedProduct._id, formDataObj);
        toast.success('Product updated successfully');
      } else {
        console.log('➕ Creating new product');
        await productAPI.create(formDataObj);
        toast.success('Product created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('❌ Form submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || product.category,
      subCategory: Array.isArray(product.subCategory) ? product.subCategory.map(sub => sub._id || sub) : [],
      stock: product.stock,
      brand: product.brand || '',
      unit: product.unit || '',
      discount: product.discount || 0,
      isPublic: product.isPublic !== false,
    });
    setImageFiles([]);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await productAPI.delete(selectedProduct._id);
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      subCategory: [],
      stock: '',
      brand: '',
      unit: '',
      discount: 0,
      public: true,
    });
    setImageFiles([]);
    setSelectedProduct(null);
  };

  const removeImageFile = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // const columns = [
  //   {
  //     header: 'Product Name',
  //     accessor: 'name',
  //     render: (row) => (
  //       <div className="flex items-center gap-3">
  //         <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
  //           {row.image && row.image.length > 0 ? (
  //             <img src={row.image[0].url} alt={row.name} className="w-full h-full object-cover" />
  //           ) : (
  //             <Package className="w-7 h-7 text-gray-400" />
  //           )}
  //         </div>
  //         <div>
  //           <p className="font-bold text-gray-900 text-sm">{row.name}</p>
  //           <p className="text-xs text-gray-500 mt-0.5">{row.brand || 'No brand'}</p>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     header: 'Category',
  //     accessor: 'category',
  //     render: (row) => (
  //       <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
  //         {typeof row.category === 'object' ? row.category?.name : row.category}
  //       </span>
  //     ),
  //   },
  //   {
  //     header: 'Price',
  //     accessor: 'price',
  //     render: (row) => (
  //       <div className="flex flex-col">
  //         <span className="font-bold text-gray-900 text-sm">₹{row.price}</span>
  //         {row.discount > 0 && (
  //           <span className="text-xs text-green-600 font-semibold">{row.discount}% OFF</span>
  //         )}
  //       </div>
  //     ),
  //   },
  //   {
  //     header: 'Stock',
  //     accessor: 'stock',
  //     render: (row) => (
  //       <div className="flex items-center gap-2">
  //         <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${row.stock > 10
  //           ? 'bg-green-50 text-green-700 border border-green-200'
  //           : row.stock > 0
  //             ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  //             : 'bg-red-50 text-red-700 border border-red-200'
  //           }`}>
  //           {row.stock > 10 ? (
  //             <TrendingUp className="w-3 h-3 mr-1" />
  //           ) : (
  //             <TrendingDown className="w-3 h-3 mr-1" />
  //           )}
  //           {row.stock} units
  //         </span>
  //       </div>
  //     ),
  //   },
  //   {
  //     header: 'Discount',
  //     accessor: 'discount',
  //     render: (row) => (
  //       <span className="text-sm font-semibold text-gray-700">{row.discount || 0}%</span>
  //     ),
  //   },
  //   {
  //     header: 'Actions',
  //     render: (row) => (
  //       <div className="flex items-center gap-1">
  //         <button
  //           onClick={() => handleEdit(row)}
  //           className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-all duration-200 hover:shadow-sm"
  //           title="Edit"
  //         >
  //           <Edit className="w-4 h-4" />
  //         </button>
  //         <button
  //           onClick={() => {
  //             setSelectedProduct(row);
  //             setShowDeleteModal(true);
  //           }}
  //           className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all duration-200 hover:shadow-sm"
  //           title="Delete"
  //         >
  //           <Trash2 className="w-4 h-4" />
  //         </button>
  //         <button
  //           className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-all duration-200"
  //           title="More"
  //         >
  //           <MoreVertical className="w-4 h-4" />
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

  // return (
  //   <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
  //     {/* Header */}
  //     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  //       <div>
  //         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
  //           <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
  //             <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
  //           </div>
  //           Products
  //         </h1>
  //         <p className="text-sm sm:text-base text-gray-600 mt-2">
  //           Manage your product inventory ({pagination.totalCount || 0} total)
  //         </p>
  //       </div>
  //       <button
  //         onClick={() => {
  //           resetForm();
  //           setShowModal(true);
  //         }}
  //         className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
  //       >
  //         <Plus className="w-5 h-5" />
  //         <span>Add Product</span>
  //       </button>
  //     </div>

  //     {/* Stats Cards */}
  //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  //       <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Products</p>
  //             <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pagination.totalCount || 0}</p>
  //           </div>
  //           <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
  //             <Package className="w-6 h-6 text-white" />
  //           </div>
  //         </div>
  //       </div>

  //       <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Categories</p>
  //             <p className="text-2xl sm:text-3xl font-bold text-gray-900">{categories.length}</p>
  //           </div>
  //           <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
  //             <Archive className="w-6 h-6 text-white" />
  //           </div>
  //         </div>
  //       </div>

  //       <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Low Stock</p>
  //             <p className="text-2xl sm:text-3xl font-bold text-gray-900">
  //               {products.filter(p => p.stock <= 10).length}
  //             </p>
  //           </div>
  //           <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
  //             <AlertCircle className="w-6 h-6 text-white" />
  //           </div>
  //         </div>
  //       </div>

  //       <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">In Stock</p>
  //             <p className="text-2xl sm:text-3xl font-bold text-gray-900">
  //               {products.filter(p => p.stock > 0).length}
  //             </p>
  //           </div>
  //           <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
  //             <CheckCircle className="w-6 h-6 text-white" />
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Filters */}
  //     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
  //       <div className="p-4 sm:p-6">
  //         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
  //           <div className="flex-1 relative">
  //             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  //             <input
  //               type="text"
  //               placeholder="Search products by name, SKU, or category..."
  //               value={searchQuery}
  //               onChange={(e) => setSearchQuery(e.target.value)}
  //               className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
  //             />
  //           </div>
  //           <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 font-semibold">
  //             <Filter className="w-5 h-5" />
  //             <span>Filters</span>
  //           </button>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Products Table */}
  //     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
  //       <Table
  //         columns={columns}
  //         data={products}
  //         loading={loading}
  //         pagination={pagination}
  //         onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
  //         emptyMessage="No products found. Add your first product to get started."
  //       />
  //     </div>

  //     {/* Product Form Modal */}
  //     <Modal
  //       isOpen={showModal}
  //       onClose={() => {
  //         setShowModal(false);
  //         resetForm();
  //       }}
  //       title={
  //         <div className="flex items-center gap-3">
  //           <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
  //             <Package className="w-5 h-5 text-white" />
  //           </div>
  //           <span>{selectedProduct ? 'Edit Product' : 'Add New Product'}</span>
  //         </div>
  //       }
  //       size="lg"
  //     >
  //       <form onSubmit={handleSubmit} className="space-y-6">
  //         {/* Product Name & Brand */}
  //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //           <div>
  //             <label className="block text-sm font-semibold text-gray-700 mb-2">
  //               Product Name <span className="text-red-500">*</span>
  //             </label>
  //             <input
  //               type="text"
  //               value={formData.name}
  //               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  //               className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
  //               placeholder="Enter product name"
  //               required
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
  //             <input
  //               type="text"
  //               value={formData.brand}
  //               onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
  //               className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
  //               placeholder="Enter brand name"
  //             />
  //           </div>
  //         </div>

  //         {/* Description */}
  //         <div>
  //           <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
  //           <textarea
  //             value={formData.description}
  //             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
  //             className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 min-h-[100px]"
  //             rows="3"
  //             placeholder="Enter product description"
  //           />
  //         </div>

  //         {/* Category & Subcategory */}
  //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //           <div>
  //             <label className="block text-sm font-semibold text-gray-700 mb-2">
  //               Category <span className="text-red-500">*</span>
  //             </label>
  //             <select
  //               value={formData.category}
  //               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
  //               className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
  //               required
  //             >
  //               <option value="">Select Category</option>
  //               {categories.map((cat) => (
  //                 <option key={cat._id} value={cat._id}>
  //                   {cat.name}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>
  //           <div>
  //             <label className="block text-sm font-semibold text-gray-700 mb-2">
  //               SubCategory
  //             </label>
  //             <select
  //               multiple
  //               value={formData.subCategory}
  //               onChange={(e) => {
  //                 const selected = Array.from(e.target.selectedOptions, (option) => option.value);
  //                 setFormData({ ...formData, subCategory: selected });
  //               }}
  //               className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
  //             >
  //               {subcategories.map((subcat) => (
  //                 <option key={subcat._id} value={subcat._id}>
  //                   {subcat.name}
  //                 </option>
  //               ))}
  //             </select>
  //             <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
  //           </div>
  //         </div>

  //         {/* Price, Stock, Discount, Unit */}
  //         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
  //           <div>
  //             <label className="block text-sm font-semibold text-gray-700 mb-2">
  //               Price <span className="text-red-500">*</span>
  //             </label>
  //             <div className="relative">
  //               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
  //               <input
  //                 type="number"
  //                 step="0.01"
  //                 value={formData.price}
  //                 onChange={(e) => setFormData({ ...formData, price: e.target.value })}
  //                 className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
  //                 placeholder="0.00"
  //                 required
  //               />
  //             </div>
  //           </div>
  //           <div>
  //             <label className="block text-sm font-semibold text-gray-700 mb-2">
  //               Stock <span className="text-red-500">*</span>
  //             </label>
  //             <input
  //               type="number"
  //               value={formData.stock}
  //               onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
  //               className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
  //               placeholder="0"
  //               required
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-semibold text-gray-700 mb-2">Discount %</label>
  //             <input
  //               type="number"
  //               step="0.01"
  //               value={formData.discount}
  //               onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
  //               className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
  //               placeholder="0"
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
  //             <input
  //               type="text"
  //               value={formData.unit}
  //               onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
  //               className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
  //               placeholder="kg, pcs"
  //             />
  //           </div>
  //         </div>

  //         {/* Product Images */}
  //         <div>
  //           <label className="block text-sm font-semibold text-gray-700 mb-2">
  //             Product Images (up to 5)
  //           </label>
  //           <div className="relative">
  //             <input
  //               type="file"
  //               multiple
  //               accept="image/*"
  //               onChange={(e) => setImageFiles(Array.from(e.target.files))}
  //               className="hidden"
  //               id="product-images"
  //             />
  //             <label
  //               htmlFor="product-images"
  //               className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 bg-gray-50 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
  //             >
  //               <Upload className="w-8 h-8 text-gray-400 mb-2" />
  //               <span className="text-sm font-semibold text-gray-600">Click to upload images</span>
  //               <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
  //             </label>
  //           </div>

  //           {/* Image Preview */}
  //           {imageFiles.length > 0 && (
  //             <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
  //               {imageFiles.map((file, index) => (
  //                 <div key={index} className="relative group">
  //                   <div className="aspect-square rounded-lg bg-gray-100 border-2 border-gray-200 overflow-hidden">
  //                     <img
  //                       src={URL.createObjectURL(file)}
  //                       alt={`Preview ${index + 1}`}
  //                       className="w-full h-full object-cover"
  //                     />
  //                   </div>
  //                   <button
  //                     type="button"
  //                     onClick={() => removeImageFile(index)}
  //                     className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
  //                   >
  //                     <X className="w-4 h-4" />
  //                   </button>
  //                 </div>
  //               ))}
  //             </div>
  //           )}

  //           {imageFiles.length > 0 && (
  //             <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
  //               <ImageIcon className="w-4 h-4" />
  //               {imageFiles.length} file(s) selected
  //             </p>
  //           )}
  //         </div>

  //         {/* Public Product Checkbox */}
  //         <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
  //           <input
  //             type="checkbox"
  //             id="isPublic"
  //             checked={formData.isPublic}
  //             onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
  //             className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
  //           />
  //           <label htmlFor="isPublic" className="flex-1">
  //             <span className="text-sm font-semibold text-gray-900">Public Product</span>
  //             <p className="text-xs text-gray-600 mt-0.5">Make this product visible to customers</p>
  //           </label>
  //         </div>

  //         {/* Form Actions */}
  //         <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
  //           <button
  //             type="button"
  //             onClick={() => {
  //               setShowModal(false);
  //               resetForm();
  //             }}
  //             className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             type="submit"
  //             className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
  //           >
  //             {selectedProduct ? 'Update Product' : 'Create Product'}
  //           </button>
  //         </div>
  //       </form>
  //     </Modal>

  //     {/* Delete Confirmation Modal */}
  //     <ConfirmModal
  //       isOpen={showDeleteModal}
  //       onClose={() => setShowDeleteModal(false)}
  //       onConfirm={handleDelete}
  //       title="Delete Product"
  //       message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
  //       confirmText="Delete"
  //       type="danger"
  //     />
  //   </div>
  // );


  const columns = [
  {
    header: 'Product Name',
    accessor: 'name',
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] flex items-center justify-center overflow-hidden shadow-sm border-2 border-[#E4E3E7]">
          {row.image && row.image.length > 0 ? (
            <img src={row.image[0].url} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-7 h-7 text-[#88C7B3]" />
          )}
        </div>
        <div>
          <p className="font-bold text-[#0F172A] text-sm">{row.name}</p>
          <p className="text-xs text-[#88C7B3] mt-0.5">{row.brand || 'No brand'}</p>
        </div>
      </div>
    ),
  },
  {
    header: 'Category',
    accessor: 'category',
    render: (row) => (
      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1D9C7A]/10 text-[#1D9C7A] border border-[#1D9C7A]/30">
        {typeof row.category === 'object' ? row.category?.name : row.category}
      </span>
    ),
  },
  {
    header: 'Price',
    accessor: 'price',
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-bold text-[#0F172A] text-sm">₹{row.price}</span>
        {row.discount > 0 && (
          <span className="text-xs text-[#1D9C7A] font-semibold">{row.discount}% OFF</span>
        )}
      </div>
    ),
  },
  {
    header: 'Stock',
    accessor: 'stock',
    render: (row) => (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
          row.stock > 10
            ? 'bg-[#1D9C7A]/10 text-[#1D9C7A] border border-[#1D9C7A]/30'
            : row.stock > 0
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {row.stock > 10 ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {row.stock} units
        </span>
      </div>
    ),
  },
  {
    header: 'Discount',
    accessor: 'discount',
    render: (row) => (
      <span className="text-sm font-semibold text-[#0F172A]">{row.discount || 0}%</span>
    ),
  },
  {
    header: 'Actions',
    render: (row) => (
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleEdit(row)}
          className="p-2 hover:bg-[#1D9C7A]/10 text-[#1D9C7A] rounded-lg transition-all duration-200 hover:shadow-sm border border-transparent hover:border-[#1D9C7A]/30"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setSelectedProduct(row);
            setShowDeleteModal(true);
          }}
          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all duration-200 hover:shadow-sm border border-transparent hover:border-red-200"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          className="p-2 hover:bg-[#F3F1EC] text-[#88C7B3] rounded-lg transition-all duration-200 border border-transparent hover:border-[#E4E3E7]"
          title="More"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];

return (
  <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#F3F1EC] to-white min-h-screen">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight flex items-center gap-3">
          <div className="p-2 bg-[#1D9C7A] rounded-xl shadow-lg">
            <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          Products
        </h1>
        <p className="text-sm sm:text-base text-[#88C7B3] mt-2 font-medium">
          Manage your product inventory ({pagination.totalCount || 0} total)
        </p>
      </div>
      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#1D9C7A] text-white rounded-xl hover:bg-[#88C7B3] transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
      >
        <Plus className="w-5 h-5" />
        <span>Add Product</span>
      </button>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[#E4E3E7] shadow-sm hover:shadow-md hover:border-[#1D9C7A] transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#88C7B3] uppercase tracking-wide mb-1">Total Products</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{pagination.totalCount || 0}</p>
          </div>
          <div className="p-3 bg-[#1D9C7A] rounded-xl shadow-md">
            <Package className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[#E4E3E7] shadow-sm hover:shadow-md hover:border-[#88C7B3] transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#88C7B3] uppercase tracking-wide mb-1">Categories</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{categories.length}</p>
          </div>
          <div className="p-3 bg-[#88C7B3] rounded-xl shadow-md">
            <Archive className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[#E4E3E7] shadow-sm hover:shadow-md hover:border-orange-500 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#88C7B3] uppercase tracking-wide mb-1">Low Stock</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {products.filter(p => p.stock <= 10).length}
            </p>
          </div>
          <div className="p-3 bg-orange-500 rounded-xl shadow-md">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[#E4E3E7] shadow-sm hover:shadow-md hover:border-[#BEDCD0] transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#88C7B3] uppercase tracking-wide mb-1">In Stock</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {products.filter(p => p.stock > 0).length}
            </p>
          </div>
          <div className="p-3 bg-[#BEDCD0] rounded-xl shadow-md">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>

    {/* Filters */}
    <div className="bg-white rounded-2xl shadow-sm border-2 border-[#E4E3E7] overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#88C7B3]" />
            <input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F3F1EC] border-2 border-[#E4E3E7] rounded-xl text-[#0F172A] placeholder-[#88C7B3] focus:outline-none focus:border-[#1D9C7A] focus:bg-white focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-[#F3F1EC] border-2 border-[#E4E3E7] text-[#0F172A] rounded-xl hover:bg-white hover:border-[#1D9C7A] transition-all duration-200 font-semibold">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>
    </div>

    {/* Products Table */}
    <div className="bg-white rounded-2xl shadow-sm border-2 border-[#E4E3E7] overflow-hidden">
      <Table
        columns={columns}
        data={products}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
        emptyMessage="No products found. Add your first product to get started."
      />
    </div>

    {/* Product Form Modal */}
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        resetForm();
      }}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1D9C7A] rounded-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span>{selectedProduct ? 'Edit Product' : 'Add New Product'}</span>
        </div>
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F3F1EC] border-2 border-[#E4E3E7] rounded-xl text-[#0F172A] placeholder-[#88C7B3] focus:outline-none focus:border-[#1D9C7A] focus:bg-white focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F3F1EC] border-2 border-[#E4E3E7] rounded-xl text-[#0F172A] placeholder-[#88C7B3] focus:outline-none focus:border-[#1D9C7A] focus:bg-white focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200"
              placeholder="Enter brand name"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#F3F1EC] border-2 border-[#E4E3E7] rounded-xl text-[#0F172A] placeholder-[#88C7B3] focus:outline-none focus:border-[#1D9C7A] focus:bg-white focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200 min-h-[100px]"
            rows="3"
            placeholder="Enter product description"
          />
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F3F1EC] border-2 border-[#E4E3E7] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#1D9C7A] focus:bg-white focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">
              SubCategory
            </label>
            <select
              multiple
              value={formData.subCategory}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                setFormData({ ...formData, subCategory: selected });
              }}
              className="w-full px-4 py-2.5 bg-[#F3F1EC] border-2 border-[#E4E3E7] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#1D9C7A] focus:bg-white focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200"
            >
              {subcategories.map((subcat) => (
                <option key={subcat._id} value={subcat._id}>
                  {subcat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-[#88C7B3] mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
        </div>

        {/* Price, Stock, Discount, Unit */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#88C7B3] font-semibold">₹</span>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 bg-[#F3F1EC] border-2 border-[#E4E3E7] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#1D9C7A] focus:bg-white focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F3F1EC] border-2 border-[#E4E3E7] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#1D9C7A] focus:bg-white focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200"
              placeholder="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Discount %</label>
            <input
              type="number"
              step="0.01"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F3F1EC] border-2 border-[#E4E3E7] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#1D9C7A] focus:bg-white focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Unit</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F3F1EC] border-2 border-[#E4E3E7] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#1D9C7A] focus:bg-white focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200"
              placeholder="kg, pcs"
            />
          </div>
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-2">
            Product Images (up to 5)
          </label>
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
              className="hidden"
              id="product-images"
            />
            <label
              htmlFor="product-images"
              className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 bg-[#F3F1EC] border-2 border-[#E4E3E7] border-dashed rounded-xl cursor-pointer hover:bg-white hover:border-[#1D9C7A] transition-colors"
            >
              <Upload className="w-8 h-8 text-[#88C7B3] mb-2" />
              <span className="text-sm font-semibold text-[#0F172A]">Click to upload images</span>
              <span className="text-xs text-[#88C7B3] mt-1">PNG, JPG up to 10MB</span>
            </label>
          </div>

          {/* Image Preview */}
          {imageFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg bg-[#F3F1EC] border-2 border-[#E4E3E7] overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImageFile(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {imageFiles.length > 0 && (
            <p className="text-sm text-[#0F172A] mt-2 flex items-center gap-1">
              <ImageIcon className="w-4 h-4 text-[#1D9C7A]" />
              {imageFiles.length} file(s) selected
            </p>
          )}
        </div>

        {/* Public Product Checkbox */}
        <div className="flex items-center gap-3 p-4 bg-[#F3F1EC] rounded-xl border-2 border-[#E4E3E7]">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            className="w-5 h-5 text-[#1D9C7A] border-[#E4E3E7] rounded focus:ring-2 focus:ring-[#1D9C7A]"
          />
          <label htmlFor="isPublic" className="flex-1">
            <span className="text-sm font-semibold text-[#0F172A]">Public Product</span>
            <p className="text-xs text-[#88C7B3] mt-0.5">Make this product visible to customers</p>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t-2 border-[#E4E3E7]">
          <button
            type="button"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
            className="px-6 py-2.5 bg-[#F3F1EC] text-[#0F172A] rounded-xl hover:bg-[#E4E3E7] transition-all duration-200 font-semibold border-2 border-[#E4E3E7]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1D9C7A] text-white rounded-xl hover:bg-[#88C7B3] transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
          >
            {selectedProduct ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </Modal>

    {/* Delete Confirmation Modal */}
    <ConfirmModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={handleDelete}
      title="Delete Product"
      message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
      confirmText="Delete"
      type="danger"
    />
  </div>
);
};

export default Products;