import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { databaseService, Workshop } from '../services/databaseService';
import { enrollmentService, EnrollmentStatus } from '../services/enrollmentService';
import { paymentService } from '../services/paymentService';
import { useGeolocation } from '../hooks/useGeolocation';
import { getWorkshopPricing } from '../utils/currencyUtils';
import { buildApiUrl, API_CONFIG } from '../config/api';

const AdvanceWorkshop: React.FC = () => {
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
  const { countryCode, loading: locationLoading } = useGeolocation();
  
  // Get workshop ID from the workshop data
  const workshopId = workshop?.id || 'advanced-workshop';
  const WORKSHOP_SLUG = 'advanced';

  // Get pricing based on user location
  const pricing = locationLoading || !countryCode 
    ? { amount: 5999, currency: 'INR', symbol: '₹', formattedPrice: '₹5,999' } // Default to INR while loading
    : getWorkshopPricing('advanced', countryCode);

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
      // For paid workshops, NEVER show success page without payment
      // Only show the main workshop page with "Enroll Now" button
      setHasAutoEnrolled(true);
      // Clear the URL parameter to prevent showing welcome page again
      window.history.replaceState({}, document.title, '/workshops/advance');
    }
  }, [user, searchParams, workshop, hasAutoEnrolled]);

  const handleEnroll = async () => {
    console.log('🎯 Enroll button clicked');
    
    if (!user) {
      console.log('❌ No user found, redirecting to login');
      navigate('/login?redirect=/workshops/advance');
      return;
    }

    if (!workshop) {
      console.log('❌ No workshop data found');
      setError('Workshop data not available');
      return;
    }

    try {
      setIsEnrolling(true);
      setError(null);
      
      console.log('💰 Processing payment for workshop:', workshop.title);
      console.log('💰 Pricing:', pricing);
      
      // Get user location data
      const userLocation = locationLoading ? undefined : {
        countryCode: countryCode || 'IN',
        countryName: 'India', // Default for now
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      // Process payment first
      const paymentResult = await paymentService.processPayment({
        amount: pricing.amount,
        currency: pricing.currency,
        courseId: workshop.id,
        courseTitle: workshop.title,
        userName: user.displayName || 'User',
        userEmail: user.email || '',
        userId: user.uid,
        userCountryCode: countryCode || 'IN',
        userLocation: userLocation
      });
      
      if (paymentResult.success) {
        console.log('✅ Payment successful, enrolling user');
        
        // Enroll user in the workshop
        await enrollmentService.enrollUser(user.uid, workshop.id, workshop, {
          amount: pricing.amount,
          currency: pricing.currency,
          status: 'completed',
          paymentMethod: 'razorpay',
          paymentId: paymentResult.paymentId,
          orderId: paymentResult.orderId,
          userLocation: userLocation
        });
        
        console.log('✅ Enrollment successful');
        
        // Send enrollment email via backend
        try {
          console.log('📧 Sending enrollment email...');
          const emailResponse = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.EMAIL.ENROLLMENT), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user?.email || '',
              courseTitle: workshop?.title || 'Advanced AI Workshop',
              coursePrice: workshop?.price || 0,
              paymentId: paymentResult.paymentId || 'PAID_ENROLLMENT',
              orderId: paymentResult.orderId || `paid_${Date.now()}`,
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
        
        setEnrollmentSuccess(true);
        
        // Update enrollment status
        const status = await enrollmentService.getEnrollmentStatus(user.uid, workshop.id);
        setEnrollmentStatus(status);
      } else {
        console.log('❌ Payment failed:', paymentResult.error);
        setError(paymentResult.error || 'Payment failed. Please try again.');
      }
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

  if (enrollmentSuccess) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/70 border border-green-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Enrollment Successful!</h1>
            <p className="text-gray-700 mb-6">
              You've successfully enrolled in the Advanced AI Workshop. Check your email for workshop details and access instructions.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">Workshop Access: Paid</p>
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
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb Navigation */}
            <div className="mb-6">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                      Home
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-4 text-gray-900 font-medium">Advanced AI Workshop</span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>

            {/* Course Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Premium Course
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {workshop?.title || 'Advanced AI Workshop'}
                </h1>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {workshop?.description || 'Master advanced AI concepts with our expert-level workshop covering cutting-edge techniques, research applications, and industry projects.'}
                </p>
                
                {/* Enrollment Stats */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-6">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-600 font-medium">1,847+ learners enrolled</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">{workshop?.duration || 16} hours</span>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">Advanced Level</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">Workshop</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">Certificate Included</span>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="flex items-center mb-6">
                  {/* <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    AI
                  </div> */}
                  {/* <div>
                    <p className="text-sm text-gray-500">Taught by</p>
                    <p className="font-semibold text-gray-900">titliAI Expert Team</p>
                  </div> */}
                </div>
              </div>

              {/* Enrollment Card */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sticky top-8">
                  {!enrollmentStatus.isEnrolled ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-purple-600 mb-2">
                          {pricing.formattedPrice}
                        </div>
                        <div className="text-gray-600">One-time payment</div>
                      </div>
                      <button
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                      {/* <p className="text-sm text-gray-500 mt-3 text-center">
                        Get instant access to all workshop materials
                      </p> */}
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-green-800">Successfully Enrolled!</h3>
                      </div>
                      <p className="text-green-700 mb-4">You're all set to start your AI journey.</p>
                      <button 
                        onClick={handleJoinLiveSession}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition flex items-center justify-center mx-auto"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Join Live Session
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
                </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Course Overview */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  This advanced workshop is designed for experienced professionals who want to master cutting-edge AI techniques, research methodologies, and industry applications. 
                  You'll learn advanced AI concepts, build sophisticated models, and explore real-world AI applications. 
                  Perfect for those looking to become AI experts and lead AI initiatives.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
                    <p className="text-gray-600">{workshop?.duration || 2} hours</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Level</h3>
                    <p className="text-gray-600">Perfect for advanced learners</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Format</h3>
                    <p className="text-gray-600">Workshop</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Certificate</h3>
                    <p className="text-gray-600">Certificate upon completion</p>
                  </div>
                </div>
              </div>

              {/* What You'll Learn */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Master cutting-edge AI research techniques</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Build production-ready AI systems</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Implement advanced neural networks</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Lead AI research and development</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Deploy AI models at scale</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Understand AI ethics and governance</span>
                  </div>
                </div>
              </div>

              {/* Skills You'll Gain */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills You'll Gain</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">AI Research & Development</h3>
                    <p className="text-purple-700 text-sm">Lead cutting-edge AI research and development projects</p>
                  </div>
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <h3 className="font-semibold text-pink-900 mb-2">Production AI Systems</h3>
                    <p className="text-pink-700 text-sm">Build and deploy production-ready AI systems</p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h3 className="font-semibold text-indigo-900 mb-2">Advanced Neural Networks</h3>
                    <p className="text-indigo-700 text-sm">Design and implement complex neural network architectures</p>
                  </div>
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                    <h3 className="font-semibold text-violet-900 mb-2">AI Leadership</h3>
                    <p className="text-violet-700 text-sm">Lead AI teams and strategic AI initiatives</p>
                  </div>
                </div>
              </div>

              {/* Who Should Enroll */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Who Should Enroll?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-purple-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">AI Professionals</h3>
                      <p className="text-gray-600 text-sm">Experienced AI professionals looking to advance their expertise.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-pink-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Research Scientists</h3>
                      <p className="text-gray-600 text-sm">Research scientists wanting to lead AI research initiatives.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-indigo-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Tech Leaders</h3>
                      <p className="text-gray-600 text-sm">Technology leaders wanting to implement AI at scale.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-violet-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">AI Entrepreneurs</h3>
                      <p className="text-gray-600 text-sm">Entrepreneurs building AI-powered products and services.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Outline */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Outline</h2>
                
                {workshop?.curriculum?.modules ? (
                  <div className="space-y-4">
                    {workshop.curriculum.modules.map((module, index) => (
                      <div key={module.id || index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                              </span>
                              <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                            </div>
                            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                              {module.duration} hour{module.duration !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 mb-4">{module.description}</p>
                          {module.lessons && (
                            <ul className="space-y-2">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <li key={lesson.id || lessonIndex} className="flex items-center text-gray-700">
                                  <svg className="w-4 h-4 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                  <span>{lesson.title}</span>
                                  <span className="ml-auto text-sm text-gray-500">({lesson.duration} min)</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : Array.isArray(workshop?.curriculum) ? (
                  // Fallback for old curriculum structure
                  <div className="space-y-4">
                    {workshop.curriculum.map((topic: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                              </span>
                              <h3 className="text-lg font-semibold text-gray-900">{topic.topic}</h3>
                            </div>
                            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                              {topic.hours} hour{topic.hours !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <ul className="space-y-2">
                            {topic.subTopics.map((subTopic: string, subIndex: number) => (
                              <li key={subIndex} className="flex items-center text-gray-700">
                                <svg className="w-4 h-4 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span>{subTopic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Curriculum details are being loaded...</p>
                  </div>
                )}
              </div>

              {/* Course Format */}
              {/* <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Format</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-purple-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Duration</h3>
                      <p className="text-gray-600 text-sm">{workshop?.duration || 16} hours (self-paced)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-pink-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Materials</h3>
                      <p className="text-gray-600 text-sm">Video content, interactive exercises, and projects</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-indigo-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Access</h3>
                      <p className="text-gray-600 text-sm">Lifetime access to course materials</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-violet-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Certificate</h3>
                      <p className="text-gray-600 text-sm">Certificate upon completion</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Meet Your Instructors */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Meet Your Instructors</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                        AI
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">titliAI Expert Team</h4>
                        <p className="text-sm text-gray-600">AI Research Specialists & Industry Experts</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Our team of AI research specialists brings years of experience in cutting-edge AI research, 
                          production deployments, and industry leadership. We're passionate about advancing AI technology.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Features */}
                {/* <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">This course includes</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">16 hours on-demand video</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Downloadable resources</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Certificate of completion</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Full lifetime access</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Interactive exercises</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Expert mentorship</span>
                    </li>
                  </ul>
                </div> */}

                {/* Requirements */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">Advanced understanding of AI concepts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">Strong programming skills</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">Experience with machine learning</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">Desire to lead AI initiatives</span>
                    </li>
                  </ul>
                </div>

                {/* Why Choose This Course */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Why Choose This Course?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-purple-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Cutting-edge AI research techniques</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Production-ready AI systems</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Expert guidance throughout</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-violet-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Industry-leading applications</span>
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

export default AdvanceWorkshop; 