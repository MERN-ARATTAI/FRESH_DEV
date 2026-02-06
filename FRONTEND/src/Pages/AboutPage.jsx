

import React, { useState, useEffect } from 'react';
import { FaRocket, FaUsers, FaHeart, FaShieldAlt, FaStar, FaTrophy, FaLeaf, FaHandshake } from 'react-icons/fa';

const AboutPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [counters, setCounters] = useState({
    customers: 0,
    products: 0,
    years: 0,
    awards: 0
  });

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Counter animation
  useEffect(() => {
    const targets = { customers: 50000, products: 10000, years: 5, awards: 25 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        customers: Math.floor(targets.customers * progress),
        products: Math.floor(targets.products * progress),
        years: Math.floor(targets.years * progress),
        awards: Math.floor(targets.awards * progress)
      });

      if (currentStep >= steps) clearInterval(interval);
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Team members
  const team = [
    {
      name: "Hari",
      role: "Founder & CEO",
      image: "/team-1.jpg",
      bio: "Visionary leader with 15+ years in e-commerce"
    },
    {
      name: "Manikandan",
      role: "Chief Product Officer",
      image: "/team-2.jpg",
      bio: "Expert in product strategy and innovation"
    },
    {
      name: "kabilan",
      role: "Head of Operations",
      image: "/team-3.jpg",
      bio: "Operations excellence and customer satisfaction"
    },
    {
      name: "Vijay",
      role: "Marketing Director",
      image: "/team-4.jpg",
      bio: "Creative marketing and brand development"
    }
  ];

  // Core values
  const values = [
    {
      icon: FaHeart,
      title: "Customer First",
      description: "We put our customers at the heart of everything we do, ensuring satisfaction at every step.",
      color: "from-[#1D9C7A] to-[#88C7B3]"
    },
    {
      icon: FaShieldAlt,
      title: "Quality Assured",
      description: "Every product is carefully selected and tested to meet our high standards of excellence.",
      color: "from-[#88C7B3] to-[#BEDCD0]"
    },
    {
      icon: FaLeaf,
      title: "Sustainable Practices",
      description: "We're committed to eco-friendly operations and sustainable business practices.",
      color: "from-[#BEDCD0] to-[#D5D5E1]"
    },
    {
      icon: FaHandshake,
      title: "Trust & Transparency",
      description: "Building lasting relationships through honest communication and reliable service.",
      color: "from-[#1D9C7A] to-[#88C7B3]"
    }
  ];

  // Milestones
  const milestones = [
    { year: "2019", title: "Founded", description: "Started with a vision to revolutionize online shopping" },
    { year: "2020", title: "1000+ Products", description: "Expanded our catalog with diverse product range" },
    { year: "2021", title: "Pan India Delivery", description: "Reached customers across all major cities" },
    { year: "2022", title: "50K Customers", description: "Crossed milestone of 50,000 happy customers" },
    { year: "2023", title: "Award Winning", description: "Recognized as Best E-commerce Platform" },
    { year: "2024", title: "Going Global", description: "Expanding to international markets" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F3F1EC] to-white">

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#1D9C7A]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#88C7B3]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-[#1D9C7A]/10 to-[#88C7B3]/10 rounded-full border border-[#1D9C7A]/30">
              <span className="text-[#1D9C7A] font-semibold text-sm">About Us</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] mb-6 leading-tight">
              Building Trust Through
              <span className="block bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] bg-clip-text text-transparent">
                Quality & Innovation
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#88C7B3] mb-8 max-w-3xl mx-auto leading-relaxed">
              We're more than just an e-commerce platform. We're a community dedicated to bringing you the best products, exceptional service, and an unforgettable shopping experience.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Get Started
              </button>
              <button className="bg-white border-2 border-[#1D9C7A] text-[#1D9C7A] px-8 py-4 rounded-xl font-bold hover:bg-[#1D9C7A] hover:text-white transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                {counters.customers.toLocaleString()}+
              </div>
              <div className="text-white/90 font-medium">Happy Customers</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                {counters.products.toLocaleString()}+
              </div>
              <div className="text-white/90 font-medium">Products</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                {counters.years}+
              </div>
              <div className="text-white/90 font-medium">Years Excellence</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                {counters.awards}+
              </div>
              <div className="text-white/90 font-medium">Awards Won</div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-[#1D9C7A]/10 rounded-full">
                <span className="text-[#1D9C7A] font-semibold text-sm">Our Story</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-6">
                From a Small Idea to a
                <span className="block text-[#1D9C7A]">Trusted Brand</span>
              </h2>
              <p className="text-[#0F172A] leading-relaxed mb-4">
                What started as a small venture in 2019 has grown into one of India's most trusted e-commerce platforms. Our journey began with a simple belief: shopping online should be easy, reliable, and enjoyable for everyone.
              </p>
              <p className="text-[#0F172A] leading-relaxed mb-4">
                Today, we serve thousands of customers daily, offering a curated selection of products across multiple categories. Our commitment to quality, customer service, and innovation has made us a household name.
              </p>
              <p className="text-[#0F172A] leading-relaxed mb-6">
                But we're not stopping here. We continue to evolve, listening to our customers and adapting to meet their needs. Your trust drives us to be better every single day.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#F3F1EC] to-[#E4E3E7] px-4 py-3 rounded-xl">
                  <FaTrophy className="text-[#1D9C7A] text-xl" />
                  <span className="text-[#0F172A] font-semibold">Award Winning</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#F3F1EC] to-[#E4E3E7] px-4 py-3 rounded-xl">
                  <FaStar className="text-[#1D9C7A] text-xl" />
                  <span className="text-[#0F172A] font-semibold">5-Star Rated</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1D9C7A]/20 to-[#88C7B3]/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/about-story.jpg"
                  alt="Our Story"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%2388C7B3" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EOur Story%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES SECTION */}
      <section className="py-20 bg-gradient-to-b from-[#F3F1EC] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full border border-[#1D9C7A]/30">
              <span className="text-[#1D9C7A] font-semibold text-sm">Our Values</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
              What We Stand For
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl border-2 border-[#E4E3E7] hover:border-[#1D9C7A] transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <value.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{value.title}</h3>
                <p className="text-[#88C7B3] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-[#1D9C7A]/10 rounded-full">
              <span className="text-[#1D9C7A] font-semibold text-sm">Our Journey</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
              Milestones That Matter
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] mx-auto rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0]"></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:text-left'}`}
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:block absolute left-1/2 top-0 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-full border-4 border-white shadow-lg"></div>

                  <div className={`bg-white p-6 rounded-2xl border-2 border-[#E4E3E7] hover:border-[#1D9C7A] transition-all duration-300 hover:shadow-xl ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    <div className="inline-block px-4 py-1 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white rounded-full font-bold text-sm mb-3">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">{milestone.title}</h3>
                    <p className="text-[#88C7B3]">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 bg-gradient-to-b from-[#F3F1EC] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full border border-[#1D9C7A]/30">
              <span className="text-[#1D9C7A] font-semibold text-sm">Our Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
              Meet the People Behind
              <span className="block text-[#1D9C7A]">Our Success</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-[#E4E3E7] hover:border-[#1D9C7A] transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%2388C7B3" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dy=".3em"%3E${member.name.charAt(0)}%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#0F172A] mb-1 group-hover:text-[#1D9C7A] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#1D9C7A] font-semibold mb-3">{member.role}</p>
                  <p className="text-sm text-[#88C7B3]">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of satisfied customers and experience the difference
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-[#1D9C7A] px-8 py-4 rounded-xl font-bold hover:bg-[#0F172A] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl">
                Shop Now
              </button>
              <button className="bg-[#0F172A] text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-[#1D9C7A] transition-all duration-300 transform hover:scale-105 shadow-xl">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;