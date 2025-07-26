import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Search data - this could be expanded with more content
const searchData = [
  { id: 1, title: 'AI Workshops', type: 'Offering', path: '/workshops', description: 'Hands-on AI workshops for all levels' },
  { id: 2, title: 'Foundation Workshop', type: 'Workshop', path: '/workshops/foundation', description: 'Learn the fundamentals of AI and machine learning' },
  { id: 3, title: 'AI Consultant', type: 'Offering', path: '/consultant', description: 'Expert AI consulting for your business' },
  { id: 4, title: 'AI Library', type: 'Offering', path: '/library', description: 'GenAI books & AI-generated comics' },
  { id: 5, title: 'AI Labs', type: 'Offering', path: '/labs', description: 'Experiment with the latest AI tools' },
  { id: 6, title: 'AI-Agents Marketplace', type: 'Offering', path: '/marketplace', description: 'Discover and deploy AI agents' },
  { id: 7, title: 'AI Training', type: 'Offering', path: '/training', description: 'AI training programs for upskilling' },
  { id: 8, title: 'AI Certifications', type: 'Offering', path: '/certifications', description: 'Get certified in AI technologies' },
  { id: 9, title: 'AI Blogs', type: 'Offering', path: '/blogs', description: 'Stay updated with AI trends' },
  { id: 10, title: 'Machine Learning', type: 'Topic', path: '/workshops', description: 'Learn machine learning fundamentals' },
  { id: 11, title: 'Deep Learning', type: 'Topic', path: '/workshops', description: 'Advanced neural networks and deep learning' },
  { id: 12, title: 'Natural Language Processing', type: 'Topic', path: '/workshops', description: 'AI for text and language understanding' },
  { id: 13, title: 'Computer Vision', type: 'Topic', path: '/workshops', description: 'AI for image and video analysis' },
  { id: 14, title: 'Data Science', type: 'Topic', path: '/workshops', description: 'Data analysis and visualization with AI' },
  { id: 15, title: 'Prompt Engineering', type: 'Topic', path: '/workshops', description: 'Master the art of AI prompt design' },
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
      default: return '🔍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Workshop': return 'text-blue-400';
      case 'Offering': return 'text-green-400';
      case 'Topic': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md mx-4 md:mx-4 mx-0">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() !== '' && results.length > 0 && setIsOpen(true)}
          placeholder="Search titliAI offerings, workshops, topics..."
          className="block w-full pl-10 pr-12 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <Link
          to="/search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
          title="Advanced search"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-12 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="py-2">
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-800 focus:bg-gray-800 focus:outline-none transition-colors ${
                  index === selectedIndex ? 'bg-gray-800' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-lg">{getTypeIcon(result.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-white font-medium truncate">{result.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gray-700 ${getTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{result.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-gray-700 px-4 py-2">
            <p className="text-xs text-gray-500">
              Press Enter to select, Esc to close
            </p>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() !== '' && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
          <div className="px-4 py-6 text-center">
            <div className="text-gray-400 text-lg mb-2">🔍</div>
            <p className="text-gray-300 font-medium">No results found</p>
            <p className="text-gray-500 text-sm mt-1">
              Try searching for workshops, offerings, or topics
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 