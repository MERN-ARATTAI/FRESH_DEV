


import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react';

export default function MenzoFooter() {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Integrations', href: '#integrations' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Changelog', href: '#changelog' }
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press Kit', href: '#press' }
    ],
    resources: [
      { name: 'Documentation', href: '#docs' },
      { name: 'Help Center', href: '#help' },
      { name: 'API Reference', href: '#api' },
      { name: 'Community', href: '#community' }
    ],
    legal: [
      { name: 'Privacy', href: '#privacy' },
      { name: 'Terms', href: '#terms' },
      { name: 'Security', href: '#security' },
      { name: 'Compliance', href: '#compliance' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' }
  ];

  return (
    <footer className="bg-[#1D9C7A] text-white relative overflow-hidden">
      {/* Decorative background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#88C7B3] via-[#1D9C7A] to-[#0F172A] opacity-90"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Section - Takes more space */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <h2 className="text-4xl font-bold mb-2">menzo</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-[#BEDCD0] to-[#D5D5E1]"></div>
            </div>
            <p className="text-[#BEDCD0] mb-8 leading-relaxed text-sm">
              Transform your workflow with intelligent solutions. 
              Empowering teams to build, collaborate, and innovate faster.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <a href="mailto:hello@menzo.com" className="flex items-center gap-3 text-[#F3F1EC] hover:text-white transition-colors group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Mail size={18} />
                </div>
                <span className="text-sm">hello@menzo.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-[#F3F1EC] hover:text-white transition-colors group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Phone size={18} />
                </div>
                <span className="text-sm">+1 (234) 567-890</span>
              </a>
              <div className="flex items-center gap-3 text-[#F3F1EC]">
                <div className="p-2 bg-white/10 rounded-lg">
                  <MapPin size={18} />
                </div>
                <span className="text-sm">San Francisco, CA 94102</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-base mb-5 text-[#BEDCD0] uppercase tracking-wider text-sm">Product</h3>
            <ul className="space-y-3">
              {footerSections.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-[#F3F1EC] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-base mb-5 text-[#BEDCD0] uppercase tracking-wider text-sm">Company</h3>
            <ul className="space-y-3">
              {footerSections.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-[#F3F1EC] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-base mb-5 text-[#BEDCD0] uppercase tracking-wider text-sm">Resources</h3>
            <ul className="space-y-3">
              {footerSections.resources.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-[#F3F1EC] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-base mb-5 text-[#BEDCD0] uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-3">
              {footerSections.legal.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-[#F3F1EC] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/20 pt-10 mb-10">
          <div className="max-w-2xl">
            <h3 className="font-semibold text-xl mb-3 text-white">Stay in the loop</h3>
            <p className="text-[#BEDCD0] text-sm mb-5">
              Get the latest updates, articles, and resources delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-[#BEDCD0] focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              />
              <button className="px-8 py-3 bg-white text-[#1D9C7A] rounded-lg font-semibold hover:bg-[#F3F1EC] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-[#BEDCD0] text-sm">
              <p>© {currentYear} Menzo, Inc. All rights reserved.</p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-[#BEDCD0] text-sm mr-2">Follow us:</span>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="p-2.5 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-[#1D9C7A] transition-all transform hover:scale-110"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}











