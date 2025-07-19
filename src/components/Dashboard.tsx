import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, database } from '../config/firebase';
import { ref, get, remove } from 'firebase/database';
import { logout } from '../services/authService';

interface UserData {
  uid: string;
  email: string;
  displayName: string | null;
  accountType: 'individual' | 'business' | 'enterprise' | 'admin';
  createdAt: number;
  lastLogin: number;
}

interface Course {
  id: string;
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

interface MLModel {
  id: string;
  name: string;
  description: string;
  type: string;
  accuracy: number;
  status: string;
  lastUpdated: string;
}

interface Enrollment {
  courseId: string;
  token: string;
  timestamp: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>({});
  const [courses, setCourses] = useState<Course[]>([]);

  const [businessModels] = useState<MLModel[]>([
    {
      id: 'b1',
      name: 'Customer Segmentation',
      description: 'Segment customers based on behavior and demographics',
      type: 'Clustering',
      accuracy: 92.8,
      status: 'ready',
      lastUpdated: '2024-03-15'
    },
    {
      id: 'b2',
      name: 'Demand Forecasting',
      description: 'Predict product demand using historical data',
      type: 'Time Series',
      accuracy: 89.5,
      status: 'ready',
      lastUpdated: '2024-03-14'
    },
    {
      id: 'b3',
      name: 'Sentiment Analysis',
      description: 'Analyze customer feedback and social media sentiment',
      type: 'NLP',
      accuracy: 87.3,
      status: 'ready',
      lastUpdated: '2024-03-13'
    }
  ]);

  const [businessAnalytics] = useState({
    activeModels: 5,
    totalPredictions: 25678,
    accuracyRate: 91.5,
    costSavings: 18500
  });

  const [adminAnalytics, setAdminAnalytics] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Fetch user data from database
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            setUserData({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName,
              ...snapshot.val()
            });
          } else {
            setUserData({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName,
              accountType: 'individual',
              createdAt: Date.now(),
              lastLogin: Date.now()
            });
          }

          // Fetch user enrollments
          const enrollmentsRef = ref(database, `enrollments/${user.uid}`);
          const enrollmentsSnapshot = await get(enrollmentsRef);
          
          if (enrollmentsSnapshot.exists()) {
            setEnrollments(enrollmentsSnapshot.val());
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = ref(database, 'courses');
        const snapshot = await get(coursesRef);
        
        if (snapshot.exists()) {
          const coursesData = snapshot.val();
          const coursesList = Object.entries(coursesData).map(([id, course]: [string, any]) => ({
            id: parseInt(id),
            ...course
          }));
          setCourses(coursesList);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses');
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchAdminAnalytics = async () => {
      if (userData?.accountType === 'admin') {
        try {
          // Fetch users
          const usersRef = ref(database, 'users');
          const usersSnapshot = await get(usersRef);
          const totalUsers = usersSnapshot.exists() ? Object.keys(usersSnapshot.val()).length : 0;

          // Fetch courses
          const coursesRef = ref(database, 'courses');
          const coursesSnapshot = await get(coursesRef);
          const totalCourses = coursesSnapshot.exists() ? Object.keys(coursesSnapshot.val()).length : 0;

          // Fetch enrollments and calculate revenue
          const enrollmentsRef = ref(database, 'enrollments');
          const enrollmentsSnapshot = await get(enrollmentsRef);
          let totalEnrollments = 0;
          let totalRevenue = 0;

          if (enrollmentsSnapshot.exists()) {
            const enrollmentsData = enrollmentsSnapshot.val();
            Object.values(enrollmentsData).forEach((userEnrollments: any) => {
              Object.values(userEnrollments).forEach((enrollment: any) => {
                totalEnrollments++;
                totalRevenue += enrollment.price || 0;
              });
            });
          }

          setAdminAnalytics({
            totalUsers,
            totalCourses,
            totalEnrollments,
            totalRevenue
          });
        } catch (err) {
          console.error('Error fetching admin analytics:', err);
        }
      }
    };

    fetchAdminAnalytics();
  }, [userData]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserData(null);
      setEnrollments({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    }
  };

  const handleEnroll = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const isEnrolled = (courseId: string): boolean => {
    return !!enrollments[courseId];
  };

  const hasAnyEnrollments = (): boolean => {
    return Object.keys(enrollments).length > 0;
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const courseRef = ref(database, `courses/${courseId}`);
      await remove(courseRef);
      // Refresh courses list
      const coursesRef = ref(database, 'courses');
      const snapshot = await get(coursesRef);
      if (snapshot.exists()) {
        const coursesData = snapshot.val();
        const coursesList = Object.entries(coursesData).map(([id, course]: [string, any]) => ({
          id,
          ...course
        }));
        setCourses(coursesList);
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course');
    }
  };

  const renderBusinessOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-white text-lg font-semibold mb-2">Active Models</h3>
          <p className="text-white text-3xl font-bold">{businessAnalytics.activeModels}</p>
          <p className="text-blue-100 mt-2">In Production</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-white text-lg font-semibold mb-2">Total Predictions</h3>
          <p className="text-white text-3xl font-bold">{businessAnalytics.totalPredictions.toLocaleString()}</p>
          <p className="text-green-100 mt-2">Last 30 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-white text-lg font-semibold mb-2">Accuracy Rate</h3>
          <p className="text-white text-3xl font-bold">{businessAnalytics.accuracyRate}%</p>
          <p className="text-purple-100 mt-2">Average</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-white text-lg font-semibold mb-2">Cost Savings</h3>
          <p className="text-white text-3xl font-bold">${businessAnalytics.costSavings.toLocaleString()}</p>
          <p className="text-orange-100 mt-2">Estimated</p>
        </motion.div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <span className="mr-2">🚀</span>
            Deploy New Model
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <span className="mr-2">📊</span>
            View Reports
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <span className="mr-2">⚙️</span>
            API Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderBusinessModels = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Your AI Models</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Deploy New Model
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {businessModels.map((model) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{model.name}</h3>
                <p className="text-gray-400 mt-1">{model.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                model.status === 'ready' ? 'bg-green-900 text-green-200' :
                model.status === 'training' ? 'bg-yellow-900 text-yellow-200' :
                'bg-red-900 text-red-200'
              }`}>
                {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400">Type</p>
                <p className="font-medium text-white">{model.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Accuracy</p>
                <p className="font-medium text-white">{model.accuracy}%</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-600">
              <p className="text-sm text-gray-400">Last updated: {model.lastUpdated}</p>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors">
                  Logs
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Configure
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderIndividualDashboard = () => {
    return (
      <div className="space-y-8">
        {/* Dashboard for enrolled users */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Course Progress */}
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Course Progress</h2>
            <div className="space-y-4">
              {Object.keys(enrollments).map(courseId => {
                const course = courses.find(c => c.id === courseId);
                if (!course) return null;
                
                const enrollmentTime = enrollments[courseId].timestamp;
                const daysSinceEnrollment = Math.floor((Date.now() - enrollmentTime) / (1000 * 60 * 60 * 24));
                const progress = Math.min(Math.floor(daysSinceEnrollment * 10), 100);
                
                return (
                  <div key={courseId} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between text-gray-300 mb-2">
                      <span>{course.title}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Learning Stats */}
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Learning Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-indigo-400">
                  {Object.keys(enrollments).length * 4}
                </div>
                <div className="text-gray-300">Hours Learned</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-indigo-400">
                  {Object.keys(enrollments).length * 2}
                </div>
                <div className="text-gray-300">Projects Completed</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-indigo-400">
                  {Object.keys(enrollments).length}
                </div>
                <div className="text-gray-300">Certificates Earned</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-indigo-400">85%</div>
                <div className="text-gray-300">Average Score</div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Continue Learning
              </button>
              <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                View Certificates
              </button>
              <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                Download Resources
              </button>
            </div>
          </motion.div>
        </div>

        {/* Enrolled Courses */}
        {hasAnyEnrollments() && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.keys(enrollments).map(courseId => {
                const course = courses.find(c => c.id === courseId);
                if (!course) return null;
                
                return (
                  <motion.div
                    key={courseId}
                    className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-indigo-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-6">
                      <div className="text-4xl mb-4">{course.thumbnail}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                      <p className="text-gray-400 mb-4">{course.description}</p>
                      
                      <div className="flex items-center mb-4">
                        <span className="px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-sm font-medium">
                          {course.level}
                        </span>
                        <span className="ml-2 text-gray-400 text-sm">{course.duration}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          Enrolled: {new Date(enrollments[courseId].timestamp).toLocaleDateString()}
                        </span>
                        <button 
                          onClick={() => navigate(`/course/${courseId}`)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Courses */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Available Courses</h2>
          
          {/* enrollmentStatus.success && ( // This line was removed as per the edit hint */}
          {/*   <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-300"> */}
          {/*     {enrollmentStatus.success} */}
          {/*     {enrollmentStatus.emailSent && ( */}
          {/*       <p className="mt-2 text-sm"> */}
          {/*         A confirmation email has been sent to your registered email address. */}
          {/*       </p> */}
          {/*     )} */}
          {/*   </div> */}
          {/* ) */}
          
          {/* enrollmentStatus.error && ( // This line was removed as per the edit hint */}
          {/*   <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300"> */}
          {/*     {enrollmentStatus.error} */}
          {/*   </div> */}
          {/* ) */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses
              .filter(course => !isEnrolled(course.id))
              .map((course) => (
                <motion.div
                  key={course.id}
                  className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-6">
                    <div className="text-4xl mb-4">{course.thumbnail}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-400 mb-4">{course.description}</p>
                    
                    <div className="flex items-center mb-4">
                      <span className="px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-sm font-medium">
                        {course.level}
                      </span>
                      <span className="ml-2 text-gray-400 text-sm">{course.duration}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-white">₹{course.price}</span>
                      <button
                        onClick={() => handleEnroll(course.id)}
                        // disabled={enrollmentStatus.loading} // This line was removed as per the edit hint
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {/* {enrollmentStatus.loading ? 'Enrolling...' : 'Enroll Now'} */}
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!userData) return null;

    switch (userData.accountType) {
      case 'admin':
        return (
          <div className="space-y-8">
            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-xl shadow-lg"
              >
                <h4 className="text-indigo-100 text-sm font-medium">Total Users</h4>
                <p className="text-white text-3xl font-bold">{adminAnalytics.totalUsers.toLocaleString()}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl shadow-lg"
              >
                <h4 className="text-purple-100 text-sm font-medium">Active Courses</h4>
                <p className="text-white text-3xl font-bold">{adminAnalytics.totalCourses.toLocaleString()}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-pink-600 to-pink-700 p-6 rounded-xl shadow-lg"
              >
                <h4 className="text-pink-100 text-sm font-medium">Total Revenue</h4>
                <p className="text-white text-3xl font-bold">₹{adminAnalytics.totalRevenue.toLocaleString()}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg"
              >
                <h4 className="text-blue-100 text-sm font-medium">Total Enrollments</h4>
                <p className="text-white text-3xl font-bold">{adminAnalytics.totalEnrollments.toLocaleString()}</p>
              </motion.div>
            </div>

            {/* Admin Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Create Course</h3>
                <p className="text-gray-400 mb-4">Create and publish new courses for students.</p>
                <button
                  onClick={() => navigate('/admin/create-course')}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create New Course
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Manage Users</h3>
                <p className="text-gray-400 mb-4">View and manage user accounts and permissions.</p>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Manage Users
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-white mb-4">View Analytics</h3>
                <p className="text-gray-400 mb-4">Access detailed analytics and reports.</p>
                <button
                  onClick={() => navigate('/admin/analytics')}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Analytics
                </button>
              </motion.div>
            </div>

            {/* Available Courses */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Available Courses</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-6">
                      <div className="text-4xl mb-4">{course.thumbnail}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                      <p className="text-gray-400 mb-4">{course.description}</p>
                      
                      <div className="flex items-center mb-4">
                        <span className="px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-sm font-medium">
                          {course.level}
                        </span>
                        <span className="ml-2 text-gray-400 text-sm">{course.duration}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-white">₹{course.price}</span>
                        <div className="space-x-2">
                          <button
                            onClick={() => navigate(`/admin/edit-course/${course.id}`)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'business':
        return (
          <>
            {renderBusinessOverview()}
            {renderBusinessModels()}
          </>
        );
      default:
        return renderIndividualDashboard();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-500 text-xl">{error}</div>
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
            <div className="flex items-center space-x-4">
              {userData && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">
                    Welcome, {userData.displayName || userData.email?.split('@')[0] || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {(() => {
          if (!userData) {
            return (
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to mumeeAI</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Browse our available courses below and start your learning journey today! Sign up or login to enroll in courses.
                </p>
              </div>
            );
          }

          return renderContent();
        })()}
      </div>
    </div>
  );
} 