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
        <div className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : contacts.length === 0 ? (
                <p className="text-gray-600">No contact messages found.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow rounded-xl">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-900 text-white">
                            <tr>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Message</th>
                                <th className="p-4 text-left">Date</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact) => (
                                <tr
                                    key={contact._id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-4">{contact.name}</td>
                                    <td className="p-4">{contact.email}</td>
                                    <td className="p-4 max-w-md truncate">
                                        {contact.message}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(contact.createdAt).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(contact._id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
