import React from 'react';
import ButterflyLogo from './ButterflyLogo';

const Footer: React.FC = () => (
  <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative z-50">
    {/* Main Footer Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Company Info */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <ButterflyLogo size="sm" />
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                titliAI
              </h3>
              <p className="text-sm text-gray-400">Empowering AI Solutions</p>
            </div>
          </div>
                     <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
             Transform your future with hands-on AI workshops, expert consulting, and cutting-edge tools. From beginners to advanced practitioners, unlock the power of artificial intelligence.
           </p>
          <div className="flex items-center space-x-4">
            <a href="mailto:info@techno-pulse.com" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              info@techno-pulse.com
            </a>
            <span className="text-gray-500">•</span>
            <a href="tel:+1234567890" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              +91 (733) 077-8027
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-3">
            <li>
              <a href="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="/titlihub" className="text-gray-300 hover:text-white text-sm transition-colors">
                AI Solutions
              </a>
            </li>
            <li>
              <a href="/workshops" className="text-gray-300 hover:text-white text-sm transition-colors">
                Workshops
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-300 hover:text-white text-sm transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>


      </div>

      {/* Social Links */}
      <div className="border-t border-gray-700 mt-12 pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <span className="text-sm text-gray-400">Follow us:</span>
            <div className="flex items-center space-x-4">
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482c-4.083-.205-7.697-2.162-10.125-5.134a4.822 4.822 0 0 0-.664 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.457-2.548z"/>
                </svg>
              </a>
              <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-red-400 transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.545 3.5 12 3.5 12 3.5s-7.545 0-9.386.574a2.994 2.994 0 0 0-2.112 2.112C0 8.027 0 12 0 12s0 3.973.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.455 20.5 12 20.5 12 20.5s7.545 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.973 24 12 24 12s0-3.973-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} titliAI. All rights reserved.
          </div>
        </div>
      </div>
    </div>


  </footer>
);

export default Footer; 