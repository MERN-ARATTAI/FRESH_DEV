// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
// import Table from '../components/Table';
// import Modal from '../components/Modal';
// import ConfirmModal from '../components/ConfirmModal';
// import { categoryAPI } from '../services/api';
// import { toast } from 'react-toastify';

// const Categories = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [imageFile, setImageFile] = useState(null);

//   const [formData, setFormData] = useState({
//     name: '',
//   });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       console.log('📁 Fetching categories...');
//       const response = await categoryAPI.getAll();

//       console.log('✅ API Response:', response.data);

//       const categoriesData = response.data?.data || response.data || [];
//       setCategories(Array.isArray(categoriesData) ? categoriesData : []);

//       console.log('✅ Categories loaded:', categoriesData.length);
//     } catch (error) {
//       console.error('❌ Failed to load categories:', error);
//       toast.error('Failed to load categories: ' + (error.response?.data?.message || error.message));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log('📝 Submitting category form:', formData);
//       const formDataObj = new FormData();
//       formDataObj.append('name', formData.name);

//       if (imageFile) {
//         console.log('📷 Adding image:', imageFile.name);
//         formDataObj.append('image', imageFile);
//       }

//       if (selectedCategory) {
//         console.log('🔄 Updating category:', selectedCategory._id);
//         await categoryAPI.update(selectedCategory._id, formDataObj);
//         toast.success('Category updated successfully');
//       } else {
//         console.log('➕ Creating new category');
//         await categoryAPI.create(formDataObj);
//         toast.success('Category created successfully');
//       }
//       setShowModal(false);
//       resetForm();
//       fetchCategories();
//     } catch (error) {
//       console.error('❌ Form submission error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save category');
//     }
//   };

//   const handleEdit = (category) => {
//     setSelectedCategory(category);
//     setFormData({
//       name: category.name,
//     });
//     setImageFile(null);
//     setShowModal(true);
//   };

//   const handleDelete = async () => {
//     try {
//       await categoryAPI.delete(selectedCategory._id);
//       toast.success('Category deleted successfully');
//       setShowDeleteModal(false);
//       fetchCategories();
//     } catch (error) {
//       toast.error('Failed to delete category');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//     });
//     setImageFile(null);
//     setSelectedCategory(null);
//   };

//   const columns = [
//     {
//       header: 'Category Name',
//       accessor: 'name',
//       render: (row) => (
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center overflow-hidden">
//             {row.image?.url ? (
//               <img src={row.image.url} alt={row.name} className="w-full h-full object-cover" />
//             ) : (
//               <FolderTree className="w-5 h-5 text-primary-600" />
//             )}
//           </div>
//           <div>
//             <p className="font-semibold text-gray-900">{row.name}</p>
//             <p className="text-sm text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       header: 'Created',
//       accessor: 'createdAt',
//       render: (row) => (
//         <span className="text-sm text-gray-600">
//           {new Date(row.createdAt).toLocaleDateString()}
//         </span>
//       ),
//     },
//     {
//       header: 'Actions',
//       render: (row) => (
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handleEdit(row)}
//             className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
//             title="Edit"
//           >
//             <Edit className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => {
//               setSelectedCategory(row);
//               setShowDeleteModal(true);
//             }}
//             className="p-2 hover:bg-danger-50 text-danger-600 rounded-lg transition-colors"
//             title="Delete"
//           >
//             <Trash2 className="w-4 h-4" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">Categories</h1>
//           <p className="text-gray-600 mt-1">Organize your products into categories</p>
//         </div>
//         <button
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//           className="btn btn-primary"
//         >
//           <Plus className="w-5 h-5" />
//           Add Category
//         </button>
//       </div>

//       {/* Categories Table */}
//       <div className="card">
//         <Table
//           columns={columns}
//           data={categories}
//           loading={loading}
//           emptyMessage="No categories found. Create your first category to organize products."
//         />
//       </div>

//       {/* Category Form Modal */}
//       <Modal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           resetForm();
//         }}
//         title={selectedCategory ? 'Edit Category' : 'Add New Category'}
//         size="md"
//       >
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="label">Category Name *</label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               className="input"
//               required
//             />
//           </div>

//           <div>
//             <label className="label">Category Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setImageFile(e.target.files[0])}
//               className="input"
//             />
//             {selectedCategory?.image?.url && !imageFile && (
//               <div className="mt-2">
//                 <p className="text-sm text-gray-600 mb-2">Current image:</p>
//                 <img src={selectedCategory.image.url} alt={selectedCategory.name} className="w-20 h-20 object-cover rounded" />
//               </div>
//             )}
//           </div>

//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={() => {
//                 setShowModal(false);
//                 resetForm();
//               }}
//               className="btn btn-secondary"
//             >
//               Cancel
//             </button>
//             <button type="submit" className="btn btn-primary">
//               {selectedCategory ? 'Update Category' : 'Create Category'}
//             </button>
//           </div>
//         </form>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <ConfirmModal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         onConfirm={handleDelete}
//         title="Delete Category"
//         message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
//         confirmText="Delete"
//         type="danger"
//       />
//     </div>
//   );
// };

// export default Categories;
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  Upload,
  X,
  Image as ImageIcon,
  MoreVertical,
  Layers,
  Calendar,
  TrendingUp
} from 'lucide-react';
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
  const [imagePreview, setImagePreview] = useState(null);

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
    setImagePreview(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setSelectedCategory(null);
  };

  const columns = [
    {
      header: 'Category Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-sm border-2 border-indigo-200/50">
            {row.image?.url ? (
              <img src={row.image.url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <FolderTree className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm sm:text-base">{row.name}</p>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {new Date(row.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {new Date(row.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(row.createdAt).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-all duration-200 hover:shadow-sm"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedCategory(row);
              setShowDeleteModal(true);
            }}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all duration-200 hover:shadow-sm"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-all duration-200"
            title="More"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <FolderTree className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            Categories
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Organize your products into categories ({categories.length} total)
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Total Categories
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
              <Layers className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                With Images
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {categories.filter(c => c.image?.url).length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Recent
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {categories.filter(c => {
                  const dayAgo = new Date();
                  dayAgo.setDate(dayAgo.getDate() - 7);
                  return new Date(c.createdAt) > dayAgo;
                }).length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <FolderTree className="w-5 h-5 text-white" />
            </div>
            <span>{selectedCategory ? 'Edit Category' : 'Add New Category'}</span>
          </div>
        }
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Category Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Image
            </label>

            {/* Current Image or Preview */}
            {(imagePreview || (selectedCategory?.image?.url && !imageFile)) && (
              <div className="mb-4">
                <div className="relative inline-block">
                  <img
                    src={imagePreview || selectedCategory.image.url}
                    alt="Category"
                    className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {imagePreview ? 'New image selected' : 'Current image'}
                </p>
              </div>
            )}

            {/* Upload Input */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="category-image"
              />
              <label
                htmlFor="category-image"
                className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 bg-gray-50 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-semibold text-gray-600">
                  {imageFile ? imageFile.name : 'Click to upload image'}
                </span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
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
