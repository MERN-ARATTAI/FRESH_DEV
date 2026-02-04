import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Search, Filter } from 'lucide-react';
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


  const columns = [
    {
      header: 'Product Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {row.image && row.image.length > 0 ? (
              <img src={row.image[0].url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.name}</p>
            <p className="text-sm text-gray-500">{row.brand || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {typeof row.category === 'object' ? row.category?.name : row.category}
        </span>
      ),
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (row) => (
        <span className="font-semibold text-gray-900">₹{row.price}</span>
      ),
    },
    {
      header: 'Stock',
      accessor: 'stock',
      render: (row) => (
        <span className={`font-medium ${row.stock > 10 ? 'text-success-600' : 'text-danger-600'}`}>
          {row.stock} units
        </span>
      ),
    },
    {
      header: 'Discount',
      accessor: 'discount',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.discount || 0}%</span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedProduct(row);
              setShowDeleteModal(true);
            }}
            className="p-2 hover:bg-danger-50 text-danger-600 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <button className="btn btn-secondary">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
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
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[100px]"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input"
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
              <label className="label">SubCategory</label>
              <select
                multiple
                value={formData.subCategory}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                  setFormData({ ...formData, subCategory: selected });
                }}
                className="input"
              >
                {subcategories.map((subcat) => (
                  <option key={subcat._id} value={subcat._id}>
                    {subcat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="label">Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Discount %</label>
              <input
                type="number"
                step="0.01"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Unit</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="input"
                placeholder="kg, pcs, etc"
              />
            </div>
          </div>

          <div>
            <label className="label">Product Images (up to 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
              className="input"
            />
            {imageFiles.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">{imageFiles.length} file(s) selected</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
              Public Product
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
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
