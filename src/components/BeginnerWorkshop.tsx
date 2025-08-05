import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl, API_CONFIG } from '../config/api';
import { databaseService, Workshop } from '../services/databaseService';
import { enrollmentService, EnrollmentStatus } from '../services/enrollmentService';

import { useGeolocation } from '../hooks/useGeolocation';
import { getWorkshopPricing } from '../utils/currencyUtils';

const BeginnerWorkshop: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus>({
    isEnrolled: false,
    enrollment: null,
    progress: null,
    canAccess: false,
    isCompleted: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAutoEnrolled, setHasAutoEnrolled] = useState(false);
  const [showLiveSessionModal, setShowLiveSessionModal] = useState(false);
  const [liveSessionDetails, setLiveSessionDetails] = useState<{
    hasScheduledSession: boolean;
    date?: string;
    time?: string;
    timezone?: string;
  } | null>(null);
  
  // Get user location for pricing
  const { countryCode, isIndianUser, loading: locationLoading } = useGeolocation();
  
  // Get workshop ID from the workshop data
  const workshopId = workshop?.id || 'beginner-workshop';
  const WORKSHOP_SLUG = 'beginner';

  // Get pricing based on user location
  const pricing = locationLoading || !countryCode 
    ? { amount: 0, currency: 'INR', symbol: '₹', formattedPrice: 'Free' } // Default to Free while loading
    : getWorkshopPricing('beginner', countryCode);

  // Load workshop data and enrollment status from Firestore
  useEffect(() => {
    const loadWorkshopData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch workshop data from Firestore
        const workshopData = await databaseService.getWorkshopBySlug(WORKSHOP_SLUG);
        if (workshopData) {
          setWorkshop(workshopData);
        } else {
          setError('Workshop not found');
        }

        // Check enrollment status if user is logged in
        if (user) {
          const status = await enrollmentService.getEnrollmentStatus(user.uid, workshopId);
          setEnrollmentStatus(status);
        }
      } catch (error) {
        console.error('Error loading workshop data:', error);
        setError('Failed to load workshop data');
      } finally {
        setLoading(false);
      }
    };

    loadWorkshopData();
  }, [user, workshopId]);

  // Check for redirect parameter after login
  useEffect(() => {
    const fromRedirect = searchParams.get('fromRedirect');
    if (fromRedirect === 'true' && user && workshop && !hasAutoEnrolled) {
      // User just logged in and was redirected here
      // For free workshops, show success page
      setHasAutoEnrolled(true);
      // Clear the URL parameter to prevent showing welcome page again
      window.history.replaceState({}, document.title, '/workshops/beginner');
    }
  }, [user, searchParams, workshop, hasAutoEnrolled]);

  const handleEnroll = async () => {
    console.log('🎯 Enroll button clicked');
    
    if (!user) {
      console.log('❌ No user found, redirecting to login');
      navigate('/login?redirect=/workshops/beginner');
      return;
    }

    if (!workshop) {
      console.log('❌ Workshop data not available');
      setError('Workshop data not available');
      return;
    }

    // Check if already enrolled
    if (enrollmentStatus.isEnrolled) {
      console.log('❌ User already enrolled');
      setError('You are already enrolled in this workshop');
      return;
    }

    console.log('✅ Starting enrollment process for user:', user.uid);
    console.log('✅ Workshop data:', workshop);
    
    setIsEnrolling(true);
    
    try {
      console.log('✅ Enrolling user in free workshop...');
      
      // Get user location data
      const userLocation = await databaseService.getUserGeolocation(user.uid);
      
      // Enroll user using enrollment service (free workshop)
      await enrollmentService.enrollUser(user.uid, workshopId, workshop, {
        amount: 0,
        currency: 'INR',
        status: 'completed',
        paymentMethod: 'free',
        userLocation: userLocation || {
          countryCode: countryCode || 'IN',
          countryName: isIndianUser ? 'India' : 'International'
        }
      });
      
      console.log('✅ User enrolled successfully');
      
      // Send enrollment email via backend
      try {
        console.log('📧 Sending enrollment email...');
        const emailResponse = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.EMAIL.ENROLLMENT), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email || '',
            courseTitle: workshop?.title || 'Beginner AI Workshop',
            coursePrice: 0,
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
      
      // Update enrollment status
      const status = await enrollmentService.getEnrollmentStatus(user.uid, workshopId);
      setEnrollmentStatus(status);
      
      // Show success
      setEnrollmentSuccess(true);
      console.log('🎉 Enrollment process completed successfully');
      
    } catch (error) {
      console.error('❌ Enrollment failed:', error);
      setError(error instanceof Error ? error.message : 'Enrollment failed. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleJoinLiveSession = () => {
    const hasScheduledSession = workshop?.isLiveSession && workshop?.scheduledDate;
    
    if (hasScheduledSession && workshop?.meetingLink) {
      // Open live session link
      window.open(workshop.meetingLink, '_blank');
    } else {
      // Show professional modal
      setLiveSessionDetails({
        hasScheduledSession: !!hasScheduledSession,
        date: workshop?.scheduledDate,
        time: workshop?.scheduledTime,
        timezone: workshop?.timezone
      });
      setShowLiveSessionModal(true);
    }
  };

  const closeLiveSessionModal = () => {
    setShowLiveSessionModal(false);
    setLiveSessionDetails(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading workshop data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/70 border border-red-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Workshop</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Welcome success page after login redirect
  if (enrollmentSuccess) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/70 border border-green-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Enrollment Successful!</h1>
            <p className="text-gray-700 mb-6">
              You've successfully enrolled in the Beginner AI Workshop. Check your email for workshop details and access instructions.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">Workshop Access: Free</p>
              <p className="text-green-700">You can start learning immediately!</p>
            </div>
            <button
              onClick={() => {
                setEnrollmentSuccess(false);
              }}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              Start Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main workshop page
  return (
    <>
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              to="/workshops"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Workshops
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
              {workshop?.title || 'Beginner AI Workshop'}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {workshop?.description || 'Start your AI journey with our comprehensive beginner workshop covering fundamental concepts, practical applications, and hands-on projects.'}
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
                    <p className="text-gray-700">{workshop?.duration || 8} hours</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Level</h3>
                    <p className="text-gray-700">Beginner</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Format</h3>
                    <p className="text-gray-700">{workshop?.format || 'Online Self-Paced'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Certificate</h3>
                    <p className="text-gray-700">{workshop?.certificate ? 'Included' : 'Not Included'}</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  {workshop?.overview?.description || 'This workshop is perfect for beginners who want to understand AI fundamentals, machine learning basics, and practical applications.'}
                </p>
              </div>

              {/* Curriculum */}
              <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Curriculum</h2>
                
                {workshop?.curriculum?.modules ? (
                  <div className="space-y-6">
                    {workshop.curriculum.modules.map((module, index) => (
                      <div key={module.id || index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {module.duration} hour{module.duration !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{module.description}</p>
                        {module.lessons && (
                          <ul className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <li key={lesson.id || lessonIndex} className="flex items-start">
                                <span className="text-blue-500 mr-2 mt-1">•</span>
                                <span className="text-gray-700">{lesson.title} ({lesson.duration} min)</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : Array.isArray(workshop?.curriculum) ? (
                  // Fallback for old curriculum structure (simple topics array)
                  <div className="space-y-6">
                    {workshop.curriculum.map((topic: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{topic.topic}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {topic.hours} hour{topic.hours !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {topic.subTopics.map((subTopic: string, subIndex: number) => (
                            <li key={subIndex} className="flex items-start">
                              <span className="text-blue-500 mr-2 mt-1">•</span>
                              <span className="text-gray-700">{subTopic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Curriculum details are being loaded...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Enrollment Card - Only show if not enrolled */}
                {!enrollmentStatus.isEnrolled && (
                  <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-6 backdrop-blur-2xl mb-6">
                    <h3 className="text-xl font-bold text-blue-600 mb-4">Enroll Now</h3>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {pricing.formattedPrice}
                      </div>
                      <div className="text-gray-600">Free workshop</div>
                    </div>
                    <button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-semibold py-3 px-6 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      Get instant access to all workshop materials
                    </p>
                  </div>
                )}

                {/* Already Enrolled Card */}
                {enrollmentStatus.isEnrolled && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl shadow-2xl p-6 backdrop-blur-2xl mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-green-800">Successfully Enrolled!</h3>
                      </div>
                      <p className="text-green-700 mb-4">You're all set to start your AI journey with this workshop.</p>
                      <button 
                        onClick={handleJoinLiveSession}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition flex items-center justify-center mx-auto"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Join Live Session
                      </button>
                    </div>
                  </div>
                )}

                {/* Workshop Features */}
                <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-6 backdrop-blur-2xl">
                  <h3 className="text-xl font-bold text-blue-600 mb-4">What You'll Get</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">AI fundamentals and concepts</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">Hands-on practical projects</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">Certificate of completion</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">Lifetime access to materials</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">Community support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Session Modal */}
      {showLiveSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-xl font-bold text-white">Live Session Details</h2>
                </div>
                <button
                  onClick={closeLiveSessionModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {liveSessionDetails?.hasScheduledSession ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Session Scheduled</h3>
                    <p className="text-gray-600">Your live session is confirmed</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Date</p>
                        <p className="text-sm text-gray-600">{liveSessionDetails.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Time</p>
                        <p className="text-sm text-gray-600">{liveSessionDetails.time || 'TBD'}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Timezone</p>
                        <p className="text-sm text-gray-600">{liveSessionDetails.timezone || 'IST'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> You'll receive meeting details and access link via email before the session.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
                    <p className="text-gray-600">Live session details will be announced</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Date</p>
                        <p className="text-sm text-gray-600">Coming Soon</p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Time</p>
                        <p className="text-sm text-gray-600">TBD</p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Timezone</p>
                        <p className="text-sm text-gray-600">IST</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> You'll receive detailed schedule and meeting information via email once the session is confirmed.
                    </p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeLiveSessionModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BeginnerWorkshop; 