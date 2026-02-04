import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-black text-gray-200 pt-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">NextMen</h2>
                    <p className="text-gray-400">
                        Premium menswear for every occasion. Quality fabrics, modern styles, and timeless designs.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
                        <a href="#" className="hover:text-white transition"><FaInstagram /></a>
                        <a href="#" className="hover:text-white transition"><FaTwitter /></a>
                        <a href="#" className="hover:text-white transition"><FaLinkedinIn /></a>
                    </div>
                </div>


                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white transition">Home</a></li>
                        <li><a href="#" className="hover:text-white transition">Shop</a></li>
                        <li><a href="#" className="hover:text-white transition">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition">Contact</a></li>
                        <li><a href="#" className="hover:text-white transition">Blog</a></li>
                    </ul>
                </div>


                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                        <li><a href="#" className="hover:text-white transition">Shipping & Returns</a></li>
                        <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                    </ul>
                </div>


                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
                    <p className="text-gray-400 mb-4">Subscribe for the latest updates & offers</p>
                    <form className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="w-full px-4 py-2 rounded-md focus:outline-none text-gray-900"
                        />
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 border-t border-gray-800 pt-6 pb-4 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} NextMen. All rights reserved.
            </div>
        </footer>
    );
}