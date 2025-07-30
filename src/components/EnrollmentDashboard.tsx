import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { enrollmentService } from '../services/enrollmentService';
import { databaseService, Workshop, Enrollment } from '../services/databaseService';

interface EnrollmentWithWorkshop extends Enrollment {
  workshop: Workshop;
}

const EnrollmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentWithWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState({
    totalEnrollments: 0,
    completedWorkshops: 0,
    certificatesEarned: 0,
    averageProgress: 0,
    recentEnrollments: [] as Enrollment[]
  });

  useEffect(() => {
    const loadEnrollments = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Get user enrollments
        const userEnrollments = await enrollmentService.getUserEnrollments(user.uid);
        
        // Get workshop data for each enrollment
        const enrollmentsWithWorkshops = await Promise.all(
          userEnrollments.map(async (enrollment) => {
            const workshop = await databaseService.getWorkshop(enrollment.workshopId);
            return {
              ...enrollment,
              workshop: workshop || {} as Workshop
            };
          })
        );

        setEnrollments(enrollmentsWithWorkshops);

        // Get analytics
        const userAnalytics = await enrollmentService.getEnrollmentAnalytics(user.uid);
        setAnalytics(userAnalytics);

      } catch (error) {
        console.error('Error loading enrollments:', error);
        setError('Failed to load enrollments');
      } finally {
        setLoading(false);
      }
    };

    loadEnrollments();
  }, [user]);

  const getWorkshopLink = (workshopId: string) => {
    const workshopMap: { [key: string]: string } = {
      'beginner-workshop': '/workshops/beginner',
      'foundation-workshop': '/workshops/foundation',
      'advanced-workshop': '/workshops/advanced'
    };
    return workshopMap[workshopId] || '/workshops';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading your enrollments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white/70 border border-red-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Enrollments</h1>
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

  return (
    <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
            My Learning Dashboard
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Track your progress, manage enrollments, and continue your AI learning journey
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-6 backdrop-blur-2xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.totalEnrollments}</div>
            <div className="text-gray-600">Total Enrollments</div>
          </div>
          <div className="bg-white/70 border border-green-100 rounded-2xl shadow-2xl p-6 backdrop-blur-2xl">
            <div className="text-3xl font-bold text-green-600 mb-2">{analytics.completedWorkshops}</div>
            <div className="text-gray-600">Completed Workshops</div>
          </div>
          <div className="bg-white/70 border border-purple-100 rounded-2xl shadow-2xl p-6 backdrop-blur-2xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.certificatesEarned}</div>
            <div className="text-gray-600">Certificates Earned</div>
          </div>
          <div className="bg-white/70 border border-yellow-100 rounded-2xl shadow-2xl p-6 backdrop-blur-2xl">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{Math.round(analytics.averageProgress)}%</div>
            <div className="text-gray-600">Average Progress</div>
          </div>
        </div>

        {/* Enrollments */}
        <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">My Enrollments</h2>
          
          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">No Enrollments Yet</h3>
              <p className="text-gray-600 mb-6">
                Start your AI learning journey by enrolling in our workshops
              </p>
              <Link
                to="/workshops"
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
              >
                Browse Workshops
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {enrollment.workshop.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {enrollment.workshop.description}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(enrollment.status)}`}>
                          {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-500">
                            {enrollment.progress.percentageComplete}% Complete
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(enrollment.progress.percentageComplete)}`}
                            style={{ width: `${enrollment.progress.percentageComplete}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Module {enrollment.progress.currentModule} of {enrollment.progress.totalModules}
                        </div>
                      </div>

                      {/* Enrollment Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Enrolled:</span>
                          <div className="font-medium">
                            {enrollment.enrolledAt.toDate().toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Payment:</span>
                          <div className="font-medium">
                            ₹{enrollment.payment.amount} ({enrollment.payment.paymentMethod})
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <div className="font-medium">
                            {enrollment.workshop.duration} hours
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Accessed:</span>
                          <div className="font-medium">
                            {enrollment.progress.lastAccessed.toDate().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:ml-6">
                      <Link
                        to={getWorkshopLink(enrollment.workshopId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition text-center"
                      >
                        Continue Learning
                      </Link>
                      {enrollment.status === 'active' && (
                        <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition">
                          View Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {analytics.recentEnrollments.length > 0 && (
          <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-2xl p-8 backdrop-blur-2xl mt-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {analytics.recentEnrollments.slice(0, 5).map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      Enrolled in workshop
                    </div>
                    <div className="text-sm text-gray-500">
                      {enrollment.enrolledAt.toDate().toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                    {enrollment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentDashboard;