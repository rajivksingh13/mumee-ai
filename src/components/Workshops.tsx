import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { enrollmentService } from '../services/enrollmentService';
import { useGeolocation } from '../hooks/useGeolocation';
import { getWorkshopPricing } from '../utils/currencyUtils';


// Workshop configuration with Firestore IDs
const workshopConfigs = [
  {
    title: 'Gen AI Workshop - Absolute Beginner',
    description:
      'Start your AI journey from scratch! Perfect for complete beginners with zero technical background. Learn the fundamentals of Generative AI, how to use AI tools effectively, and understand the AI revolution happening around us.',
    cta: 'Explore Beginner Workshop',
    level: 'beginner',
    link: '/workshops/beginner',
    workshopId: 'beginner-workshop', // Firestore workshop ID
  },
  {
    title: 'Gen AI Workshop - Foundation Level',
    description:
      'Kickstart your AI journey! Learn the basics of Artificial Intelligence, Machine Learning, and Data Science. No prior experience required. Perfect for students, beginners, and professionals looking to build a strong foundation.',
    cta: 'Explore Foundation Workshop',
    level: 'foundation',
    link: '/workshops/foundation',
    workshopId: 'foundation-workshop', // Firestore workshop ID
  },
  {
    title: 'Gen AI Workshop - Advance',
    description:
      'Take your AI skills to the next level! Dive deep into advanced machine learning, neural networks, GenAI, and real-world AI projects. Ideal for those with prior experience or who have completed the foundation workshop.',
    cta: 'Explore Advance Workshop',
    level: 'advanced',
    link: '/workshops/advance',
    workshopId: 'advanced-workshop', // Firestore workshop ID
  },
];

const Workshops: React.FC = () => {
  const { user } = useAuth();
  const [enrolledWorkshops, setEnrolledWorkshops] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  
  // Get user location for pricing (works for both logged-in and non-logged-in users)
  const { countryCode, loading: locationLoading, location } = useGeolocation();
  
  // Debug logging
  console.log('🔍 Workshops - Geolocation Debug:', {
    countryCode,
    locationLoading,
    location,
    isIndianUser: countryCode === 'IN'
  });

  // Check which workshops the user is enrolled in from Firestore
  useEffect(() => {
    const checkEnrollments = async () => {
      if (user) {
        try {
          setLoading(true);
          const enrolled = new Set<string>();
          
          // Check each workshop enrollment status
          for (const ws of workshopConfigs) {
            const isEnrolled = await enrollmentService.isUserEnrolled(user.uid, ws.workshopId);
            if (isEnrolled) {
              enrolled.add(ws.level);
            }
          }
          
          setEnrolledWorkshops(enrolled);
        } catch (error) {
          console.error('Error checking enrollments:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkEnrollments();
  }, [user]);

  // Helper function to get pricing with better loading state
  const getPricingDisplay = (level: 'beginner' | 'foundation' | 'advanced') => {
    // For beginner workshop, always show Free regardless of location
    if (level === 'beginner') {
      return {
        formattedPrice: 'Free',
        currency: 'FREE',
        paymentType: 'Free Workshop'
      };
    }

    // If location is still loading, show a better loading state
    if (locationLoading || !countryCode) {
      return {
        formattedPrice: 'Loading...',
        currency: 'LOADING',
        paymentType: 'One-time payment'
      };
    }

    // Get actual pricing based on detected location
    const pricing = getWorkshopPricing(level as 'beginner' | 'foundation' | 'advanced', countryCode);
    
    return {
      formattedPrice: pricing.formattedPrice,
      currency: pricing.currency,
      paymentType: 'One-time payment'
    };
  };

  // Show a better loading state for the entire page if location is still loading
  const showLocationLoading = locationLoading && !countryCode;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading workshops...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">Gen-AI Workshops</h1>
      <p className="text-gray-700 text-center mb-12 text-lg max-w-2xl mx-auto">
        Join our hands-on Gen-AI workshops designed for all levels. Whether you're just starting or looking to master advanced AI concepts, we have the right workshop for you.
      </p>
      
      {/* Show location loading indicator */}
      {showLocationLoading && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm">Detecting your location for accurate pricing...</span>
          </div>
        </div>
      )}

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {workshopConfigs.map((ws) => {
           const isEnrolled = enrolledWorkshops.has(ws.level);
           const pricing = getPricingDisplay(ws.level as 'beginner' | 'foundation' | 'advanced');
           
           // Debug pricing calculation
           if (!locationLoading && countryCode) {
             console.log(`💰 ${ws.level} Workshop Pricing Debug:`, {
               level: ws.level,
               countryCode,
               pricing,
               isIndianUser: countryCode === 'IN'
             });
           }
           
           return (
             <div
               key={ws.level}
               className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center transition backdrop-blur-2xl relative group hover:shadow-blue-300/40 hover:scale-105"
             >
               <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:ring-4 group-hover:ring-blue-200/40 transition" />
               
               {/* Enrollment Status Badge */}
               {isEnrolled && (
                 <div className="absolute top-4 right-4 z-20">
                   <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                     ✓ Enrolled
                   </div>
                 </div>
               )}
               
               <h2 className="text-2xl font-bold text-blue-600 mb-4 z-10 relative">{ws.title}</h2>
               <p className="text-gray-700 mb-6 z-10 relative">{ws.description}</p>
               
               {/* Pricing */}
               <div className="mb-6 z-10 relative">
                 <div className={`text-2xl font-bold ${
                   pricing.currency === 'LOADING' 
                     ? 'text-gray-500 animate-pulse' 
                     : pricing.currency === 'FREE' 
                       ? 'text-green-600' 
                       : 'text-green-600'
                 }`}>
                   {pricing.formattedPrice}
                 </div>
                 <div className="text-sm text-gray-500">
                   {pricing.paymentType}
                 </div>
               </div>
               <Link
                 to={ws.link}
                 className={`mt-auto font-semibold px-6 py-3 rounded-lg shadow transition z-10 relative ${
                   isEnrolled 
                     ? 'bg-green-500 hover:bg-green-600 text-white' 
                     : 'bg-blue-600 hover:bg-blue-700 text-white'
                 }`}
               >
                 {isEnrolled ? 'View Workshop' : 'Learn More'}
               </Link>
             </div>
           );
         })}
       </div>
    </div>
  </div>
  );
};

export default Workshops; 