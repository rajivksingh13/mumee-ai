import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Comprehensive search data for all titliAI pages and offerings
const searchData = [
  // Main Pages
  { id: 1, title: 'Home', type: 'Page', path: '/', description: 'Welcome to titliAI - Your AI Learning Platform' },
  { id: 2, title: 'titliHub', type: 'Page', path: '/titlihub', description: 'Central hub for all titliAI resources and tools' },
  
  // AI Workshops - All Levels
  { id: 3, title: 'AI Workshops', type: 'Offering', path: '/workshops/beginner', description: 'Hands-on AI workshops for all levels' },
  { id: 4, title: 'Absolute Beginner', type: 'Workshop', path: '/workshops/beginner', description: 'Start your AI journey from scratch - no prior experience needed' },
  { id: 5, title: 'Foundation Level', type: 'Workshop', path: '/workshops/foundation', description: 'Learn the fundamentals of AI and machine learning' },
  { id: 6, title: 'Advance Level', type: 'Workshop', path: '/workshops/advance', description: 'Advanced AI concepts and practical applications' },
  
  // Core Offerings
  { id: 7, title: 'AI Consultant', type: 'Offering', path: '/consultant', description: 'Expert AI consulting for your business' },
  { id: 8, title: 'AI Library', type: 'Offering', path: '/library', description: 'GenAI books & AI-generated comics' },
  { id: 9, title: 'AI Labs', type: 'Offering', path: '/labs', description: 'Experiment with the latest AI tools' },
  { id: 10, title: 'AI-Agents Marketplace', type: 'Offering', path: '/marketplace', description: 'Discover and deploy AI agents' },
  { id: 11, title: 'AI Training', type: 'Offering', path: '/training', description: 'AI training programs for upskilling' },
  { id: 12, title: 'AI Certifications', type: 'Offering', path: '/certifications', description: 'Get certified in AI technologies' },
  { id: 13, title: 'AI Blogs', type: 'Offering', path: '/blogs', description: 'Stay updated with AI trends' },
  
  // AI Topics & Skills
  { id: 14, title: 'Machine Learning', type: 'Topic', path: '/workshops/foundation', description: 'Learn machine learning fundamentals' },
  { id: 15, title: 'Deep Learning', type: 'Topic', path: '/workshops/advance', description: 'Advanced neural networks and deep learning' },
  { id: 16, title: 'Natural Language Processing', type: 'Topic', path: '/workshops/foundation', description: 'AI for text and language understanding' },
  { id: 17, title: 'Computer Vision', type: 'Topic', path: '/workshops/foundation', description: 'AI for image and video analysis' },
  { id: 18, title: 'Data Science', type: 'Topic', path: '/workshops/foundation', description: 'Data analysis and visualization with AI' },
  { id: 19, title: 'Prompt Engineering', type: 'Topic', path: '/workshops/beginner', description: 'Master the art of AI prompt design' },
  { id: 20, title: 'Artificial Intelligence', type: 'Topic', path: '/workshops/foundation', description: 'Comprehensive AI learning and applications' },
  { id: 21, title: 'Neural Networks', type: 'Topic', path: '/workshops/advance', description: 'Understanding and building neural networks' },
  { id: 22, title: 'AI Ethics', type: 'Topic', path: '/workshops/foundation', description: 'Ethical considerations in AI development' },
  { id: 23, title: 'AI Tools', type: 'Topic', path: '/workshops/beginner', description: 'Practical AI tools and frameworks' },
  
  // User Account & Features
  { id: 24, title: 'My Account', type: 'Page', path: '/account', description: 'Manage your titliAI account and preferences' },
  { id: 25, title: 'Purchase History', type: 'Page', path: '/purchase-history', description: 'View your workshop and course purchases' },
  { id: 26, title: 'Profile', type: 'Page', path: '/profile', description: 'Update your profile and learning preferences' },
  
  // Authentication
  { id: 27, title: 'Login', type: 'Page', path: '/login', description: 'Sign in to your titliAI account' },
  { id: 28, title: 'Sign Up', type: 'Page', path: '/signup', description: 'Create a new titliAI account' },
  { id: 29, title: 'Join for Free', type: 'Page', path: '/signup', description: 'Start your free titliAI journey' },
  
  // Tech Blogs
  { id: 30, title: 'Techno-Pulse', type: 'Blog', path: 'https://www.techno-pulse.com/', description: 'Technology Simplified - External tech blog' },
  { id: 31, title: 'TeachLea', type: 'Blog', path: 'https://www.teachlea.com/', description: 'Learning Platform - External educational blog' },
  
  // titliHub Features
  { id: 32, title: 'Chatbot', type: 'Feature', path: '/titlihub', description: 'AI-powered chatbot for instant help and guidance' },
  { id: 33, title: 'AI Assistant', type: 'Feature', path: '/titlihub', description: 'Interactive AI assistant to answer your questions' },
  { id: 34, title: 'Chat Bot', type: 'Feature', path: '/titlihub', description: 'Simple chat bot for customer support and queries' },
  { id: 35, title: 'AI Chat', type: 'Feature', path: '/titlihub', description: 'Chat with AI for learning assistance and support' },
  
  // Additional AI Concepts
  { id: 36, title: 'Generative AI', type: 'Topic', path: '/workshops/beginner', description: 'Create content with AI - text, images, and more' },
  { id: 37, title: 'AI Applications', type: 'Topic', path: '/workshops/foundation', description: 'Real-world AI applications and use cases' },
  { id: 38, title: 'AI Development', type: 'Topic', path: '/workshops/advance', description: 'Learn to develop AI applications and systems' },
  { id: 39, title: 'AI Business', type: 'Topic', path: '/workshops/foundation', description: 'AI for business strategy and implementation' },
];

interface SearchResult {
  id: number;
  title: string;
  type: string;
  path: string;
  description: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Filter results based on query
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Workshop': return '🎓';
      case 'Offering': return '💡';
      case 'Topic': return '📚';
      case 'Page': return '🏠';
      case 'Blog': return '📝';
      case 'Feature': return '🤖';
      default: return '🔍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Workshop': return 'text-blue-400';
      case 'Offering': return 'text-green-400';
      case 'Topic': return 'text-purple-400';
      case 'Page': return 'text-indigo-400';
      case 'Blog': return 'text-orange-400';
      case 'Feature': return 'text-teal-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md mx-4 md:mx-4 mx-0">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() !== '' && results.length > 0 && setIsOpen(true)}
          placeholder="Search Workshops, AI Solutions, and more"
          className="block w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
        <button
          type="button"
          onClick={() => {
            if (query.trim() !== '') {
              if (results.length > 0) {
                // Navigate to the first result
                handleResultClick(results[0]);
              } else {
                // No results found, navigate to home page
                navigate('/');
                setQuery('');
                setIsOpen(false);
              }
            }
          }}
          className="absolute inset-y-0 right-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 transition-colors"
          style={{ right: '4px', top: '50%', transform: 'translateY(-50%)' }}
          title="Search"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-12 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="py-2">
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                  index === selectedIndex ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-lg">{getTypeIcon(result.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-gray-900 font-medium truncate">{result.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${getTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{result.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200 px-4 py-2">
            <p className="text-xs text-gray-500">
              Press Enter to select, Esc to close
            </p>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() !== '' && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl">
          <div className="px-4 py-6 text-center">
            <div className="text-gray-400 text-lg mb-2">🔍</div>
            <p className="text-gray-900 font-medium">No results found</p>
            <p className="text-gray-600 text-sm mt-1 mb-3">
              Try searching for workshops, offerings, or topics
            </p>
            <button
              onClick={() => {
                navigate('/');
                setQuery('');
                setIsOpen(false);
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
            >
              Go to Home Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 