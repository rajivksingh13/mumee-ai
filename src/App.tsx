import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import { useAuth } from './contexts/AuthContext';
import { auth } from './config/firebase';

import FoundationWorkshop from './components/FoundationWorkshop';
import BeginnerWorkshop from './components/BeginnerWorkshop';
import SearchPage from './components/SearchPage';
import AccountPage, { PaymentDetailsPage } from './components/AccountPage';
import ProfilePage from './components/ProfilePage';


import AdvanceWorkshop from './components/AdvanceWorkshop';
import TitliHub from './components/TitliHub';
import ContactUs from './components/ContactUs';

// Placeholder components for each page
const Home = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCards, setVisibleCards] = useState(4);

  const offerings = [
    {
      id: 1,
      title: 'Gen AI Workshop - Absolute Beginner',
      category: 'Workshop',
      description: 'Start your AI journey from scratch! Perfect for complete beginners with zero technical background. Learn the fundamentals of Generative AI.',
      price: 'Free',
      badge: 'Free',
      badgeColor: 'bg-green-500',
      gradient: 'from-green-500 to-emerald-600',
      icon: '🌱',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/workshops/beginner',
      hoverColor: 'group-hover:text-green-600'
    },
    {
      id: 2,
      title: 'Gen AI Workshop - Foundation Level',
      category: 'Workshop',
      description: 'Kickstart your AI journey! Learn the basics of Artificial Intelligence, Machine Learning, and Data Science. No prior experience required.',
      price: 'Paid',
      badge: 'Popular',
      badgeColor: 'bg-blue-500',
      gradient: 'from-blue-500 to-purple-600',
      icon: '🏗️',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/workshops/foundation',
      hoverColor: 'group-hover:text-blue-600'
    },
    {
      id: 3,
      title: 'Gen AI Workshop - Advance',
      category: 'Workshop',
      description: 'Take your AI skills to the next level! Dive deep into advanced machine learning, neural networks, GenAI, and real-world AI projects.',
      price: 'Paid',
      badge: 'Advanced',
      badgeColor: 'bg-purple-500',
      gradient: 'from-purple-500 to-pink-600',
      icon: '🚀',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/workshops/advance',
      hoverColor: 'group-hover:text-purple-600'
    },
    {
      id: 4,
      title: 'AI Consultant Services',
      category: 'AI Consultant',
      description: 'Get personalized AI consulting from industry experts. We help businesses implement AI solutions and optimize their operations.',
      price: 'Custom',
      badge: 'Expert',
      badgeColor: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-blue-600',
      icon: '💼',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      link: '/ai-consultant',
      hoverColor: 'group-hover:text-indigo-600'
    },
    {
      id: 5,
      title: 'AI Implementation Services',
      category: 'AI Services',
      description: 'End-to-end AI implementation services. From strategy to deployment, we handle your complete AI transformation journey.',
      price: 'Custom',
      badge: 'Premium',
      badgeColor: 'bg-pink-500',
      gradient: 'from-pink-500 to-rose-600',
      icon: '⚙️',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      link: '/ai-services',
      hoverColor: 'group-hover:text-pink-600'
    },
    {
      id: 6,
      title: 'AI Training & Workshops',
      category: 'AI Services',
      description: 'Custom AI training programs for organizations. Tailored workshops to upskill your team in AI technologies.',
      price: 'Custom',
      badge: 'Corporate',
      badgeColor: 'bg-orange-500',
      gradient: 'from-orange-500 to-red-600',
      icon: '🎓',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      link: '/ai-services',
      hoverColor: 'group-hover:text-orange-600'
    },
    {
      id: 7,
      title: 'AI Strategy Consulting',
      category: 'AI Consultant',
      description: 'Strategic AI roadmap development and implementation planning for enterprise organizations.',
      price: 'Custom',
      badge: 'Strategy',
      badgeColor: 'bg-teal-500',
      gradient: 'from-teal-500 to-cyan-600',
      icon: '📊',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      link: '/ai-consultant',
      hoverColor: 'group-hover:text-teal-600'
    },
    {
      id: 8,
      title: 'AI Model Development',
      category: 'AI Services',
      description: 'Custom AI model development and deployment services for specific business use cases.',
      price: 'Custom',
      badge: 'Custom',
      badgeColor: 'bg-violet-500',
      gradient: 'from-violet-500 to-purple-600',
      icon: '🤖',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      link: '/ai-services',
      hoverColor: 'group-hover:text-violet-600'
    },
    {
      id: 9,
      title: 'AI Data Analytics',
      category: 'AI Services',
      description: 'Advanced data analytics and insights using AI-powered tools and techniques.',
      price: 'Custom',
      badge: 'Analytics',
      badgeColor: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-green-600',
      icon: '📈',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      link: '/ai-services',
      hoverColor: 'group-hover:text-emerald-600'
    },
    {
      id: 10,
      title: 'AI Process Automation',
      category: 'AI Services',
      description: 'Automate business processes with intelligent AI solutions and workflow optimization.',
      price: 'Custom',
      badge: 'Automation',
      badgeColor: 'bg-amber-500',
      gradient: 'from-amber-500 to-yellow-600',
      icon: '⚡',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      link: '/ai-services',
      hoverColor: 'group-hover:text-amber-600'
    },
    {
      id: 11,
      title: 'AI Security Solutions',
      category: 'AI Services',
      description: 'AI-powered cybersecurity solutions and threat detection for modern businesses.',
      price: 'Custom',
      badge: 'Security',
      badgeColor: 'bg-red-500',
      gradient: 'from-red-500 to-pink-600',
      icon: '🔒',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      link: '/ai-services',
      hoverColor: 'group-hover:text-red-600'
    },
    {
      id: 12,
      title: 'AI Performance Optimization',
      category: 'AI Consultant',
      description: 'Optimize existing AI systems and improve performance metrics for better ROI.',
      price: 'Custom',
      badge: 'Optimize',
      badgeColor: 'bg-sky-500',
      gradient: 'from-sky-500 to-blue-600',
      icon: '🚀',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      link: '/ai-consultant',
      hoverColor: 'group-hover:text-sky-600'
    }
  ];

  const filters = ['All', 'Workshop', 'AI Consultant', 'AI Services'];

  const filteredOfferings = activeFilter === 'All' 
    ? offerings 
    : offerings.filter(offering => offering.category === activeFilter);

  const visibleOfferings = filteredOfferings.slice(0, visibleCards);
  const hasMoreCards = visibleCards < filteredOfferings.length;

  const handleLoadMore = () => {
    setVisibleCards(prev => Math.min(prev + 4, filteredOfferings.length));
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setVisibleCards(4); // Reset to show first 4 cards when filter changes
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    {/* Modern Hero Section */}
    <section className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Empowering Your Future with
            <span className="block bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              titliAI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your future with hands-on AI workshops, expert consulting, and cutting-edge tools. 
            From beginners to advanced practitioners, unlock the power of artificial intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 text-base"
            >
              <span>Join for Free</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              to="/titlihub" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-lg shadow-xl hover:shadow-2xl border-2 border-gray-300 transform hover:-translate-y-1 transition-all duration-200 text-base"
            >
              <span>Explore titliHub</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>


              </div>
      </section>

      {/* Workshops & Offerings Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore titliAI Offerings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of AI workshops, tools, and expert support to accelerate your AI journey.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeFilter === filter
                      ? 'text-gray-900 bg-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Offerings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleOfferings.map((offering) => (
              <div key={offering.id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="relative">
                  <div className={`h-48 bg-gradient-to-br ${offering.gradient} flex items-center justify-center`}>
                    <div className="text-6xl">{offering.icon}</div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`${offering.badgeColor} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                      {offering.badge}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 ${offering.iconBg} rounded-lg flex items-center justify-center mr-3`}>
                      <span className={`${offering.iconColor} font-semibold text-sm`}>AI</span>
                    </div>
                    <span className="text-sm text-gray-500">{offering.category}</span>
                  </div>
                  <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${offering.hoverColor} transition-colors`}>
                    {offering.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {offering.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`${offering.iconColor} font-semibold`}>{offering.price}</span>
                    <Link 
                      to={offering.link} 
                      className={`${offering.iconColor} hover:opacity-80 font-medium text-sm flex items-center`}
                    >
                      Explore {offering.category}
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreCards && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                Show {Math.min(4, filteredOfferings.length - visibleCards)} more
              </button>
            </div>
          )}


        </div>
      </section>



    {/* Why Choose Us */}
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">titliAI</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what makes titliAI the perfect choice for your AI learning journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-8 group">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Cutting-Edge AI</h3>
            <p className="text-gray-600 leading-relaxed">
              Stay ahead with the latest in Generative AI, Machine Learning, and automation technologies. 
              Our curriculum is constantly updated to reflect industry trends.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-8 group">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">For All Audiences</h3>
            <p className="text-gray-600 leading-relaxed">
              Whether you're a corporate professional, student, or individual learner, 
              our programs are designed to meet your specific needs and skill level.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-8 group">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Support</h3>
            <p className="text-gray-600 leading-relaxed">
              Get personalized guidance from experienced AI professionals. 
              Our expert consultants are here to help you succeed in your AI journey.
            </p>
          </div>
        </div>

        {/* Additional Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Feature 4 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-8 group">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Hands-On Learning</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Learn by doing with practical projects, real-world applications, and interactive workshops 
              that ensure you gain practical skills you can immediately apply.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-8 group">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Flexible Learning</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Learn at your own pace with flexible scheduling, on-demand content, 
              and 24/7 access to resources that fit your busy lifestyle.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Success Stories Carousel - Hidden for now, will be shown once we have customers onboarded */}
    {/* 
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-8 text-center">Success Stories</h3>
      <p className="text-gray-300 text-center mb-10 text-lg">See how organizations and individuals are transforming with titliAI</p>
      <SuccessStoriesCarousel />
    </section>
    */}
  </div>
  );
};
const Consultant = () => <div className="p-8">AI Consultant - Coming Soon</div>;
const Library = () => <div className="p-8">AI Library - Coming Soon</div>;
const Labs = () => <div className="p-8">AI Labs - Coming Soon</div>;
const Marketplace = () => <div className="p-8">AI Agents Marketplace - Coming Soon</div>;
const Training = () => <div className="p-8">AI Training - Coming Soon</div>;
const Certifications = () => <div className="p-8">AI Certifications - Coming Soon</div>;
const Blogs = () => <div className="p-8">AI Blogs - Coming Soon</div>;
const Pricing = () => <div className="p-8">Pricing/Plan - Coming Soon</div>;
const Resources = () => <div className="p-8">Resources - Coming Soon</div>;
const StudentCorner = () => <div className="p-8">Student Corner - Coming Soon</div>;

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App: React.FC = () => {
  const { setUser } = useAuth();

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path="/workshops/beginner" element={<BeginnerWorkshop />} />
        <Route path="/workshops/foundation" element={<FoundationWorkshop />} />
        <Route path="/workshops/advance" element={<AdvanceWorkshop />} />
        <Route path="/titlihub" element={<TitliHub />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/consultant" element={<Consultant />} />
        <Route path="/library" element={<Library />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/training" element={<Training />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/student-corner" element={<StudentCorner />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/payments" element={<PaymentDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/enrollment-dashboard" element={<Navigate to="/account" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App; 