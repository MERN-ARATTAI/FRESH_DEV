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

        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";

        if (!formData.mobile.trim()) {
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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        {fromCheckout && (
                            <button
                                onClick={handleBackToCheckout}
                                className="text-green-600 hover:text-green-700 mb-2 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Checkout
                            </button>
                        )}
                        <h1 className="text-3xl font-bold">My Addresses</h1>
                    </div>
                    <button
                        onClick={() => showForm ? resetForm() : setShowForm(true)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        {showForm ? "Cancel" : "+ Add Address"}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8 space-y-4">
                        <div>
                            <input
                                name="address_line"
                                placeholder="Address Line"
                                value={formData.address_line}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <input
                                name="city"
                                placeholder="City *"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.city ? 'border-red-500' : ''}`}
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>

                        <div>
                            <input
                                name="state"
                                placeholder="State *"
                                value={formData.state}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.state ? 'border-red-500' : ''}`}
                            />
                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                        </div>

                        <div>
                            <input
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <input
                                name="pincode"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.pincode ? 'border-red-500' : ''}`}
                                maxLength={6}
                            />
                            {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                        </div>

                        <div>
                            <input
                                name="mobile"
                                placeholder="Mobile *"
                                value={formData.mobile}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.mobile ? 'border-red-500' : ''}`}
                                maxLength={10}
                            />
                            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-green-600 text-white w-full py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
                        >
                            {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
                        </button>
                    </form>
                )}

                {loadingList ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        <p className="mt-4 text-gray-600">Loading addresses...</p>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500 text-lg">No addresses found</p>
                        <p className="text-gray-400 text-sm mt-2">Click "Add Address" to create your first address</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {addresses.map(addr => (
                            <div key={addr._id} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
                                <div className="mb-3">
                                    {addr.address_line && <p className="text-gray-700">{addr.address_line}</p>}
                                    <p className="font-semibold text-lg">{addr.city}, {addr.state}</p>
                                    {addr.country && <p className="text-gray-600">{addr.country}</p>}
                                    {addr.pincode && <p className="text-gray-600">PIN: {addr.pincode}</p>}
                                    <p className="text-gray-700 mt-2">📞 {addr.mobile}</p>
                                </div>
                                <div className="flex gap-3 mt-4 pt-4 border-t">
                                    <button
                                        onClick={() => handleEdit(addr)}
                                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr._id)}
                                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Show checkout button if came from checkout */}
                {fromCheckout && addresses.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleBackToCheckout}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                            Continue to Checkout
                        </button>
                    </div>
                )}

            </div>
        </div>


    );
}

export default AddressPage;