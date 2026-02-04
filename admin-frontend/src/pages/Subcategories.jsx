import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { subcategoryAPI, categoryAPI } from '../services/api';
import { toast } from 'react-toastify';

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      console.log('📂 Fetching subcategories and categories...');
      const [subCatsRes, catsRes] = await Promise.all([
        subcategoryAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      
      console.log('✅ API Response - Subcategories:', subCatsRes.data);
      console.log('✅ API Response - Categories:', catsRes.data);
      
      const subCatsData = subCatsRes.data?.data || subCatsRes.data || [];
      const catsData = catsRes.data?.data || catsRes.data || [];
      
      setSubcategories(Array.isArray(subCatsData) ? subCatsData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
      
      console.log('✅ Subcategories loaded:', Array.isArray(subCatsData) ? subCatsData.length : 0);
      console.log('✅ Categories loaded:', Array.isArray(catsData) ? catsData.length : 0);
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      toast.error('Failed to load data: ' + (error.response?.data?.message || error.message));
      setSubcategories([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.category) {
        toast.error('Please fill all required fields');
        return;
      }

      console.log('📝 Submitting subcategory form:', formData);
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('category', formData.category);
      
      if (imageFile) {
        console.log('📷 Adding image:', imageFile.name);
        formDataObj.append('image', imageFile);
      }

      if (selectedSubcategory) {
        console.log('🔄 Updating subcategory:', selectedSubcategory._id);
        await subcategoryAPI.update(selectedSubcategory._id, formDataObj);
        toast.success('Subcategory updated successfully');
      } else {
        console.log('➕ Creating new subcategory');
        await subcategoryAPI.create(formDataObj);
        toast.success('Subcategory created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchInitialData();
    } catch (error) {
      console.error('❌ Form submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to save subcategory');
    }
  };

  const handleEdit = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      category: subcategory.category?._id || subcategory.category,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await subcategoryAPI.delete(selectedSubcategory._id);
      toast.success('Subcategory deleted successfully');
      setShowDeleteModal(false);
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to delete subcategory');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
    });
    setImageFile(null);
    setSelectedSubcategory(null);
  };

  const columns = [
    {
      header: 'Subcategory Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden">
            {row.image?.url ? (
              <img src={row.image.url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <Tag className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.name}</p>
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
              setSelectedSubcategory(row);
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
          <h1 className="text-3xl font-display font-bold text-gray-900">Subcategories</h1>
          <p className="text-gray-600 mt-1">Manage product subcategories</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Subcategory
        </button>
      </div>

      {/* Subcategories Table */}
      <div className="card">
        <Table
          columns={columns}
          data={subcategories}
          loading={loading}
          emptyMessage="No subcategories found. Create your first subcategory."
        />
      </div>

      {/* Subcategory Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={selectedSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Subcategory Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>

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
            <label className="label">Subcategory Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="input"
            />
            {selectedSubcategory?.image?.url && !imageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Current image:</p>
                <img src={selectedSubcategory.image.url} alt={selectedSubcategory.name} className="w-20 h-20 object-cover rounded" />
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
              {selectedSubcategory ? 'Update Subcategory' : 'Create Subcategory'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Subcategory"
        message={`Are you sure you want to delete "${selectedSubcategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Subcategories;
