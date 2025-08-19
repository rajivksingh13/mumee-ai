import React, { useState } from 'react';

const TitliHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

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
      features: ["Natural Language Processing", "Real-time Responses", "Multi-language Support"]
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
      features: ["Document Upload", "Intelligent Q&A", "Context Awareness"]
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
      features: ["High Accuracy OCR", "Multiple Formats", "Batch Processing"]
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
      features: ["Smart Summarization", "Key Points Extraction", "Multiple Languages"]
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
      features: ["Emotion Detection", "Sentiment Scoring", "Real-time Analysis"]
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
      features: ["Interactive Charts", "AI Insights", "Custom Dashboards"]
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
      features: ["Resume Screening", "Candidate Matching", "Skills Extraction"]
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
      features: ["Social Media Monitoring", "Brand Sentiment", "Trend Analysis"]
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

  const filteredShowcases = selectedCategory === "All" 
    ? showcases 
    : showcases.filter(showcase => showcase.category === selectedCategory);

  const handleLaunchDemo = (link: string) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      // Handle internal links or placeholder links
      console.log('Demo link:', link);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen text-gray-900 font-sans">
      {/* Page Header */}
      <section className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    titliHub
                  </h1>
                  <p className="text-sm text-gray-500 font-medium -mt-1">
                    AI Solutions Showcase
                  </p>
                </div>
              </div>
              <div className="hidden lg:block w-px h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
              <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="font-medium">Explore AI Solutions</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Live Demos Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-blue-700 font-semibold text-sm">
                      {filteredShowcases.length} Solutions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Sidebar - Category Filter */}
          <div className="xl:w-80 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm border border-blue-100/50 rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Departments</h3>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {categories.length - 1} Teams
                </div>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categories.map((category) => {
                  const getCategoryIcon = (cat: string) => {
                    switch (cat) {
                      case "Customer Support & Sales": return "💬";
                      case "Finance & Operations": return "💰";
                      case "HR & Recruitment": return "👥";
                      case "Marketing & Content": return "📢";
                      case "Development & IT": return "💻";
                      case "Logistics & Supply Chain": return "📦";
                      default: return "🏢";
                    }
                  };

                  const getCategoryCount = (cat: string) => {
                    if (cat === "All") return showcases.length;
                    return showcases.filter(showcase => showcase.category === cat).length;
                  };

                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                          : "bg-white/60 hover:bg-white/80 border border-gray-200 text-gray-700 hover:border-blue-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getCategoryIcon(category)}</span>
                          <span>{category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            {getCategoryCount(category)}
                          </span>
                          {selectedCategory === category && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Results Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Showing</span>
                  <span className="font-semibold text-blue-600">{filteredShowcases.length}</span>
                  <span className="text-gray-600">of</span>
                  <span className="font-semibold text-gray-900">{showcases.length}</span>
                  <span className="text-gray-600">solutions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Showcase Grid */}
          <div className="flex-1">
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "All" ? "AI Solutions" : `${selectedCategory} Solutions`}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white/60 backdrop-blur-sm">
                    <option>Latest</option>
                    <option>Popular</option>
                    <option>Name</option>
                  </select>
                </div>
              </div>
              <p className="text-gray-600 max-w-2xl">
                Explore our comprehensive portfolio of AI implementations designed to solve real-world business challenges
              </p>
            </div>
            
            {/* Showcase Grid - Redesigned for smaller, more professional cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShowcases.map((showcase) => (
                <div
                  key={showcase.id}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-2xl">{showcase.icon}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        showcase.status === "Live Demo" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {showcase.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{showcase.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{showcase.description}</p>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Subcategory Badge */}
                    <div className="mb-3">
                      <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-semibold border border-blue-200">
                        {showcase.subcategory}
                      </span>
                    </div>

                    {/* Key Features - Compact */}
                    <div className="mb-4 flex-1">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Features</h4>
                      <div className="space-y-1">
                        {showcase.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-600">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                            <span className="line-clamp-1">{feature}</span>
                          </div>
                        ))}
                        {showcase.features.length > 2 && (
                          <div className="text-xs text-gray-500 italic">
                            +{showcase.features.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Launch Demo Button */}
                    <button
                      onClick={() => handleLaunchDemo(showcase.link)}
                      className={`w-full py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-200 ${
                        showcase.status === "Live Demo"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={showcase.status !== "Live Demo"}
                    >
                      {showcase.status === "Live Demo" ? (
                        <div className="flex items-center justify-center space-x-1">
                          <span>Launch Demo</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      ) : (
                        "Coming Soon"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results Message */}
            {filteredShowcases.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No solutions found</h3>
                <p className="text-gray-600">Try selecting a different category or check back later for new solutions.</p>
              </div>
            )}

            {/* Load More Button (for future scalability) */}
            {filteredShowcases.length > 0 && (
              <div className="text-center mt-8">
                <button className="px-6 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-white/80 hover:border-gray-300 transition-all duration-200">
                  Load More Solutions
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white/60 backdrop-blur-sm border-t border-blue-100/50 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Explore More AI Solutions?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our workshops to learn how to implement these cutting-edge AI solutions in your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/workshops"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Explore Workshops
              </a>
              <a
                href="/contact"
                className="inline-block bg-white text-gray-700 font-semibold px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TitliHub;
