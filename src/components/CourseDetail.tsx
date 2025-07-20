import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, database } from '../config/firebase';
import { ref, get, set } from 'firebase/database';
// Removed import - will use backend API instead

interface Course {
  id?: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: number;
  category: string;
  thumbnail: string;
  curriculum: string[];
  prerequisites: string[];
  whatYouWillLearn: string[];
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) {
          console.log('No courseId found in URL');
          setError('Course ID not found');
          setLoading(false);
          return;
        }

        console.log('Fetching course with ID:', courseId);
        const courseRef = ref(database, `courses/${courseId}`);
        const snapshot = await get(courseRef);
        
        console.log('Firebase response:', snapshot.val());
        
        if (snapshot.exists()) {
          const courseData = snapshot.val();
          console.log('Course data found:', courseData);
          setCourse({
            id: courseId,
            ...courseData
          });
        } else {
          console.log('No course found with ID:', courseId);
          setError('Course not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to fetch course details');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handlePayment = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login', { state: { from: 'payment', courseId } });
      return;
    }

    if (!course) {
      setError('Course details not available');
      return;
    }

    // Debug: Log environment variables
    console.log('Environment variables:', {
      VITE_RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID,
      NODE_ENV: import.meta.env.NODE_ENV
    });

    try {
      // Check if Razorpay is loaded
      if (!(window as any).Razorpay) {
        throw new Error('Razorpay script not loaded');
      }

      // Check if API key is available
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay API key not configured');
      }

      console.log('Creating payment order...');
      // Create order on your backend and get order_id
      const orderResponse = await fetch('https://mumee-ai-backend.onrender.com/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: course.price * 100,
          currency: 'INR',
          courseId: course.id
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();
      console.log('Order created:', orderData);

      // Initialize Razorpay
      const options = {
        key: razorpayKey,
        amount: course.price * 100,
        currency: 'INR',
        name: 'mumeeAI',
        description: `Payment for ${course.title}`,
        image: '/mumeeAI.svg',
        order_id: orderData.id,
        theme: {
          color: '#4F46E5'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
          }
        },
        prefill: {
          name: user.displayName || '',
          email: user.email || '',
          contact: user.phoneNumber || ''
        },
        handler: async function(response: any) {
          try {
            console.log('Payment response:', response);
            
            // Verify payment with your backend
            const verifyResponse = await fetch('https://mumee-ai-backend.onrender.com/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course.id,
                userId: user.uid
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();

            // Create enrollment record
            const enrollmentRef = ref(database, `enrollments/${user.uid}/${course.id}`);
            const enrollmentData = {
              courseId: course.id,
              timestamp: Date.now(),
              status: 'active',
              paymentId: verifyData.paymentId || response.razorpay_payment_id,
              orderId: verifyData.orderId || response.razorpay_order_id
            };
            await set(enrollmentRef, enrollmentData);

            // Send enrollment email via backend
            try {
              console.log('Sending enrollment email...');
              const emailResponse = await fetch('https://mumee-ai-backend.onrender.com/api/email/enrollment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: user.email || '',
                  courseTitle: course.title,
                  coursePrice: course.price,
                  paymentId: verifyData.paymentId || response.razorpay_payment_id,
                  orderId: verifyData.orderId || response.razorpay_order_id,
                  userName: user.displayName || 'User'
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

            // Show success message and redirect
            setSuccess('Payment successful! You have been enrolled in the course.');
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } catch (err) {
            console.error('Error after payment:', err);
            setError('Failed to complete enrollment. Please contact support.');
          }
        }
      };

      console.log('Opening Razorpay modal with options:', options);
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize payment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading course details...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error || 'Course not found'}</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="ml-4 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">mumeeAI</div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </nav>

      {/* Course Content */}
      <div className="container mx-auto px-6 py-8">
        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-300">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Course Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6 mb-8"
            >
              <div className="text-6xl mb-4">{course.thumbnail}</div>
              <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-gray-300 mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-sm">
                  {course.level}
                </span>
                <span className="text-gray-400">{course.duration}</span>
                <span className="text-gray-400">{course.category}</span>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">What You'll Learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-400 mr-2">✓</span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Curriculum</h2>
                <div className="space-y-3">
                  {course.curriculum.map((item, index) => (
                    <div key={index} className="flex items-center bg-gray-700/50 p-3 rounded-lg">
                      <span className="text-gray-400 mr-3">{index + 1}</span>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Payment Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6 sticky top-8"
            >
              <div className="text-4xl mb-4">{course.thumbnail}</div>
              <h2 className="text-2xl font-bold text-white mb-4">{course.title}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Course Price</span>
                  <span className="text-2xl font-bold">₹{course.price}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Duration</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Level</span>
                  <span>{course.level}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Enroll Now - ₹{course.price}
              </button>

              <div className="mt-4 text-sm text-gray-400 text-center">
                <p>30-day money-back guarantee</p>
                <p>Lifetime access to course materials</p>
                <p>Certificate of completion</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 