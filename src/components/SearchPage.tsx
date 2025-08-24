import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

// Extended search data with more details
const searchData = [
  { id: 1, title: 'AI Workshops', type: 'Offering', path: '/workshops/beginner', description: 'Hands-on AI workshops for all levels', level: 'All Levels', duration: '1-3 Months', category: 'Workshops' },
  { id: 2, title: 'Foundation Workshop', type: 'Workshop', path: '/workshops/foundation', description: 'Learn the fundamentals of AI and machine learning', level: 'Beginner', duration: '1-3 Months', category: 'Workshops' },
  { id: 3, title: 'AI Consultant', type: 'Offering', path: '/consultant', description: 'Expert AI consulting for your business', level: 'All Levels', duration: 'Ongoing', category: 'Services' },
  { id: 4, title: 'AI Library', type: 'Offering', path: '/library', description: 'GenAI books & AI-generated comics', level: 'All Levels', duration: 'Self-paced', category: 'Resources' },
  { id: 5, title: 'AI Labs', type: 'Offering', path: '/labs', description: 'Experiment with the latest AI tools', level: 'Intermediate', duration: 'Self-paced', category: 'Resources' },
  { id: 6, title: 'AI-Agents Marketplace', type: 'Offering', path: '/marketplace', description: 'Discover and deploy AI agents', level: 'All Levels', duration: 'Ongoing', category: 'Marketplace' },
  { id: 7, title: 'AI Training', type: 'Offering', path: '/training', description: 'AI training programs for upskilling', level: 'All Levels', duration: '1-6 Months', category: 'Training' },
  { id: 8, title: 'AI Certifications', type: 'Offering', path: '/certifications', description: 'Get certified in AI technologies', level: 'All Levels', duration: '3-6 Months', category: 'Certifications' },
  { id: 9, title: 'AI Blogs', type: 'Offering', path: '/blogs', description: 'Stay updated with AI trends', level: 'All Levels', duration: 'Ongoing', category: 'Resources' },
  { id: 10, title: 'Machine Learning', type: 'Topic', path: '/workshops/foundation', description: 'Learn machine learning fundamentals', level: 'Beginner', duration: '1-3 Months', category: 'Topics' },
  { id: 11, title: 'Deep Learning', type: 'Topic', path: '/workshops/advance', description: 'Advanced neural networks and deep learning', level: 'Advanced', duration: '3-6 Months', category: 'Topics' },
  { id: 12, title: 'Natural Language Processing', type: 'Topic', path: '/workshops/foundation', description: 'AI for text and language understanding', level: 'Intermediate', duration: '1-3 Months', category: 'Topics' },
  { id: 13, title: 'Computer Vision', type: 'Topic', path: '/workshops/foundation', description: 'AI for image and video analysis', level: 'Intermediate', duration: '1-3 Months', category: 'Topics' },
  { id: 14, title: 'Data Science', type: 'Topic', path: '/workshops/foundation', description: 'Data analysis and visualization with AI', level: 'Beginner', duration: '1-3 Months', category: 'Topics' },
  { id: 15, title: 'Prompt Engineering', type: 'Topic', path: '/workshops/beginner', description: 'Master the art of AI prompt design', level: 'All Levels', duration: '1-4 Weeks', category: 'Topics' },
];

const categories = ['All', 'Workshops', 'Services', 'Resources', 'Marketplace', 'Training', 'Certifications', 'Topics'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const durations = ['All Durations', '1-4 Weeks', '1-3 Months', '3-6 Months', '6-12 Months', 'Ongoing', 'Self-paced'];

interface SearchResult {
  id: number;
  title: string;
  type: string;
  path: string;
  description: string;
  level: string;
  duration: string;
  category: string;
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'All Levels');
  const [selectedDuration, setSelectedDuration] = useState(searchParams.get('duration') || 'All Durations');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedLevel !== 'All Levels') params.set('level', selectedLevel);
    if (selectedDuration !== 'All Durations') params.set('duration', selectedDuration);
    setSearchParams(params);
  }, [query, selectedCategory, selectedLevel, selectedDuration, setSearchParams]);

  // Filter results based on query and filters
  useEffect(() => {
    let filtered = searchData;

    // Filter by query
    if (query.trim()) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by level
    if (selectedLevel !== 'All Levels') {
      filtered = filtered.filter(item => item.level === selectedLevel);
    }

    // Filter by duration
    if (selectedDuration !== 'All Durations') {
      filtered = filtered.filter(item => item.duration === selectedDuration);
    }

    setResults(filtered);
  }, [query, selectedCategory, selectedLevel, selectedDuration]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Workshop': return '🎓';
      case 'Offering': return '💡';
      case 'Topic': return '📚';
      default: return '🔍';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Search titliAI</h1>
          <p className="text-gray-300">Find workshops, services, and resources tailored to your AI journey</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for workshops, topics, services..."
              className="block w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300 text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Level</h4>
                <div className="space-y-2">
                  {levels.map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="level"
                        value={level}
                        checked={selectedLevel === level}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="mr-2 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300 text-sm">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Duration</h4>
                <div className="space-y-2">
                  {durations.map(duration => (
                    <label key={duration} className="flex items-center">
                      <input
                        type="radio"
                        name="duration"
                        value={duration}
                        checked={selectedDuration === duration}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="mr-2 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300 text-sm">{duration}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </h2>
              {results.length > 0 && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSelectedCategory('All');
                    setSelectedLevel('All Levels');
                    setSelectedDuration('All Durations');
                  }}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
                <p className="text-gray-400 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={() => {
                    setQuery('');
                    setSelectedCategory('All');
                    setSelectedLevel('All Levels');
                    setSelectedDuration('All Durations');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg mr-3"
                >
                  Clear filters
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Go to Home
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    to={result.path}
                    className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{getTypeIcon(result.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{result.title}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                            {result.type}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{result.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`${getLevelColor(result.level)}`}>
                            {result.level}
                          </span>
                          <span className="text-gray-400">
                            {result.duration}
                          </span>
                          <span className="text-gray-400">
                            {result.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 