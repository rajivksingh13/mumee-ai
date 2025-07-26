import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/authService';
import SearchBar from './SearchBar';
import ButterflyLogo from './ButterflyLogo';

const offerings = [
  { to: '/workshops', label: 'AI Workshops' },
  { to: '/consultant', label: 'AI Consultant' },
  { to: '/library', label: 'AI Library' },
  { to: '/labs', label: 'AI Labs' },
  { to: '/marketplace', label: 'AI-Agents Marketplace' },
  { to: '/training', label: 'AI Training' },
  { to: '/certifications', label: 'AI Certifications' },
  { to: '/blogs', label: 'AI Blogs' },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    }
    if (dropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdown]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdown(false);
    setOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/');
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
              className={`absolute left-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50 transition-all duration-200 origin-top ${dropdown ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'} transform`}
              style={{ minWidth: '14rem' }}
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
            </div>
          </div>
          {user ? (
            <div className="flex items-center space-x-4 ml-4">
              <Link to="/account" className="focus:outline-none">
                <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-lg font-bold text-indigo-700 border-2 border-indigo-400 shadow">
                  {(() => {
                    if (user.displayName) {
                      const names = user.displayName.trim().split(' ');
                      if (names.length === 1) return names[0][0].toUpperCase();
                      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
                    } else if (user.email) {
                      return user.email.slice(0, 2).toUpperCase();
                    } else {
                      return 'U';
                    }
                  })()}
                </div>
              </Link>
              <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm font-semibold">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="ml-4 text-gray-200 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-semibold">Sign In</Link>
              <Link to="/signup" className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-semibold">Sign Up</Link>
            </>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <Link to="/" className="flex items-center text-xl font-extrabold text-white gap-2 mr-4">
            <ButterflyLogo size="sm" />
            <span>titliAI</span>
          </Link>
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
            </div>
          </div>
          {user ? (
            <div className="mt-2 flex items-center space-x-4">
              <span className="text-indigo-300 font-semibold">{user.displayName || user.email?.split('@')[0] || 'User'}</span>
              <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-base font-semibold">Logout</button>
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