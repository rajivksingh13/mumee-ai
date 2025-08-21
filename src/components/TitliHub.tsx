import React, { useState } from 'react';

const TitliHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const showcases = [
    {
      id: 1,
      title: "Simple Chatbot",
      description: "Interactive AI chatbot with natural language processing capabilities for customer support and engagement",
      icon: "💬",
      category: "Customer Support & Sales",
      subcategory: "Conversational AI",
      status: "Live Demo",
      link: "https://teachlea-bot.streamlit.app/",
      features: ["Natural Language Processing", "Real-time Responses", "Multi-language Support"],
      gradient: "from-green-500 to-emerald-600",
      badgeColor: "bg-green-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      author: "titliAI",
      lastUpdated: "2 days ago",
      likes: 156,
      runs: "1.2K+"
    },
    {
      id: 2,
      title: "RAG Document Q&A",
      description: "Upload PDF/Word documents and ask intelligent questions about the content with AI-powered insights",
      icon: "📄",
      category: "Finance & Operations",
      subcategory: "Document Processing",
      status: "Live Demo",
      link: "https://teachlea-rag.streamlit.app/",
      features: ["Document Upload", "Intelligent Q&A", "Context Awareness"],
      gradient: "from-blue-500 to-purple-600",
      badgeColor: "bg-blue-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      author: "titliAI",
      lastUpdated: "1 week ago",
      likes: 89,
      runs: "500+"
    },
    {
      id: 3,
      title: "OCR Image Recognition",
      description: "Extract text from images using advanced OCR technology with high accuracy and multiple format support",
      icon: "🖼️",
      category: "Finance & Operations",
      subcategory: "Image Processing",
      status: "Live Demo",
      link: "https://app--class-mate-ai-6a1614c4.base44.app/Dashboard",
      features: ["High Accuracy OCR", "Multiple Formats", "Batch Processing"],
      gradient: "from-purple-500 to-pink-600",
      badgeColor: "bg-purple-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      author: "titliAI",
      lastUpdated: "3 days ago",
      likes: 234,
      runs: "3K+"
    },
    {
      id: 4,
      title: "Document Summarizer",
      description: "AI-powered document summarization with key points extraction and intelligent content analysis",
      icon: "📊",
      category: "Marketing & Content",
      subcategory: "Content Analysis",
      status: "Live Demo",
      link: "#summarizer-demo",
      features: ["Smart Summarization", "Key Points Extraction", "Multiple Languages"],
      gradient: "from-indigo-500 to-blue-600",
      badgeColor: "bg-indigo-500",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      author: "titliAI",
      lastUpdated: "5 days ago",
      likes: 67,
      runs: "800+"
    },
    {
      id: 5,
      title: "Sentiment Analysis",
      description: "Analyze text sentiment and emotion detection with advanced machine learning algorithms",
      icon: "😊",
      category: "Customer Support & Sales",
      subcategory: "Text Analysis",
      status: "Coming Soon",
      link: "#sentiment-demo",
      features: ["Emotion Detection", "Sentiment Scoring", "Real-time Analysis"],
      gradient: "from-pink-500 to-rose-600",
      badgeColor: "bg-pink-500",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      author: "titliAI",
      lastUpdated: "Coming Soon",
      likes: 0,
      runs: "0"
    },
    {
      id: 6,
      title: "Data Visualization",
      description: "Create interactive charts and graphs from data with AI-powered insights and recommendations",
      icon: "📈",
      category: "Finance & Operations",
      subcategory: "Data Analysis",
      status: "Coming Soon",
      link: "#viz-demo",
      features: ["Interactive Charts", "AI Insights", "Custom Dashboards"],
      gradient: "from-orange-500 to-red-600",
      badgeColor: "bg-orange-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      author: "titliAI",
      lastUpdated: "Coming Soon",
      likes: 0,
      runs: "0"
    },
    {
      id: 7,
      title: "Resume Parser",
      description: "AI-powered resume screening and candidate analysis for HR and recruitment teams",
      icon: "👥",
      category: "HR & Recruitment",
      subcategory: "Document Processing",
      status: "Coming Soon",
      link: "#resume-demo",
      features: ["Resume Screening", "Candidate Matching", "Skills Extraction"],
      gradient: "from-teal-500 to-cyan-600",
      badgeColor: "bg-teal-500",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      author: "titliAI",
      lastUpdated: "Coming Soon",
      likes: 0,
      runs: "0"
    },
    {
      id: 8,
      title: "Brand Sentiment Tracker",
      description: "Monitor brand sentiment across social media and online platforms in real-time",
      icon: "📱",
      category: "Marketing & Content",
      subcategory: "Text Analysis",
      status: "Coming Soon",
      link: "#brand-demo",
      features: ["Social Media Monitoring", "Brand Sentiment", "Trend Analysis"],
      gradient: "from-violet-500 to-purple-600",
      badgeColor: "bg-violet-500",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      author: "titliAI",
      lastUpdated: "Coming Soon",
      likes: 0,
      runs: "0"
    }
  ];

  const categories = [
    "All", 
    "Customer Support & Sales", 
    "Finance & Operations", 
    "HR & Recruitment", 
    "Marketing & Content",
    "Development & IT",
    "Logistics & Supply Chain"
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Customer Support & Sales": return "💬";
      case "Finance & Operations": return "💰";
      case "HR & Recruitment": return "👥";
      case "Marketing & Content": return "📢";
      case "Development & IT": return "💻";
      case "Logistics & Supply Chain": return "📦";
      default: return "🏢";
    }
  };

  const statuses = ["All", "Live Demo", "Coming Soon"];

  // Filter and search logic
  const filteredShowcases = showcases.filter(showcase => {
    const categoryMatch = selectedCategory === "All" || showcase.category === selectedCategory;
    const statusMatch = selectedStatus === "All" || showcase.status === selectedStatus;
    const searchMatch = searchQuery === "" || 
      showcase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      showcase.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      showcase.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && statusMatch && searchMatch;
  });

  // Sort logic
  const sortedShowcases = [...filteredShowcases].sort((a, b) => {
    switch (sortBy) {
      case "relevance":
        return b.likes - a.likes;
      case "newest":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case "popular":
        return parseInt(b.runs.replace(/\D/g, '')) - parseInt(a.runs.replace(/\D/g, ''));
      default:
        return 0;
    }
  });

  const handleLaunchDemo = (link: string) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      console.log('Demo link:', link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
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
             <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight px-2">
               <span className="block mb-2">Explore AI Solutions With</span>
               <span className="block bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-wide">
                 titli<span className="text-pink-500">Hub</span>
               </span>
             </h1>
          

                         {/* Subtitle */}
             <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
               Discover real-world GenAI applications, interactive demos, and innovative proof-of-concepts that showcase the future of artificial intelligence across industries.
             </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{showcases.length}</div>
                <div className="text-sm text-gray-600">Solutions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {showcases.filter(s => s.status === "Live Demo").length}
                </div>
                <div className="text-sm text-gray-600">Live Demos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{categories.length - 1}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search AI solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
                             {/* Category Filter */}
               <div className="flex items-center space-x-2">
                 <label className="text-sm font-medium text-gray-700">Category:</label>
                 <select 
                   value={selectedCategory}
                   onChange={(e) => setSelectedCategory(e.target.value)}
                   className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 >
                   {categories.map(category => (
                     <option key={category} value={category}>
                       {category === "All" ? "All Categories" : `${getCategoryIcon(category)} ${category}`}
                     </option>
                   ))}
                 </select>
               </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

                     {/* Results Summary */}
           <div className="flex items-center justify-between mt-6">
             <h3 className="text-lg font-semibold text-gray-900">
               {selectedCategory === "All" ? "All Solutions" : `${selectedCategory} Solutions`}
             </h3>
            <div className="text-sm text-gray-600">
              Showing {sortedShowcases.length} of {showcases.length} solutions
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid/List */}
      <section className="py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedShowcases.map((showcase) => (
                <div key={showcase.id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  <div className="relative">
                    <div className={`h-48 bg-gradient-to-br ${showcase.gradient} flex items-center justify-center`}>
                      <div className="text-6xl">{showcase.icon}</div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`${showcase.badgeColor} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                        {showcase.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 ${showcase.iconBg} rounded-lg flex items-center justify-center mr-3`}>
                        <span className={`${showcase.iconColor} font-semibold text-sm`}>AI</span>
                      </div>
                      <span className="text-sm text-gray-500">{showcase.category}</span>
                    </div>
                    <h3 className={`text-xl font-semibold text-gray-900 mb-2 group-hover:${showcase.iconColor} transition-colors`}>
                      {showcase.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {showcase.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                      <span>by {showcase.author}</span>
                      <span>{showcase.lastUpdated}</span>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Key Features</h4>
                      <div className="space-y-1">
                        {showcase.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-600">
                            <div className={`w-1 h-1 ${showcase.iconColor} rounded-full mr-2 flex-shrink-0`}></div>
                            <span className="line-clamp-1">{feature}</span>
                          </div>
                        ))}
                        {showcase.features.length > 2 && (
                          <div className="text-xs text-gray-500 italic">
                            +{showcase.features.length - 2} more features
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>❤️ {showcase.likes}</span>
                        <span>▶️ {showcase.runs}</span>
                      </div>
                      <button
                        onClick={() => handleLaunchDemo(showcase.link)}
                        className={`${showcase.iconColor} hover:opacity-80 font-medium text-sm flex items-center ${
                          showcase.status !== "Live Demo" ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={showcase.status !== "Live Demo"}
                      >
                        {showcase.status === "Live Demo" ? (
                          <>
                            Launch Demo
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </>
                        ) : (
                          "Coming Soon"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedShowcases.map((showcase) => (
                <div key={showcase.id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 p-6">
                  <div className="flex items-start space-x-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${showcase.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <div className="text-2xl">{showcase.icon}</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`text-xl font-semibold text-gray-900 group-hover:${showcase.iconColor} transition-colors`}>
                              {showcase.title}
                            </h3>
                            <span className={`${showcase.badgeColor} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                              {showcase.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{showcase.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                            <span>by {showcase.author}</span>
                            <span>{showcase.lastUpdated}</span>
                            <span>❤️ {showcase.likes}</span>
                            <span>▶️ {showcase.runs}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <span className="text-sm text-gray-500">{showcase.category}</span>
                          <div className="flex space-x-2">
                            {showcase.features.slice(0, 3).map((feature, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleLaunchDemo(showcase.link)}
                          className={`${showcase.iconColor} hover:opacity-80 font-medium text-sm flex items-center ${
                            showcase.status !== "Live Demo" ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={showcase.status !== "Live Demo"}
                        >
                          {showcase.status === "Live Demo" ? (
                            <>
                              Launch Demo
                              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </>
                          ) : (
                            "Coming Soon"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {sortedShowcases.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No solutions found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedStatus("All");
                  setSearchQuery("");
                }}
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
                         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
               Ready to Explore More <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-wide">
                  titli<span className="text-pink-500">AI</span>
                </span> Solutions?
             </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our workshops to learn how to implement these cutting-edge AI solutions in your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <span>Explore titliAI</span>
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-lg shadow-xl hover:shadow-2xl border-2 border-gray-300 transform hover:-translate-y-1 transition-all duration-200"
              >
                <span>Get in Touch</span>
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TitliHub;
