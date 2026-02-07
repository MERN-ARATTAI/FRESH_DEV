import { useEffect, useState } from "react";
import { contactApi } from "../services/api";
import { toast } from "react-toastify";

export default function ContactAdminPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        try {
            const res = await contactApi.getAll();
            setContacts(res.data.data);
        } catch (error) {
            toast.error("Failed to load contact messages");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            await contactApi.delete(id);
            toast.success("Contact deleted successfully");

            setContacts((prev) => prev.filter((c) => c._id !== id));
        } catch (error) {
            toast.error("Failed to delete contact");
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        // <div className="p-6 min-h-screen bg-gray-100">
        //     <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>

        //     {loading ? (
        //         <p className="text-gray-600">Loading...</p>
        //     ) : contacts.length === 0 ? (
        //         <p className="text-gray-600">No contact messages found.</p>
        //     ) : (
        //         <div className="overflow-x-auto bg-white shadow rounded-xl">
        //             <table className="min-w-full border-collapse">
        //                 <thead className="bg-gray-900 text-white">
        //                     <tr>
        //                         <th className="p-4 text-left">Name</th>
        //                         <th className="p-4 text-left">Email</th>
        //                         <th className="p-4 text-left">Message</th>
        //                         <th className="p-4 text-left">Date</th>
        //                         <th className="p-4 text-center">Action</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     {contacts.map((contact) => (
        //                         <tr
        //                             key={contact._id}
        //                             className="border-b hover:bg-gray-50"
        //                         >
        //                             <td className="p-4">{contact.name}</td>
        //                             <td className="p-4">{contact.email}</td>
        //                             <td className="p-4 max-w-md truncate">
        //                                 {contact.message}
        //                             </td>
        //                             <td className="p-4 text-sm text-gray-500">
        //                                 {new Date(contact.createdAt).toLocaleString()}
        //                             </td>
        //                             <td className="p-4 text-center">
        //                                 <button
        //                                     onClick={() => handleDelete(contact._id)}
        //                                     className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        //                                 >
        //                                     Delete
        //                                 </button>
        //                             </td>
        //                         </tr>
        //                     ))}
        //                 </tbody>
        //             </table>
        //         </div>
        //     )}
        // </div>
        <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Messages</h1>
                    <p className="text-gray-600">Manage and review messages from your contacts</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading messages...</p>
                        </div>
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                        <p className="text-gray-600">Contact messages will appear here once submitted.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-900 to-gray-800">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Message
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {contacts.map((contact, index) => (
                                        <tr
                                            key={contact._id}
                                            className={`transition-colors duration-150 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {contact.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {contact.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{contact.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-md truncate">
                                                    {contact.message}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {new Date(contact.createdAt).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleDelete(contact._id)}
                                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 shadow-sm"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
