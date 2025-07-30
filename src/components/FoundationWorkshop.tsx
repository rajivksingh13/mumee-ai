import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl, API_CONFIG } from '../config/api';
import { databaseService, Workshop } from '../services/databaseService';
import { enrollmentService, EnrollmentStatus } from '../services/enrollmentService';
import { paymentService } from '../services/paymentService';

const FoundationWorkshop: React.FC = () => {
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

  // Get workshop ID from the workshop data
  const workshopId = workshop?.id || 'foundation-workshop';
  const WORKSHOP_SLUG = 'foundation';

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
      window.history.replaceState({}, document.title, '/workshops/foundation');
    }
  }, [user, searchParams, workshop, hasAutoEnrolled]);

  const handleEnroll = async () => {
    console.log('🎯 Enroll button clicked');
    
    if (!user) {
      console.log('❌ No user found, redirecting to login');
      navigate('/login?redirect=/workshops/foundation');
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
      console.log('💳 Processing payment through Razorpay...');
      
      // Process payment through Razorpay
      const paymentResult = await paymentService.processPayment({
        amount: workshop.price,
        currency: workshop.currency,
        courseId: workshopId,
        courseTitle: workshop.title,
        userName: user.displayName || 'User',
        userEmail: user.email || '',
        userId: user.uid,
      });

      console.log('📊 Payment result:', paymentResult);

      if (!paymentResult.success) {
        console.error('❌ Payment failed:', paymentResult.error);
        throw new Error(paymentResult.error || 'Payment failed');
      }

      console.log('✅ Payment successful, enrolling user...');

      // Enroll user using enrollment service with actual payment data
      await enrollmentService.enrollUser(user.uid, workshopId, workshop, {
        amount: workshop.price,
        currency: workshop.currency,
        status: 'completed',
        paymentMethod: 'razorpay',
        paymentId: paymentResult.paymentId,
        orderId: paymentResult.orderId,
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
            courseTitle: workshop?.title || 'Foundation AI Workshop',
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
              You've successfully enrolled in the Foundation AI Workshop. Check your email for workshop details and access instructions.
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
            {workshop?.title || 'Foundation AI Workshop'}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {workshop?.description || 'Build a solid foundation in AI with our intermediate workshop covering advanced concepts, algorithms, and real-world applications.'}
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
                  <p className="text-gray-700">{workshop?.duration || 12} hours</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Level</h3>
                  <p className="text-gray-700">Intermediate</p>
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
                {workshop?.overview?.description || 'This workshop builds upon the beginner concepts and dives deeper into AI algorithms, machine learning techniques, and practical applications. Perfect for those who want to understand the technical aspects of AI.'}
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
                    <div className="text-3xl font-bold text-green-600 mb-2">₹{workshop?.price || 999}</div>
                    <div className="text-gray-600">One-time payment</div>
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
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-green-600 mb-2">Already Enrolled</h3>
                    <p className="text-green-700 mb-4">You have access to this workshop</p>
                    {enrollmentStatus.progress && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-1">Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollmentStatus.progress.percentageComplete}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {enrollmentStatus.progress.percentageComplete}% Complete
                        </div>
                      </div>
                    )}
                    <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                      Continue Learning
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
                    <span className="text-gray-700">Advanced AI concepts and algorithms</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">Hands-on machine learning projects</span>
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
                    <span className="text-gray-700">Expert support and guidance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundationWorkshop; 