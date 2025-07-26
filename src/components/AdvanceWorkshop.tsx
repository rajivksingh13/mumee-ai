import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl, API_CONFIG } from '../config/api';

const advanceTopics = [
  {
    topic: 'GenAI Fundamentals Refresher',
    hours: 0.5,
    subTopics: [
      'AI, ML, Deep Learning, GenAI Recap',
      'Prompt Engineering (Advanced)',
      'Responsible AI & Ethics',
    ],
  },
  {
    topic: 'Retrieval Augmented Generation (RAG)',
    hours: 1.0,
    subTopics: [
      'What is RAG?',
      'RAG Architecture & Flow',
      'Applications of RAG',
      'Building RAG Pipelines',
    ],
  },
  {
    topic: 'Vector Databases & Embeddings',
    hours: 1.0,
    subTopics: [
      'What are Embeddings?',
      'Popular Vector DBs (Pinecone, Weaviate, FAISS, Chroma)',
      'Storing & Querying Vectors',
      'Semantic Search',
    ],
  },
  {
    topic: 'Model Customization & Fine-Tuning',
    hours: 1.0,
    subTopics: [
      'Fine-Tuning vs Prompt Engineering',
      'Fine-Tuning LLMs (OpenAI, HuggingFace, Google, etc.)',
      'LoRA, QLoRA, PEFT',
      'Data Preparation for Fine-Tuning',
    ],
  },
  {
    topic: 'Model Training & Evaluation',
    hours: 1.0,
    subTopics: [
      'Training Custom Models',
      'Transfer Learning',
      'Evaluation Metrics',
      'Experiment Tracking',
    ],
  },
  {
    topic: 'Advanced GenAI Applications',
    hours: 1.0,
    subTopics: [
      'A2A (Agent-to-Agent) Workflows',
      'OCR (Optical Character Recognition) with AI',
      'Foundation Models (FM)',
      'Custom Model Deployment',
    ],
  },
  {
    topic: 'Capstone Project & Real-World Use Cases',
    hours: 1.0,
    subTopics: [
      'Capstone Project: End-to-End GenAI Solution',
      'Department-wise Use Cases (HR, Finance, Marketing, etc.)',
      'Best Practices for Production',
      'Scaling & Monitoring',
    ],
  },
];

const totalHours = advanceTopics.reduce((sum, t) => sum + t.hours, 0);

const WORKSHOP_ID = 'advance';
const WORKSHOP_TITLE = 'AI Workshop – Advance Level';
const WORKSHOP_PRICE = 1999;

const AdvanceWorkshop: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setSuccess] = useState<string | null>(null);

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
            // Send enrollment email via backend
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
            setSuccess('Payment successful! You are enrolled in the Advance Workshop.');
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
      navigate('/login?redirect=/workshops/advance');
    } else {
      setShowPayment(true);
    }
  };

  const isEnrolled = localStorage.getItem(`enrolled_${WORKSHOP_ID}`) === 'true';

  if (enrollmentSuccess) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to the Advance AI Workshop!</h1>
            <p className="text-gray-700 mb-6">
              You've successfully enrolled in our Advance workshop. Check your email for workshop details and access instructions.
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
            Master advanced GenAI concepts and tools. Build, fine-tune, and deploy real-world AI solutions with industry best practices.
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
                  <p className="text-gray-700">Advanced</p>
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
                This workshop is for professionals and enthusiasts ready to take their GenAI skills to the next level. You'll work on real-world projects and learn advanced techniques used in the industry.
              </p>
            </div>
            {/* Curriculum */}
            <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
              <h2 className="text-2xl font-bold text-blue-600 mb-6">Curriculum</h2>
              <div className="space-y-6">
                {advanceTopics.map((topic, index) => (
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
                {isEnrolled ? (
                  <div className="text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 font-semibold">✓ Already Enrolled</p>
                    </div>
                    <Link
                      to="/workshops"
                      className="w-full bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
                    >
                      Back to Workshops
                    </Link>
                  </div>
                ) : !showPayment ? (
                  <button
                    onClick={handleEnrollClick}
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
                  >
                    Enroll Now (₹{WORKSHOP_PRICE})
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
                    <span className="text-gray-700">Build RAG & Vector DB Solutions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Fine-tune & Deploy Custom Models</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Work with Embeddings & Semantic Search</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Implement A2A, OCR, FM, and more</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Capstone Project & Real-World Use Cases</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Production Best Practices</span>
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

export default AdvanceWorkshop; 