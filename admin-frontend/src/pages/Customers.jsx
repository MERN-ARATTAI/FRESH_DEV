import React, { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { customerAPI } from '../services/api';
import { toast } from 'react-toastify';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchCustomers();
  }, [pagination.currentPage, searchQuery]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log('👥 Fetching customers with params:', { page: pagination.currentPage, limit: 10, search: searchQuery });
      const response = await customerAPI.getAll({
        page: pagination.currentPage,
        limit: 10,
        search: searchQuery,
      });
      
      console.log('✅ API Response:', response.data);
      
      // Backend returns data directly as array
      const usersData = response.data?.data || (Array.isArray(response.data) ? response.data : response.data?.users || []);
      setCustomers(Array.isArray(usersData) ? usersData : []);
      
      console.log('✅ Customers loaded:', Array.isArray(usersData) ? usersData.length : 0);
      
      setPagination({
        currentPage: pagination.currentPage,
        totalPages: Math.ceil((Array.isArray(usersData) ? usersData.length : 0) / 10) || 1,
        total: Array.isArray(usersData) ? usersData.length : 0,
      });
    } catch (error) {
      console.error('❌ Failed to load customers:', error);
      toast.error('Failed to load customers: ' + (error.response?.data?.message || error.message));
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const columns = [
    {
      header: 'Customer',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
            {row.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.name}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Mobile',
      accessor: 'mobile',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.mobile || 'N/A'}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`badge ${row.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
          {row.status || 'Active'}
        </span>
      ),
    },
    {
      header: 'Email Verified',
      accessor: 'verify_email',
      render: (row) => (
        <span className={`badge ${row.verify_email ? 'badge-success' : 'badge-gray'}`}>
          {row.verify_email ? 'Verified' : 'Not Verified'}
        </span>
      ),
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => viewCustomerDetails(row)}
            className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    // <div className="space-y-6">
    //   {/* Header */}
    //   <div>
    //     <h1 className="text-3xl font-display font-bold text-gray-900">Customers</h1>
    //     <p className="text-gray-600 mt-1">Manage your customer base</p>
    //   </div>

    //   {/* Search */}
    //   <div className="card">
    //     <div className="card-body">
    //       <div className="relative">
    //         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    //         <input
    //           type="text"
    //           placeholder="Search customers by name or email..."
    //           value={searchQuery}
    //           onChange={(e) => setSearchQuery(e.target.value)}
    //           className="input pl-10"
    //         />
    //       </div>
    //     </div>
    //   </div>

    //   {/* Customers Table */}
    //   <div className="card">
    //     <Table
    //       columns={columns}
    //       data={customers}
    //       loading={loading}
    //       pagination={pagination}
    //       onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
    //       emptyMessage="No customers found."
    //     />
    //   </div>

    //   {/* Customer Details Modal */}
    //   <Modal
    //     isOpen={showDetailsModal}
    //     onClose={() => setShowDetailsModal(false)}
    //     title="Customer Details"
    //     size="lg"
    //   >
    //     {selectedCustomer && (
    //       <div className="space-y-6">
    //         {/* Customer Info */}
    //         <div className="flex items-start gap-4">
    //           <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold">
    //             {selectedCustomer.name?.charAt(0).toUpperCase() || 'U'}
    //           </div>
    //           <div className="flex-1">
    //             <h3 className="text-2xl font-display font-bold text-gray-900">
    //               {selectedCustomer.name}
    //             </h3>
    //             <p className="text-gray-600">{selectedCustomer.email}</p>
    //             <div className="flex items-center gap-3 mt-2">
    //               <span className={`badge ${selectedCustomer.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
    //                 {selectedCustomer.status || 'Active'}
    //               </span>
    //               <span className="text-sm text-gray-600">
    //                 Member since {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : 'N/A'}
    //               </span>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Contact Information */}
    //         <div className="p-4 bg-gray-50 rounded-lg">
    //           <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
    //           <div className="grid grid-cols-2 gap-4 text-sm">
    //             <div>
    //               <p className="text-gray-600">Email</p>
    //               <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
    //             </div>
    //             <div>
    //               <p className="text-gray-600">Mobile</p>
    //               <p className="font-medium text-gray-900">{selectedCustomer.mobile || 'N/A'}</p>
    //             </div>
    //             <div>
    //               <p className="text-gray-600">Email Verified</p>
    //               <p className="font-medium">{selectedCustomer.verify_email ? '✓ Yes' : '✗ No'}</p>
    //             </div>
    //             <div>
    //               <p className="text-gray-600">Last Login</p>
    //               <p className="font-medium text-gray-900">
    //                 {selectedCustomer.last_login_data ? new Date(selectedCustomer.last_login_data).toLocaleDateString() : 'Never'}
    //               </p>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Address Information */}
    //         {selectedCustomer.address_details && selectedCustomer.address_details.length > 0 && (
    //           <div className="p-4 bg-gray-50 rounded-lg">
    //             <h3 className="font-semibold text-gray-900 mb-3">Saved Addresses</h3>
    //             <div className="space-y-2 text-sm">
    //               {selectedCustomer.address_details.map((addr, idx) => (
    //                 <p key={idx} className="text-gray-600">
    //                   {typeof addr === 'string' ? addr : addr.address || 'Address details'}
    //                 </p>
    //               ))}
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     )}
    //   </Modal>
    // </div>

 <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 bg-[#F3F1EC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight">
            Customers
          </h1>
          <p className="text-sm sm:text-base text-[#0F172A]/60 mt-1 sm:mt-2">
            Manage your customer base
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#BEDCD0]/30 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#0F172A]/40" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-[#F3F1EC] border border-[#BEDCD0]/40 rounded-xl text-sm sm:text-base text-[#0F172A] placeholder-[#0F172A]/40 focus:outline-none focus:ring-2 focus:ring-[#1D9C7A] focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#BEDCD0]/30 overflow-hidden">
        <Table
          columns={columns}
          data={customers}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
          emptyMessage="No customers found."
        />
      </div>

      {/* Customer Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Customer Details"
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1D9C7A] flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg flex-shrink-0">
                {selectedCustomer.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                  {selectedCustomer.name}
                </h3>
                <p className="text-sm sm:text-base text-[#0F172A]/60 mt-1">{selectedCustomer.email}</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    selectedCustomer.status === 'Active' 
                      ? 'bg-[#1D9C7A]/10 text-[#1D9C7A] border border-[#1D9C7A]/30' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {selectedCustomer.status || 'Active'}
                  </span>
                  <span className="text-xs sm:text-sm text-[#0F172A]/60">
                    Member since {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-4 sm:p-6 bg-[#F3F1EC]/50 rounded-xl border border-[#BEDCD0]/30">
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-3 sm:mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div>
                  <p className="text-[#0F172A]/60 mb-1">Email</p>
                  <p className="font-medium text-[#0F172A] break-all">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-[#0F172A]/60 mb-1">Mobile</p>
                  <p className="font-medium text-[#0F172A]">{selectedCustomer.mobile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[#0F172A]/60 mb-1">Email Verified</p>
                  <p className={`font-medium ${selectedCustomer.verify_email ? 'text-[#1D9C7A]' : 'text-red-600'}`}>
                    {selectedCustomer.verify_email ? '✓ Yes' : '✗ No'}
                  </p>
                </div>
                <div>
                  <p className="text-[#0F172A]/60 mb-1">Last Login</p>
                  <p className="font-medium text-[#0F172A]">
                    {selectedCustomer.last_login_data ? new Date(selectedCustomer.last_login_data).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            {selectedCustomer.address_details && selectedCustomer.address_details.length > 0 && (
              <div className="p-4 sm:p-6 bg-[#F3F1EC]/50 rounded-xl border border-[#BEDCD0]/30">
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-3 sm:mb-4">Saved Addresses</h3>
                <div className="space-y-2 sm:space-y-3 text-sm">
                  {selectedCustomer.address_details.map((addr, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-[#BEDCD0]/30">
                      <p className="text-[#0F172A]/70">
                        {typeof addr === 'string' ? addr : addr.address || 'Address details'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Customers;
