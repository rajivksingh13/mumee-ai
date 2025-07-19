import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../../config/firebase';

interface AnalyticsData {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  courseEnrollments: Record<string, number>;
  userGrowth: Record<string, number>;
  revenueByMonth: Record<string, number>;
}

export default function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    courseEnrollments: {},
    userGrowth: {},
    revenueByMonth: {}
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch users
        const usersRef = ref(database, 'users');
        const usersSnapshot = await get(usersRef);
        const totalUsers = usersSnapshot.exists() ? Object.keys(usersSnapshot.val()).length : 0;

        // Fetch courses
        const coursesRef = ref(database, 'courses');
        const coursesSnapshot = await get(coursesRef);
        const totalCourses = coursesSnapshot.exists() ? Object.keys(coursesSnapshot.val()).length : 0;

        // Fetch enrollments
        const enrollmentsRef = ref(database, 'enrollments');
        const enrollmentsSnapshot = await get(enrollmentsRef);
        let totalEnrollments = 0;
        let courseEnrollments: Record<string, number> = {};
        let totalRevenue = 0;

        if (enrollmentsSnapshot.exists()) {
          const enrollmentsData = enrollmentsSnapshot.val();
          Object.values(enrollmentsData).forEach((userEnrollments: any) => {
            Object.entries(userEnrollments).forEach(([courseId, enrollment]: [string, any]) => {
              totalEnrollments++;
              courseEnrollments[courseId] = (courseEnrollments[courseId] || 0) + 1;
              totalRevenue += enrollment.price || 0;
            });
          });
        }

        // Simulate user growth and revenue data (in a real app, this would come from your database)
        const userGrowth: Record<string, number> = {
          'Jan': 100,
          'Feb': 150,
          'Mar': 200,
          'Apr': 250,
          'May': 300,
          'Jun': 350
        };

        const revenueByMonth: Record<string, number> = {
          'Jan': 10000,
          'Feb': 15000,
          'Mar': 20000,
          'Apr': 25000,
          'May': 30000,
          'Jun': 35000
        };

        setAnalytics({
          totalUsers,
          totalCourses,
          totalEnrollments,
          totalRevenue,
          courseEnrollments,
          userGrowth,
          revenueByMonth
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-white">{analytics.totalUsers}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-white">{analytics.totalCourses}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-2">Total Enrollments</h3>
            <p className="text-3xl font-bold text-white">{analytics.totalEnrollments}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-white">₹{analytics.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">User Growth</h3>
          <div className="h-64 flex items-end space-x-2">
            {Object.entries(analytics.userGrowth).map(([month, count]) => (
              <div key={month} className="flex-1">
                <div
                  className="bg-indigo-500 rounded-t"
                  style={{ height: `${(count / Math.max(...Object.values(analytics.userGrowth))) * 100}%` }}
                ></div>
                <div className="text-center text-gray-400 text-sm mt-2">{month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Monthly Revenue</h3>
          <div className="h-64 flex items-end space-x-2">
            {Object.entries(analytics.revenueByMonth).map(([month, amount]) => (
              <div key={month} className="flex-1">
                <div
                  className="bg-green-500 rounded-t"
                  style={{ height: `${(amount / Math.max(...Object.values(analytics.revenueByMonth))) * 100}%` }}
                ></div>
                <div className="text-center text-gray-400 text-sm mt-2">{month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Popularity */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Course Popularity</h3>
          <div className="space-y-4">
            {Object.entries(analytics.courseEnrollments).map(([courseId, count]) => (
              <div key={courseId} className="flex items-center">
                <div className="flex-1 bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-indigo-500 h-4 rounded-full"
                    style={{ width: `${(count / analytics.totalEnrollments) * 100}%` }}
                  ></div>
                </div>
                <div className="ml-4 text-white">Course {courseId}: {count} enrollments</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 