import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl, API_CONFIG } from '../config/api';

const foundationTopics = [
  {
    topic: 'Workshop - Welcome & Intro',
    hours: 0.5,
    subTopics: [
      'Why this Workshop?',
      'Prerequisites',
      'Workshop Format & Timelines',
      'Resource Downloads',
    ],
  },
  {
    topic: 'Your Journey into the World of GenAI',
    hours: 1.0,
    subTopics: [
      'The Spark for GenAI',
      'Why is GenAI Capturing so much Attention Right Now?',
      'What is the Relationship Between AI, ML, Deep Learning & GenAI?',
      "Inside the AI's Mind: How GenAI Works",
      'Advancements in AI: Key Milestones',
      'Understanding "Modality"',
      'Jargon Buster',
    ],
  },
  {
    topic: 'Prompt Engineering - The Art of Talking to AI',
    hours: 1.0,
    subTopics: [
      'What is Prompt Engineering?',
      'Why Prompt Engineering Matters?',
      'Elements of a Well Crafted Prompt',
      'Type of Prompts',
      'High-Impact Prompt Engineering Tactics',
    ],
  },
  {
    topic: 'Playing with Images, Videos and Music',
    hours: 1.0,
    subTopics: [
      'Introduction to Multimodal AI',
      'Behind the Scene - How Image Generation Works',
      'Working with Images',
      'Playing with Videos',
      'What are Avatars / Digital Twins',
      'Exploring Music and Audio',
      'Creative Use Cases and Tools',
    ],
  },
  {
    topic: 'Responsible AI',
    hours: 0.75,
    subTopics: [
      'What is Responsible AI?',
      'Understanding AI Limitations',
      'Avoiding AI Hallucinations',
      'Mitigating Bias',
      'Protecting Privacy',
      'Ensuring Transparency',
      'Ethical Content Creation',
      'Environmental Impact',
    ],
  },
  {
    topic: 'AI Tools - Make Yourself 10X Productive',
    hours: 0.75,
    subTopics: [
      'NotebookLM',
      'ChatGPT / Gemini / Grok / Anthropic Claude',
      'Google AI Studio Walkthrough',
      'Perplexity Labs',
      'Popular AI Tools (No code, Vibe Coding, Deptt. wise)',
    ],
  },
  {
    topic: 'Making Money with AI: A Few Pointers',
    hours: 0.25,
    subTopics: ['Optional'],
  },
];

const totalHours = foundationTopics.reduce((sum, t) => sum + t.hours, 0);

const WORKSHOP_PRICE = 499; // INR, example price
const WORKSHOP_ID = 'foundation';
const WORKSHOP_TITLE = 'AI Workshop – Foundation Level';

// Smart Email Button Component
const EmailButton: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const emailOptions = [
    {
      name: 'Gmail',
      url: 'https://mail.google.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.727L12 10.875l9.637-7.054h.727c.904 0 1.636.732 1.636 1.636z"/>
        </svg>
      ),
      color: 'text-red-500'
    },
    {
      name: 'Outlook',
      url: 'https://outlook.live.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
        </svg>
      ),
      color: 'text-blue-500'
    },
    {
      name: 'Yahoo Mail',
      url: 'https://mail.yahoo.com',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      color: 'text-purple-500'
    },
    {
      name: 'Default Email App',
      url: `mailto:${userEmail}`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-gray-500'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg border border-gray-200 flex items-center justify-center group"
      >
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Check Email
        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-10">
          {emailOptions.map((option, index) => (
            <a
              key={option.name}
              href={option.url}
              target={option.name === 'Default Email App' ? undefined : '_blank'}
              rel={option.name === 'Default Email App' ? undefined : 'noopener noreferrer'}
              className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                index === emailOptions.length - 1 ? '' : 'border-b border-gray-100'
              }`}
              onClick={() => setShowDropdown(false)}
            >
              <div className={`${option.color} mr-3`}>
                {option.icon}
              </div>
              <span className="text-gray-700 font-medium">{option.name}</span>
            </a>
          ))}
        </div>
      )}
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

const FoundationWorkshop: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  // Razorpay payment handler
  const handlePayment = async () => {
    setError(null);
    setLoading(true);
    setSuccess(null);
    try {
      if (!(window as any).Razorpay) {
        setError('Razorpay script not loaded');
        setLoading(false);
        return;
      }
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        setError('Razorpay API key not configured');
        setLoading(false);
        return;
      }
      // Create order on backend
      const orderResponse = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PAYMENT.CREATE_ORDER), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: WORKSHOP_PRICE * 100,
          currency: 'INR',
          courseId: WORKSHOP_ID,
        }),
      });
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }
      const orderData = await orderResponse.json();
      // Open Razorpay modal
      const options = {
        key: razorpayKey,
        amount: WORKSHOP_PRICE * 100,
        currency: 'INR',
        name: 'titliAI',
        description: `Payment for ${WORKSHOP_TITLE}`,
        image: '/titli.png',
        order_id: orderData.id,
        theme: { color: '#3b82f6' },
        modal: { ondismiss: function() { setLoading(false); } },
        prefill: {
          name: user?.displayName || '',
          email: user?.email || '',
        },
        handler: async function(response: any) {
          try {
            // Verify payment with backend
            const verifyResponse = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PAYMENT.VERIFY), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                courseId: WORKSHOP_ID,
                userId: user?.uid,
              }),
            });
            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || 'Payment verification failed');
            }
            // Send enrollment email via backend (same as CourseDetail)
            try {
              const emailResponse = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.EMAIL.ENROLLMENT), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: user?.email || '',
                  courseTitle: WORKSHOP_TITLE,
                  coursePrice: WORKSHOP_PRICE,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  userName: user?.displayName || 'User',
                }),
              });
              if (emailResponse.ok) {
                console.log('✅ Enrollment email sent successfully');
              } else {
                console.error('❌ Failed to send enrollment email');
              }
            } catch (emailError) {
              console.error('❌ Error sending enrollment email:', emailError);
              // Don't block enrollment if email fails
            }
            // Enrollment logic (could add to DB here)
            setSuccess('Payment successful! You are enrolled in the Foundation Workshop.');
            setEnrollmentSuccess(true);
            setLoading(false);
          } catch (err) {
            setError('Failed to complete enrollment. Please contact support.');
            setLoading(false);
          }
        },
      };
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login', { state: { from: '/workshops/foundation' } });
    } else {
      setShowPayment(true);
    }
  };

  if (enrollmentSuccess) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to the Foundation AI Workshop!</h1>
            <p className="text-gray-700 mb-6">
              You've successfully enrolled in our Foundation workshop. Check your email for workshop details and access instructions.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">Workshop Access: Paid</p>
              <p className="text-green-700">You can start learning immediately!</p>
            </div>
            <Link
              to="/workshops"
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              Back to Workshops
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation */}
        <div className="mb-8">
          <Link
            to="/workshops"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Workshops
          </Link>
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {WORKSHOP_TITLE}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Kickstart your AI journey! Learn the basics of Artificial Intelligence, Machine Learning, and Data Science. No prior experience required. Perfect for students, beginners, and professionals looking to build a strong foundation.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Workshop Overview */}
            <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 mb-8 backdrop-blur-2xl">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Workshop Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
                  <p className="text-gray-700">{totalHours} hours</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Level</h3>
                  <p className="text-gray-700">Beginner Friendly</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Format</h3>
                  <p className="text-gray-700">Online Self-Paced</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Certificate</h3>
                  <p className="text-gray-700">Included</p>
                </div>
              </div>
              <p className="text-gray-700">
                This workshop is designed for anyone looking to build a strong foundation in AI. You'll learn the fundamentals, practical tools, and responsible use of AI.
              </p>
            </div>
            {/* Curriculum */}
            <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
              <h2 className="text-2xl font-bold text-blue-600 mb-6">Curriculum</h2>
              <div className="space-y-6">
                {foundationTopics.map((topic, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{topic.topic}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {topic.hours} hour{topic.hours !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {topic.subTopics.map((subTopic, subIndex) => (
                        <li key={subIndex} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{subTopic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Enrollment Card */}
              <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl mb-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🦋</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Paid Workshop</h3>
                  <div className="3xl font-bold text-blue-600 mb-2">₹{WORKSHOP_PRICE}</div>
                  <p className="text-gray-600 text-sm">One-time payment</p>
                </div>
                {success ? (
                  <div className="text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 font-semibold">✓ Enrollment Successful!</p>
                      <p className="text-green-700 text-sm mt-1">Check your email for details</p>
                    </div>
                    <EmailButton userEmail={user?.email || ''} />
                  </div>
                ) : !showPayment ? (
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
                    onClick={handleEnrollClick}
                  >
                    Enroll Now
                  </button>
                ) : (
                  <div className="space-y-4">
                    {error && (
                      <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-3 text-center">
                        <div className="text-red-700 text-sm">{error}</div>
                      </div>
                    )}
                    <button
                      className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors shadow-lg disabled:opacity-50"
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        'Pay with Razorpay'
                      )}
                    </button>
                  </div>
                )}
                <div className="mt-6 text-sm text-gray-600">
                  <p className="mb-2">✓ Instant access</p>
                  <p className="mb-2">✓ Lifetime access</p>
                  <p className="mb-2">✓ Certificate included</p>
                  <p>✓ No hidden fees</p>
                </div>
              </div>
              {/* What You'll Learn */}
              <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-6 backdrop-blur-2xl">
                <h3 className="text-lg font-bold text-blue-600 mb-4">What You'll Learn</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">AI & GenAI Fundamentals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Prompt Engineering</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Image, Video & Music AI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Responsible & Ethical AI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Productivity with AI Tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Monetizing AI Skills</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Back to Workshops */}
        <div className="text-center mt-12">
          <Link
            to="/workshops"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Workshops
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FoundationWorkshop; 