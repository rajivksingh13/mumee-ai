import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/authService';
import SearchBar from './SearchBar';
import ButterflyLogo from './ButterflyLogo';
import CountryFlag from './CountryFlag';

const offerings = [
  { to: '/workshops/beginner', label: 'Absolute Beginner', category: 'AI Workshops' },
  { to: '/workshops/foundation', label: 'Foundation Level', category: 'AI Workshops' },
  { to: '/workshops/advance', label: 'Advance Level', category: 'AI Workshops' },
  { to: '/ai-consultant', label: 'AI Consultant', category: 'AI Consultant' },
  { to: '/ai-services', label: 'AI Services', category: 'AI Services' },
  // Hidden offerings - will be enabled later
  // { to: '/consultant', label: 'AI Consultant' },
  // { to: '/library', label: 'AI Library' },
  // { to: '/labs', label: 'AI Labs' },
  // { to: '/marketplace', label: 'AI-Agents Marketplace' },
  // { to: '/training', label: 'AI Training' },
  // { to: '/certifications', label: 'AI Certifications' },
  // { to: '/blogs', label: 'AI Blogs' },
];

const techBlogs = [
  { 
    name: 'Techno-Pulse', 
    url: 'https://www.techno-pulse.com/', 
    description: 'Technology Simplified',
    icon: '🔗'
  },
  { 
    name: 'TeachLea', 
    url: 'https://www.teachlea.com/', 
    description: 'Learning Platform',
    icon: '📚'
  }
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setDropdown(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdown(false);
    }, 150); // 150ms delay before closing
  };

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdown(false);
    setUserMenuOpen(false);
    setMobileExploreOpen(false);
    setOpen(false);
  }, [location]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/');
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.trim().split(' ');
      if (names.length === 1) return names[0][0].toUpperCase();
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    } else if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    } else {
      return 'U';
    }
  };

  const getUserDisplayName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo and Explore */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex flex-col items-start">
            <div className="flex items-center text-2xl font-extrabold text-blue-600 gap-2">
              <ButterflyLogo size="md" />
                             <span>titli<span className="text-pink-500">AI</span></span>
            </div>
            <div className="text-[8px] font-bold uppercase tracking-wide">
              <span className="text-blue-600">EDUCATE</span>
                              <span className="text-pink-500"> AUTOMATE</span>
              <span className="text-blue-600"> TRANSFORM.</span>
            </div>
          </Link>
          
          {/* Explore Dropdown - Prominent position next to logo */}
          <div
            className="relative"
            ref={dropdownRef}
            tabIndex={0}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              className="bg-white hover:bg-gray-50 text-blue-600 px-4 py-2 rounded-md text-sm font-semibold transition-colors border border-blue-600 flex items-center gap-1 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={dropdown}
              aria-controls="explore-menu"
              tabIndex={-1}
            >
              Explore
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div
              id="explore-menu"
              className={`absolute left-0 md:left-0 right-0 md:right-auto top-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-200 origin-top ${dropdown ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'} transform`}
              style={{ minWidth: 'min(48rem, 90vw)' }}
              role="menu"
              aria-label="Explore"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="flex flex-col md:flex-row">
                {/* Column 1: AI Workshops */}
                <div className="px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100 flex-1">
                  <div className="text-sm font-semibold text-gray-900 mb-3">AI Workshops</div>
                  <div className="space-y-2">
                    {offerings.filter(link => link.category === 'AI Workshops').map(link => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 text-sm rounded transition-colors"
                        role="menuitem"
                        tabIndex={dropdown ? 0 : -1}
                        onClick={() => setDropdown(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 2: AI Consultant */}
                <div className="px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100 flex-1">
                  <div className="text-sm font-semibold text-gray-900 mb-3">AI Consultant</div>
                  <div className="space-y-2">
                    {offerings.filter(link => link.category === 'AI Consultant').map(link => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 text-sm rounded transition-colors"
                        role="menuitem"
                        tabIndex={dropdown ? 0 : -1}
                        onClick={() => setDropdown(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 3: AI Services */}
                <div className="px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100 flex-1">
                  <div className="text-sm font-semibold text-gray-900 mb-3">AI Services</div>
                  <div className="space-y-2">
                    {offerings.filter(link => link.category === 'AI Services').map(link => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 text-sm rounded transition-colors"
                        role="menuitem"
                        tabIndex={dropdown ? 0 : -1}
                        onClick={() => setDropdown(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Column 4: Tech Blogs */}
                <div className="px-6 py-4 border-b md:border-b-0 flex-1">
                  <div className="text-sm font-semibold text-gray-900 mb-3">Tech Blogs</div>
                  <div className="space-y-2">
                    {techBlogs.map(blog => (
                      <a
                        key={blog.name}
                        href={blog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 text-sm rounded transition-colors group"
                        role="menuitem"
                        tabIndex={dropdown ? 0 : -1}
                        onClick={() => setDropdown(false)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="mr-2 text-sm">{blog.icon}</span>
                            <div>
                              <div className="font-medium">{blog.name}</div>
                              <div className="text-xs text-gray-500">{blog.description}</div>
                            </div>
                          </div>
                          <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
          <SearchBar />
        </div>

        {/* Right Section - Navigation and Auth */}
        <div className="hidden md:flex items-center space-x-1">
          {/* Navigation Links */}
          <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
          <Link to="/titlihub" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">titliHub</Link>

          {/* User Menu or Auth Buttons */}
          {user ? (
            <div className="relative ml-4" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none rounded-lg p-2 transition-colors"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 border-2 border-blue-300 shadow">
                  {getUserInitials()}
                </div>
                <span className="text-sm font-medium hidden lg:block">{getUserDisplayName()}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-200 origin-top-right ${userMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'} transform`}
                role="menu"
                aria-label="User menu"
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm text-gray-700 font-medium">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Account
                    </div>
                  </Link>
                  <div className="border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 hover:text-red-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">Log in</Link>
              <Link to="/signup" className="bg-white hover:bg-gray-50 text-blue-600 px-4 py-2 rounded-md text-sm font-semibold transition-colors border border-blue-600">Join for Free</Link>
            </>
          )}

          {/* Country Flag */}
          <div className="ml-4">
            <CountryFlag isLoggedIn={!!user} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Show user info in mobile header when logged in */}
          {user && (
            <div className="flex items-center space-x-2 mr-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 border-2 border-blue-300 shadow">
                {getUserInitials()}
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-20 truncate">
                {getUserDisplayName()}
              </span>
            </div>
          )}
          <CountryFlag isLoggedIn={!!user} />
          <button onClick={() => setOpen(!open)} className="text-gray-700 focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-2 pt-2 pb-3 space-y-1">
          <div className="px-2 py-2">
            <SearchBar />
          </div>
          <Link to="/" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/titlihub" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setOpen(false)}>titliHub</Link>
          
          {/* Mobile Explore Dropdown */}
          <div className="block">
            <button
              onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
              className="w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium font-semibold flex items-center justify-between"
            >
              Explore
              <svg 
                className={`w-4 h-4 transition-transform ${mobileExploreOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileExploreOpen && (
              <div className="pl-2 border-l-2 border-gray-200 ml-2">
                {/* AI Workshops Section */}
                <div className="mb-3">
                  <div className="text-gray-900 px-3 py-2 text-sm font-semibold">AI Workshops</div>
                  {offerings.filter(link => link.category === 'AI Workshops').map(link => (
                    <Link key={link.to} to={link.to} className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" onClick={() => setOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                </div>
                
                {/* AI Consultant Section */}
                <div className="mb-3">
                  <div className="text-gray-900 px-3 py-2 text-sm font-semibold">AI Consultant</div>
                  {offerings.filter(link => link.category === 'AI Consultant').map(link => (
                    <Link key={link.to} to={link.to} className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" onClick={() => setOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                </div>
                
                {/* AI Services Section */}
                <div className="mb-3">
                  <div className="text-gray-900 px-3 py-2 text-sm font-semibold">AI Services</div>
                  {offerings.filter(link => link.category === 'AI Services').map(link => (
                    <Link key={link.to} to={link.to} className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" onClick={() => setOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                </div>
                
                {/* Mobile Tech Blogs Section */}
                <div className="border-t border-gray-200 pt-2">
                  <div className="text-gray-900 px-3 py-2 text-sm font-semibold">Tech Blogs</div>
                  {techBlogs.map(blog => (
                    <a
                      key={blog.name}
                      href={blog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{blog.icon}</span>
                        <div>
                          <div>{blog.name}</div>
                          <div className="text-xs text-gray-500">{blog.description}</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          {user ? (
            <div className="mt-2 space-y-2">
              <div className="px-3 py-2 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 border-2 border-blue-300 shadow">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
              <Link to="/account" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setOpen(false)}>
                My Account
              </Link>
              <button onClick={handleLogout} className="w-full text-left text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-base font-medium">
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="block mt-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-md text-base font-medium" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="block mt-2 bg-white hover:bg-gray-50 text-blue-600 px-4 py-2 rounded-md text-base font-semibold border border-blue-600" onClick={() => setOpen(false)}>
                Join for Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 