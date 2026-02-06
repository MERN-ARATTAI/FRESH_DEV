

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import contactLogo from "../assets/Logoforcontact.png"
import { createContact } from "../Api/interceptor";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await createContact(formData);

      toast.success(res.data.message || "Message sent successfully");

      // clear form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <img
          src={contactLogo}
          alt="Contact NextGen Men"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 " />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center px-4"
        >
          {/* <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Menzo Men-Wear</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We’re here to help you with orders, products, and collaborations.
          </p> */}
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Have a question about our Shirts, Sherwani, Hoodies, Pants, or
              Perfumes? Our support team at NextGen Men is always ready to
              assist you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-900 rounded-full" />
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <p className="text-gray-600">Chennai, Tamil Nadu, India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-900 rounded-full" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-gray-600">support@nextgenmen.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-900 rounded-full" />
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p className="text-gray-600">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-900"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-900"
              />

              <textarea
                rows="5"
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-900"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Let’s Build Style Together</h2>
        <p className="text-gray-300 mb-6">
          Your feedback helps NextGen Men grow better every day.
        </p>
      </section>
    </div>
  );
}
