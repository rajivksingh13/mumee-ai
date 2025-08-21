import React from 'react';

const AIConsultancyPage: React.FC = () => {
  const consultancyAreas = [
    {
      category: "Customer Support & Sales",
      icon: "💬",
      description: "Transform your customer interactions with AI-powered solutions",
             services: [
         "AI Strategy for Customer Support",
         "Chatbot Implementation Planning",
         "Customer Journey AI Roadmap",
         "Sales Process AI Assessment",
         "Customer Analytics Strategy",
         "Multi-language AI Planning"
       ],
       benefits: [
         "Clear AI implementation roadmap",
         "Technology stack recommendations",
         "ROI analysis and projections",
         "Risk assessment and mitigation"
       ]
    },
    {
      category: "Finance & Operations",
      icon: "💰",
      description: "Streamline financial processes and operational efficiency",
             services: [
         "AI Strategy for Document Processing",
         "OCR Implementation Planning",
         "Financial Process AI Assessment",
         "Compliance AI Roadmap",
         "Expense Management AI Strategy",
         "Financial Analytics Planning"
       ],
       benefits: [
         "Technology evaluation and selection",
         "Implementation timeline planning",
         "Cost-benefit analysis",
         "Compliance framework guidance"
       ]
    },
    {
      category: "HR & Recruitment",
      icon: "👥",
      description: "Revolutionize your human resources and talent acquisition",
             services: [
         "AI Strategy for Recruitment",
         "HR Process AI Assessment",
         "Employee Analytics Planning",
         "Training AI Roadmap",
         "Performance Management AI Strategy",
         "HR Automation Planning"
       ],
       benefits: [
         "Recruitment process optimization",
         "Technology vendor evaluation",
         "Implementation strategy planning",
         "Change management guidance"
       ]
    },
    {
      category: "Marketing & Content",
      icon: "📢",
      description: "Elevate your marketing strategies with AI-driven insights",
             services: [
         "AI Strategy for Content Marketing",
         "Marketing Automation Planning",
         "Customer Segmentation Strategy",
         "Campaign Analytics Planning",
         "Personalization AI Roadmap",
         "SEO & Content AI Strategy"
       ],
       benefits: [
         "Marketing technology evaluation",
         "Content strategy optimization",
         "ROI projection and analysis",
         "Implementation roadmap planning"
       ]
    },
    {
      category: "Development & IT",
      icon: "💻",
      description: "Accelerate your development and IT infrastructure",
             services: [
         "AI Strategy for Development",
         "DevOps AI Assessment",
         "Code Quality AI Planning",
         "Security AI Roadmap",
         "Infrastructure AI Strategy",
         "Testing Automation Planning"
       ],
       benefits: [
         "Technology stack recommendations",
         "Development process optimization",
         "Security framework guidance",
         "Implementation timeline planning"
       ]
    },
    {
      category: "Logistics & Supply Chain",
      icon: "📦",
      description: "Optimize your supply chain and logistics operations",
             services: [
         "AI Strategy for Supply Chain",
         "Logistics AI Assessment",
         "Inventory Management Planning",
         "Route Optimization Strategy",
         "Supplier Analytics Planning",
         "Warehouse AI Roadmap"
       ],
       benefits: [
         "Supply chain optimization strategy",
         "Technology vendor evaluation",
         "Cost-benefit analysis",
         "Implementation roadmap planning"
       ]
    }
  ];

  const handleGetInTouch = () => {
    // Navigate to contact page
    window.location.href = '/contact';
  };

  const handleEmailContact = () => {
    // Open email client
    window.location.href = 'mailto:info@techno-pulse.com?subject=AI Consultancy Inquiry';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                             <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                 <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                   titli<span className="text-pink-500">AI</span>
                 </span> Consultancy
               </h1>
                             <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                 Get expert guidance on AI strategy and implementation planning. Our seasoned consultants provide strategic advice, roadmap development, and best practices to help you navigate your AI transformation journey with confidence.
               </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGetInTouch}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Get In Touch
                </button>
                <button
                  onClick={handleEmailContact}
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
                >
                  Email Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                 Why Choose <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
               titli<span className="text-pink-500">AI</span>
             </span>?
               </h2>
                             <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                 We combine deep industry expertise with strategic AI knowledge to provide guidance that helps you make informed decisions and plan successful AI initiatives.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-3">Strategic Expertise</h3>
                 <p className="text-gray-600">Get guidance on the latest AI trends, technologies, and industry best practices.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Advisors</h3>
                 <p className="text-gray-600">Experienced AI consultants with deep domain knowledge to guide your strategy.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-3">Proven Methodologies</h3>
                 <p className="text-gray-600">Track record of successful AI strategy development and roadmap planning.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Consultancy Areas Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Consultancy Areas</span>
              </h2>
                             <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                 We provide strategic AI consultancy services across all major business functions, helping organizations plan and strategize their AI transformation journey for competitive advantage.
               </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {consultancyAreas.map((area, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{area.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{area.category}</h3>
                      <p className="text-gray-600">{area.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Our Services:</h4>
                    <ul className="space-y-2">
                      {area.services.map((service, serviceIndex) => (
                        <li key={serviceIndex} className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {area.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700 font-medium">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Consultation Process</span>
              </h2>
                             <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                 We follow a structured approach to ensure successful AI strategy development and comprehensive planning for maximum business value.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-3">Discovery</h3>
                 <p className="text-gray-600">Understanding your business needs, challenges, and AI opportunities for strategic planning.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-3">Strategy</h3>
                 <p className="text-gray-600">Developing a comprehensive AI strategy and roadmap aligned with your business goals.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-3">Planning</h3>
                 <p className="text-gray-600">Creating detailed implementation plans and technology recommendations.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-3">Guidance</h3>
                 <p className="text-gray-600">Providing ongoing strategic guidance and best practices for AI initiatives.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Business with AI?
              </h2>
                             <p className="text-xl mb-8 opacity-90">
                 Let's discuss how our AI consultancy services can help you plan and strategize your AI transformation journey for maximum business impact.
               </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGetInTouch}
                  className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Get In Touch
                </button>
                <button
                  onClick={handleEmailContact}
                  className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
                >
                  Email: info@techno-pulse.com
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIConsultancyPage;
