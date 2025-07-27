import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl, API_CONFIG } from '../config/api';

const beginnerTopics = [
  {
    topic: 'Welcome to AI - Your First Steps',
    hours: 0.5,
    subTopics: [
      'What is Artificial Intelligence?',
      'Why AI Matters in Today\'s World',
      'Your AI Learning Journey',
      'What You\'ll Learn in This Workshop',
    ],
  },
  {
    topic: 'Understanding AI Basics',
    hours: 1.0,
    subTopics: [
      'What is Machine Learning?',
      'What is Deep Learning?',
      'What is Generative AI?',
      'How AI Learns from Data',
      'Real-World AI Examples',
    ],
  },
  {
    topic: 'Your First AI Tools',
    hours: 1.0,
    subTopics: [
      'Introduction to ChatGPT',
      'How to Use AI Chatbots',
      'Writing Better Prompts',
      'AI for Everyday Tasks',
      'Safety and Best Practices',
    ],
  },
  {
    topic: 'AI in Your Daily Life',
    hours: 0.75,
    subTopics: [
      'AI in Your Phone',
      'AI in Social Media',
      'AI in Shopping',
      'AI in Entertainment',
      'Future of AI in Daily Life',
    ],
  },
  {
    topic: 'Getting Started with AI Projects',
    hours: 0.75,
    subTopics: [
      'Simple AI Projects You Can Try',
      'Free AI Tools and Resources',
      'Building Your AI Portfolio',
      'Next Steps After This Workshop',
    ],
  },
];

const totalHours = beginnerTopics.reduce((sum, t) => sum + t.hours, 0);

const WORKSHOP_ID = 'beginner';
const WORKSHOP_TITLE = 'AI Workshop – Beginner Level';

const BeginnerWorkshop: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [showWelcomeSuccess, setShowWelcomeSuccess] = useState(false);

  // Check for redirect parameter after login
  useEffect(() => {
    const fromRedirect = searchParams.get('fromRedirect');
    if (fromRedirect === 'true' && user) {
      // User just logged in and was redirected here
      setShowWelcomeSuccess(true);
      // Automatically enroll the user
      handleAutoEnroll();
    }
  }, [user, searchParams]);

  const handleAutoEnroll = async () => {
    if (!user) return;
    
    setIsEnrolling(true);
    
    try {
      // Simulate enrollment process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send enrollment email via backend
      try {
        const emailResponse = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.EMAIL.ENROLLMENT), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email || '',
            courseTitle: WORKSHOP_TITLE,
            coursePrice: 0, // Free workshop
            paymentId: 'FREE_ENROLLMENT',
            orderId: `free_${Date.now()}`,
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
      }
      
      // Store enrollment in localStorage
      localStorage.setItem(`enrolled_${WORKSHOP_ID}`, 'true');
      setIsEnrolled(true);
      
    } catch (error) {
      console.error('Auto-enrollment failed:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login?redirect=/workshops/beginner');
      return;
    }

    setIsEnrolling(true);
    
    try {
      // Simulate enrollment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send enrollment email via backend (similar to Foundation Workshop)
      try {
        const emailResponse = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.EMAIL.ENROLLMENT), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email || '',
            courseTitle: WORKSHOP_TITLE,
            coursePrice: 0, // Free workshop
            paymentId: 'FREE_ENROLLMENT',
            orderId: `free_${Date.now()}`,
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
      
      // Show success
      setEnrollmentSuccess(true);
      
      // Store enrollment in localStorage
      localStorage.setItem(`enrolled_${WORKSHOP_ID}`, 'true');
      setIsEnrolled(true);
      
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const [isEnrolled, setIsEnrolled] = useState(false);

  // Update isEnrolled state when user or localStorage changes
  useEffect(() => {
    const enrolled = !!(user && localStorage.getItem(`enrolled_${WORKSHOP_ID}`) === 'true');
    setIsEnrolled(enrolled);
  }, [user]);

  // Check if user is already enrolled on component mount
  useEffect(() => {
    if (user && localStorage.getItem(`enrolled_${WORKSHOP_ID}`) === 'true') {
      // Don't set enrollmentSuccess to true for already enrolled users
      // This prevents showing the success page when they navigate back to the workshop
      // Only set enrollmentSuccess for fresh enrollments
    }
  }, [user]);

  // Debug logging to track enrollment state
  useEffect(() => {
    console.log('Enrollment state:', {
      user: !!user,
      isEnrolled,
      enrollmentSuccess,
      showWelcomeSuccess,
      localStorageValue: localStorage.getItem(`enrolled_${WORKSHOP_ID}`)
    });
  }, [user, isEnrolled, enrollmentSuccess, showWelcomeSuccess]);

  // Welcome success page after login redirect
  if (showWelcomeSuccess) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to the Beginner AI Workshop!</h1>
            <p className="text-gray-700 mb-6">
              You've successfully enrolled in our free beginner workshop. Check your email for workshop details and access instructions.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">Workshop Access: Free</p>
              <p className="text-green-700">You can start learning immediately!</p>
            </div>
            <button
              onClick={() => {
                setShowWelcomeSuccess(false);
                setEnrollmentSuccess(false); // Reset enrollment success to show workshop page
                setIsEnrolled(true); // Ensure isEnrolled state is updated
                // Clear the URL parameter to prevent showing welcome page again
                window.history.replaceState({}, document.title, '/workshops/beginner');
              }}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              Go to Beginner AI Workshop
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (enrollmentSuccess) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to the Beginner AI Workshop!</h1>
            <p className="text-gray-700 mb-6">
              You've successfully enrolled in our free beginner workshop. Check your email for workshop details and access instructions.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">Workshop Access: Free</p>
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
            Start your AI journey with our comprehensive beginner workshop. Perfect for those with zero technical background who want to understand and use AI effectively.
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
                  <p className="text-gray-700">Absolute Beginner</p>
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
                This workshop is designed for complete beginners with no prior technical knowledge. 
                You'll learn the fundamentals of AI, how to use AI tools effectively, and understand 
                the AI revolution happening around us.
              </p>
            </div>

            {/* Curriculum */}
            <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
              <h2 className="text-2xl font-bold text-blue-600 mb-6">Curriculum</h2>
              <div className="space-y-6">
                {beginnerTopics.map((topic, index) => (
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
              {/* Enrollment Card - Only show if not enrolled */}
              {!isEnrolled && (
                <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl mb-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">🦋</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Free Workshop</h3>
                    <div className="3xl font-bold text-green-600 mb-2">₹0</div>
                    <p className="text-gray-600 text-sm">No payment required</p>
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
                  >
                    {isEnrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
                  </button>

                  <div className="mt-6 text-sm text-gray-600">
                    <p className="mb-2">✓ Instant access</p>
                    <p className="mb-2">✓ Lifetime access</p>
                    <p className="mb-2">✓ Certificate included</p>
                    <p>✓ No hidden fees</p>
                  </div>
                </div>
              )}

              {/* Enrolled Status Card - Show if enrolled */}
              {isEnrolled && (
                <div className="bg-white/70 border border-green-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl mb-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">You're Enrolled!</h3>
                    <div className="text-green-600 font-semibold mb-2">Workshop Access: Active</div>
                    <p className="text-gray-600 text-sm">Start learning anytime</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-semibold">✓ Already Enrolled</p>
                    <p className="text-green-700 text-sm mt-1">Check your email for access details</p>
                  </div>

                  <Link
                    to="/workshops"
                    className="w-full bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg shadow transition block text-center"
                  >
                    Back to Workshops
                  </Link>
                </div>
              )}

              {/* What You'll Learn */}
              <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-6 backdrop-blur-2xl">
                <h3 className="text-lg font-bold text-blue-600 mb-4">What You'll Learn</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Understand AI fundamentals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Use AI tools effectively</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Write better prompts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Apply AI in daily life</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Start AI projects</span>
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

export default BeginnerWorkshop; 