import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  postAddress,
  getAddress,
  updateAddress,
  deleteAddress
} from "../Api/interceptor";

const AddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if redirected from checkout
  const fromCheckout = location.state?.fromCheckout || false;
  const returnTo = location.state?.returnTo || "/checkout";

  const [addresses, setAddresses] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    address_line: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    mobile: ""
  });

  const [errors, setErrors] = useState({});

  // ---------------- FETCH ADDRESSES ----------------
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoadingList(true);
    try {
      const res = await getAddress();
      if (res.data.success) {
        setAddresses(res.data.data || []);
      }
    } catch (err) {
      toast.error("Failed to fetch addresses");
    } finally {
      setLoadingList(false);
    }
  };

  // ---------------- FORM HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.city.trim) newErrors.city = "City is required";
    if (!formData.state.trim) newErrors.state = "State is required";

    if (!formData.mobile.trim) {
      newErrors.mobile = "Mobile is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile must be 10 digits";
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      let res;

      // UPDATE existing address
      if (editingId) {
        res = await updateAddress(editingId, formData);
      }
      // CREATE new address
      else {
        res = await postAddress(formData);
      }

      if (res.data.success) {
        toast.success(res.data.message);
        await fetchAddresses();
        resetForm();

        // If came from checkout, redirect back to checkout or product checkout
        if (fromCheckout) {
          setTimeout(() => {
            navigate(returnTo);
          }, 1000);
        }
      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (address) => {
    setFormData({
      address_line: address.address_line || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "",
      pincode: address.pincode || "",
      mobile: address.mobile || ""
    });
    setEditingId(address._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      const res = await deleteAddress(id);
      if (res.data.success) {
        toast.success(res.data.message || "Address deleted");
        fetchAddresses();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete address");
    }
  };

  const resetForm = () => {
    setFormData({
      address_line: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      mobile: ""
    });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const handleBackToCheckout = () => {
    if (addresses.length > 0) {
      navigate(returnTo);
    } else {
      toast.info("Please add at least one address first");
    }
  };

  // ---------------- UI ----------------
  return (

    <div className="min-h-screen bg-gradient-to-br from-[#F3F1EC] to-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header Section - Reduced */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div>
            {fromCheckout && (
              <button
                onClick={handleBackToCheckout}
                className="text-[#1D9C7A] hover:text-[#88C7B3] mb-2 flex items-center gap-1.5 font-semibold text-sm transition-colors group"
              >
                <div className="w-7 h-7 rounded-full bg-[#F3F1EC] group-hover:bg-[#BEDCD0]/30 flex items-center justify-center transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                Back to Checkout
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#0F172A]">My Addresses</h1>
            </div>
          </div>
          <button
            onClick={() => showForm ? resetForm() : setShowForm(true)}
            className="bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] text-white px-5 py-2.5 rounded-lg transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1.5"
          >
            {showForm ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Address
              </>
            )}
          </button>
        </div>

        {/* Form Section - Compact */}
        {showForm && (
          <div className="bg-white p-5 rounded-xl shadow-lg mb-6 border border-[#E4E3E7]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E4E3E7]">
              <svg className="w-4 h-4 text-[#1D9C7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h2 className="text-base font-bold text-[#0F172A]">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="relative">
                <input
                  name="address_line"
                  placeholder="Address Line"
                  value={formData.address_line}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 pl-10 border border-[#E4E3E7] rounded-lg focus:outline-none focus:border-[#1D9C7A] hover:border-[#88C7B3] transition-colors text-sm"
                />
                <svg className="w-4 h-4 text-[#88C7B3] absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div className="relative">
                  <input
                    name="city"
                    placeholder="City *"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 pl-10 border rounded-lg focus:outline-none focus:border-[#1D9C7A] hover:border-[#88C7B3] transition-colors text-sm ${errors.city ? 'border-red-500' : 'border-[#E4E3E7]'}`}
                  />
                  <svg className="w-4 h-4 text-[#88C7B3] absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {errors.city && <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>}
                </div>

                <div className="relative">
                  <input
                    name="state"
                    placeholder="State *"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 pl-10 border rounded-lg focus:outline-none focus:border-[#1D9C7A] hover:border-[#88C7B3] transition-colors text-sm ${errors.state ? 'border-red-500' : 'border-[#E4E3E7]'}`}
                  />
                  <svg className="w-4 h-4 text-[#88C7B3] absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {errors.state && <p className="text-red-500 text-xs mt-1 ml-1">{errors.state}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div className="relative">
                  <input
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 pl-10 border border-[#E4E3E7] rounded-lg focus:outline-none focus:border-[#1D9C7A] hover:border-[#88C7B3] transition-colors text-sm"
                  />
                  <svg className="w-4 h-4 text-[#88C7B3] absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <div className="relative">
                  <input
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 pl-10 border rounded-lg focus:outline-none focus:border-[#1D9C7A] hover:border-[#88C7B3] transition-colors text-sm ${errors.pincode ? 'border-red-500' : 'border-[#E4E3E7]'}`}
                    maxLength={6}
                  />
                  <svg className="w-4 h-4 text-[#88C7B3] absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  {errors.pincode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.pincode}</p>}
                </div>
              </div>

              <div className="relative">
                <input
                  name="mobile"
                  placeholder="Mobile Number *"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 pl-10 border rounded-lg focus:outline-none focus:border-[#1D9C7A] hover:border-[#88C7B3] transition-colors text-sm ${errors.mobile ? 'border-red-500' : 'border-[#E4E3E7]'}`}
                  maxLength={10}
                />
                <svg className="w-4 h-4 text-[#88C7B3] absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {errors.mobile && <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobile}</p>}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] text-white w-full py-3 rounded-lg hover:shadow-lg disabled:bg-[#E4E3E7] disabled:cursor-not-allowed transition-all duration-300 font-semibold text-base transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingId ? "Update Address" : "Save Address"}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Loading State - Compact */}
        {loadingList ? (
          <div className="text-center py-16">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-[#E4E3E7] border-t-[#1D9C7A]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#88C7B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-[#88C7B3] font-semibold">Loading addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-dashed border-[#E4E3E7]">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#F3F1EC] to-[#BEDCD0]/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#88C7B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-[#0F172A] text-lg font-bold mb-1">No addresses found</p>
            <p className="text-[#88C7B3] text-sm">Click "Add New Address" to create your first address</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map(addr => (
              <div key={addr._id} className="group bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-[#E4E3E7] hover:border-[#88C7B3] relative overflow-hidden">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#1D9C7A]/10 to-transparent rounded-bl-full transform group-hover:scale-150 transition-transform duration-500"></div>

                <div className="relative">
                  {/* Location icon */}
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] flex items-center justify-center mb-3 shadow-md">
                    <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    {addr.address_line && <p className="text-[#0F172A] text-sm leading-relaxed">{addr.address_line}</p>}
                    <p className="font-bold text-base text-[#0F172A]">{addr.city}, {addr.state}</p>
                    {addr.country && <p className="text-[#88C7B3] text-xs font-medium">{addr.country}</p>}
                    {addr.pincode && (
                      <div className="inline-flex items-center gap-1 bg-[#F3F1EC] px-2.5 py-0.5 rounded-full">
                        <svg className="w-3 h-3 text-[#88C7B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        <span className="text-[#0F172A] text-xs font-semibold">{addr.pincode}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="w-7 h-7 rounded-lg bg-[#BEDCD0]/30 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-[#1D9C7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-[#0F172A] font-semibold text-sm">{addr.mobile}</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-3 border-t border-[#E4E3E7]">
                    <button
                      type="button"
                      onClick={() => handleEdit(addr)}
                      className="flex-1 bg-gradient-to-r from-[#88C7B3] to-[#BEDCD0] text-white py-2 rounded-lg hover:from-[#1D9C7A] hover:to-[#88C7B3] transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(addr._id)}
                      className="flex-1 bg-gradient-to-r from-[#E4E3E7] to-[#D5D5E1] text-[#0F172A] py-2 rounded-lg hover:from-[#BEDCD0] hover:to-[#88C7B3] hover:text-white transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Checkout Button - Compact */}
        {fromCheckout && addresses.length > 0 && (
          <div className="mt-6 text-center bg-gradient-to-br from-white via-[#F3F1EC]/50 to-[#BEDCD0]/20 p-6 rounded-xl border border-[#E4E3E7] shadow-md">
            <p className="text-[#88C7B3] font-semibold text-sm mb-3">Ready to proceed?</p>
            <button
              onClick={handleBackToCheckout}
              className="bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] text-white px-8 py-3 rounded-lg transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:scale-105 inline-flex items-center gap-2"
            >
              <span>Continue to Checkout</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>





  );
}

export default AddressPage;