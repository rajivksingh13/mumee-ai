import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/authService';
import SearchBar from './SearchBar';
import ButterflyLogo from './ButterflyLogo';
import CountryFlag from './CountryFlag';

const offerings = [
  { to: '/workshops', label: 'AI Workshops' },
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (dropdown || userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdown, userMenuOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdown(false);
    setUserMenuOpen(false);
    setOpen(false);
  }, [location]);

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
    <nav className="bg-gradient-to-b from-gray-900 to-gray-800 border-b border-gray-800 shadow-md sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center text-2xl font-extrabold text-white gap-2">
            <ButterflyLogo size="md" />
            <span>titliAI</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-200 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
          <SearchBar />
          <div
            className="relative"
            ref={dropdownRef}
            tabIndex={0}
          >
            <button
              className="text-gray-200 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 focus:outline-none"
              onClick={() => setDropdown((d) => !d)}
              aria-haspopup="true"
              aria-expanded={dropdown}
              aria-controls="offerings-menu"
              tabIndex={-1}
            >
              Offerings
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div
              id="offerings-menu"
              className={`absolute left-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50 transition-all duration-200 origin-top ${dropdown ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'} transform`}
              style={{ minWidth: '16rem' }}
              role="menu"
              aria-label="Offerings"
            >
              {offerings.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-indigo-400 text-sm rounded transition-colors"
                  role="menuitem"
                  tabIndex={dropdown ? 0 : -1}
                  onClick={() => setDropdown(false)}
                >
                  {link.label}
                </Link>
              ))}
              {/* Tech Blogs Section */}
              <div className="border-t border-gray-700 mt-2 pt-2">
                <div className="px-4 py-2 text-xs text-gray-400 font-medium">Tech Blogs</div>
                {techBlogs.map(blog => (
                  <a
                    key={blog.name}
                    href={blog.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-indigo-400 text-sm rounded transition-colors group"
                    role="menuitem"
                    tabIndex={dropdown ? 0 : -1}
                    onClick={() => setDropdown(false)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">{blog.icon}</span>
                        <div>
                          <div className="font-medium">{blog.name}</div>
                          <div className="text-xs text-gray-400">{blog.description}</div>
                        </div>
                      </div>
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          {user ? (
            <div className="relative ml-4" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 text-gray-200 hover:text-indigo-400 focus:outline-none rounded-lg p-2 transition-colors"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-sm font-bold text-indigo-700 border-2 border-indigo-400 shadow">
                  {getUserInitials()}
                </div>
                <span className="text-sm font-medium hidden lg:block">{getUserDisplayName()}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50 transition-all duration-200 origin-top-right ${userMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'} transform`}
                role="menu"
                aria-label="User menu"
              >
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-sm text-gray-200 font-medium">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 hover:text-indigo-400 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Account
                    </div>
                  </Link>
                  <div className="border-t border-gray-800">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
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
              <Link to="/login" className="ml-4 text-gray-200 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-semibold">Sign In</Link>
              <Link to="/signup" className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-semibold">Sign Up</Link>
            </>
          )}
          <div className="ml-4">
            <CountryFlag isLoggedIn={!!user} />
          </div>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <CountryFlag isLoggedIn={!!user} />
          <button onClick={() => setOpen(!open)} className="text-gray-200 focus:outline-none">
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
      {open && (
        <div className="md:hidden bg-gradient-to-b from-gray-900 to-gray-800 border-t border-gray-800 px-2 pt-2 pb-3 space-y-1">
          <div className="px-2 py-2">
            <SearchBar />
          </div>
          <Link to="/" className="block text-gray-200 hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium" onClick={() => setOpen(false)}>Home</Link>
          <div className="block">
            <div className="text-gray-200 px-3 py-2 text-base font-medium font-semibold">Offerings</div>
            <div className="pl-2">
              {offerings.map(link => (
                <Link key={link.to} to={link.to} className="block text-gray-200 hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {/* Mobile Tech Blogs Section */}
              <div className="border-t border-gray-700 mt-2 pt-2">
                <div className="text-gray-400 px-3 py-1 text-sm font-medium">Tech Blogs</div>
                {techBlogs.map(blog => (
                  <a
                    key={blog.name}
                    href={blog.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-200 hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{blog.icon}</span>
                      <div>
                        <div>{blog.name}</div>
                        <div className="text-xs text-gray-400">{blog.description}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          {user ? (
            <div className="mt-2 space-y-2">
              <div className="px-3 py-2 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-sm font-bold text-indigo-700 border-2 border-indigo-400 shadow">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="text-gray-200 font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
              </div>
              <Link to="/account" className="block text-gray-200 hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium" onClick={() => setOpen(false)}>
                My Account
              </Link>
              <button onClick={handleLogout} className="w-full text-left text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-base font-medium">
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="block mt-2 text-gray-200 hover:text-indigo-400 px-4 py-2 rounded-md text-base font-semibold" onClick={() => setOpen(false)}>
                Sign In
              </Link>
              <Link to="/signup" className="block mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-base font-semibold" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 