import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { categoryAPI } from '../services/api';
import { toast } from 'react-toastify';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('📁 Fetching categories...');
      const response = await categoryAPI.getAll();
      
      console.log('✅ API Response:', response.data);
      
      const categoriesData = response.data?.data || response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      
      console.log('✅ Categories loaded:', categoriesData.length);
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
      toast.error('Failed to load categories: ' + (error.response?.data?.message || error.message));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('📝 Submitting category form:', formData);
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      
      if (imageFile) {
        console.log('📷 Adding image:', imageFile.name);
        formDataObj.append('image', imageFile);
      }

      if (selectedCategory) {
        console.log('🔄 Updating category:', selectedCategory._id);
        await categoryAPI.update(selectedCategory._id, formDataObj);
        toast.success('Category updated successfully');
      } else {
        console.log('➕ Creating new category');
        await categoryAPI.create(formDataObj);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('❌ Form submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await categoryAPI.delete(selectedCategory._id);
      toast.success('Category deleted successfully');
      setShowDeleteModal(false);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
    });
    setImageFile(null);
    setSelectedCategory(null);
  };

  const columns = [
    {
      header: 'Category Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center overflow-hidden">
            {row.image?.url ? (
              <img src={row.image.url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <FolderTree className="w-5 h-5 text-primary-600" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.name}</p>
            <p className="text-sm text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
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
              setSelectedCategory(row);
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
          <h1 className="text-3xl font-display font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your products into categories</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="card">
        <Table
          columns={columns}
          data={categories}
          loading={loading}
          emptyMessage="No categories found. Create your first category to organize products."
        />
      </div>

      {/* Category Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Category Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="input"
            />
            {selectedCategory?.image?.url && !imageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Current image:</p>
                <img src={selectedCategory.image.url} alt={selectedCategory.name} className="w-20 h-20 object-cover rounded" />
              </div>
            )}
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
              {selectedCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Categories;
