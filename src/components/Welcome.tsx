// import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">mumeeAI</div>
          <div className="flex space-x-4">
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Empowering Your AI Journey with mumeeAI
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              From individual career growth to enterprise solutions, mumeeAI provides comprehensive 
              AI/ML offerings tailored to your needs.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Explore Solutions
              </Link>
              <a
                href="#offerings" 
                className="border border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Learn More
              </a>
            </div>
          </motion.div>
          <motion.div
            className="lg:w-1/2 mt-12 lg:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="/ai-illustration.svg"
              alt="AI Illustration" 
              className="w-full"
            />
          </motion.div>
        </div>
      </div>

      {/* Offerings Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Our AI Learning Platform
        </h2>
        <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          Start your journey in AI and machine learning with our comprehensive courses designed to accelerate your career growth.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Individual Courses */}
          <motion.div
            className="bg-gray-700 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-indigo-400 text-5xl mb-4">🎓</div>
            <h3 className="text-2xl font-semibold text-white mb-4">AI/ML Courses</h3>
            <p className="text-gray-300 mb-6">
              Comprehensive courses designed to accelerate your career in AI and machine learning.
              From fundamentals to advanced techniques, learn from industry experts.
            </p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                Fundamentals of AI and ML
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                Practical hands-on projects
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                Industry expert guidance
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                Career support and mentorship
              </li>
            </ul>
            <Link 
              to="/signup" 
              className="block text-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start Learning
            </Link>
          </motion.div>

          {/* Business Products - Coming Soon */}
          <motion.div
            className="bg-gray-700/50 p-8 rounded-lg shadow-lg relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                Coming Soon
              </span>
            </div>
            <div className="text-purple-400 text-5xl mb-4">💼</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Business Products</h3>
            <p className="text-gray-400 mb-6">
              Pre-built AI solutions for businesses of all sizes.
              Enhance your operations with our ready-to-deploy AI models.
            </p>
            <ul className="text-gray-400 mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                Customer Analytics
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                Sales Forecasting
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                Inventory Optimization
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                API Integration
              </li>
            </ul>
            <button 
              className="block w-full text-center bg-gray-600 text-gray-400 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
              disabled
            >
              Coming Soon
            </button>
          </motion.div>

          {/* Enterprise Services - Coming Soon */}
          <motion.div
            className="bg-gray-700/50 p-8 rounded-lg shadow-lg relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                Coming Soon
              </span>
            </div>
            <div className="text-orange-400 text-5xl mb-4">🏢</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Enterprise Services</h3>
            <p className="text-gray-400 mb-6">
              Custom AI solutions for large enterprises.
              Tailored implementations with dedicated support.
            </p>
            <ul className="text-gray-400 mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-orange-400 mr-2">✓</span>
                Custom AI Development
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-2">✓</span>
                Enterprise Integration
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-2">✓</span>
                Dedicated Support
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-2">✓</span>
                SLA Guarantee
              </li>
            </ul>
            <button 
              className="block w-full text-center bg-gray-600 text-gray-400 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
              disabled
            >
              Coming Soon
            </button>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-indigo-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your AI Journey with mumeeAI?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join our community of learners and start your journey in AI today.
          </p>
          <div className="flex justify-center">
            <Link
              to="/signup" 
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Success Stories
        </h2>
        <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          See how organizations and individuals are transforming with mumeeAI
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                JD
              </div>
              <div>
                <h4 className="text-white font-semibold">John Doe</h4>
                <p className="text-gray-400">Data Scientist</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "MumeeAI's courses helped me transition from a traditional data analyst to a machine learning engineer in just 6 months. The hands-on projects were invaluable."
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                TC
              </div>
              <div>
                <h4 className="text-white font-semibold">TechCorp Inc.</h4>
                <p className="text-gray-400">Mid-size Technology Company</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "Implementing MumeeAI's customer analytics solution increased our conversion rates by 32% and reduced customer churn by 18% within the first quarter."
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                GF
              </div>
              <div>
                <h4 className="text-white font-semibold">Global Finance</h4>
                <p className="text-gray-400">Enterprise Financial Services</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "MumeeAI's custom fraud detection system has reduced false positives by 45% while improving detection accuracy, saving us millions annually."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">mumeeAI</h3>
              <p className="text-gray-400">
                Empowering individuals, businesses, and enterprises with AI/ML solutions.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">AI/ML Courses</Link></li>
                <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Prebuilt Products</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Enterprise Services</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2025 mumeeAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 