import React, { useState, useEffect } from 'react';
import { FirestoreService } from '../services/database/FirestoreService';
import { User, Workshop, Enrollment, Payment } from '../services/database/IDatabaseService';
import { Timestamp } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebase';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'enrollments' | 'payments' | 'workshops' | 'analytics'>('users');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const dbService = new FirestoreService({ type: 'firestore' });

  // Simple admin password - in production, this should be stored securely
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'titliAI2025!';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      // Store authentication in session storage
      sessionStorage.setItem('adminAuthenticated', 'true');
      
      // Test Firebase connection first
      console.log('🔍 Testing Firebase connection...');
      try {
        // Test basic Firestore connection
        const testRef = collection(firestore, 'test');
        await getDocs(testRef);
        console.log('✅ Firebase connection successful');
        
        // Load initial data for analytics tab
        console.log('🚀 Loading initial data after login...');
        const [usersData, enrollmentsData, paymentsData, workshopsData] = await Promise.all([
          dbService.getAllUsers(),
          dbService.getAllEnrollments(),
          dbService.getAllPayments(),
          dbService.getWorkshops()
        ]);
        setUsers(usersData);
        setEnrollments(enrollmentsData);
        setPayments(paymentsData);
        setWorkshops(workshopsData);
        console.log('✅ Initial data loaded successfully');
      } catch (error: any) {
        console.error('❌ Firebase connection error:', error);
        setError(`Firebase connection failed: ${error?.message || 'Unknown error'}. Please check your Firebase configuration.`);
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuthenticated');
      }
    } else {
      setError('Invalid password');
    }
  };

  useEffect(() => {
    // Check if already authenticated
    const isAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [activeTab, isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading data for tab:', activeTab);
      
      switch (activeTab) {
        case 'users':
          console.log('👥 Fetching users...');
          const usersData = await dbService.getAllUsers();
          console.log('✅ Users loaded:', usersData.length);
          setUsers(usersData);
          break;
        case 'enrollments':
          console.log('🎓 Fetching enrollments...');
          const enrollmentsData = await dbService.getAllEnrollments();
          console.log('✅ Enrollments loaded:', enrollmentsData.length);
          setEnrollments(enrollmentsData);
          break;
        case 'payments':
          console.log('💰 Fetching payments...');
          const paymentsData = await dbService.getAllPayments();
          console.log('✅ Payments loaded:', paymentsData.length);
          setPayments(paymentsData);
          break;
        case 'workshops':
          console.log('📚 Fetching workshops...');
          const workshopsData = await dbService.getWorkshops();
          console.log('✅ Workshops loaded:', workshopsData.length);
          setWorkshops(workshopsData);
          break;
        case 'analytics':
          console.log('📊 Loading analytics data...');
          // Load all data for analytics
          const [analyticsUsers, analyticsEnrollments, analyticsPayments, analyticsWorkshops] = await Promise.all([
            dbService.getAllUsers(),
            dbService.getAllEnrollments(),
            dbService.getAllPayments(),
            dbService.getWorkshops()
          ]);
          setUsers(analyticsUsers);
          setEnrollments(analyticsEnrollments);
          setPayments(analyticsPayments);
          setWorkshops(analyticsWorkshops);
          console.log('✅ Analytics data loaded');
          break;
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      alert(`Error loading data: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: Timestamp | Date) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const filteredData = () => {
    let data: any[] = [];
    switch (activeTab) {
      case 'users':
        data = users;
        break;
      case 'enrollments':
        data = enrollments;
        break;
      case 'payments':
        data = payments;
        break;
      case 'workshops':
        data = workshops;
        break;
    }

    if (searchTerm) {
      data = data.filter(item => 
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      data = data.filter(item => item.status === filterStatus);
    }

    return data;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const renderUsersTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white/60 border border-blue-100 rounded-lg shadow-lg">
        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stats</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {filteredData().map((user: User) => (
            <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.displayName || 'N/A'}</div>
                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.geolocation?.countryName || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="text-xs">
                  <div>Enrollments: {user.stats?.totalEnrollments || 0}</div>
                  <div>Completed: {user.stats?.completedWorkshops || 0}</div>
                  <div>Spent: {formatCurrency(user.stats?.totalSpent || 0, user.stats?.preferredCurrency || 'INR')}</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEnrollmentsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white/60 border border-blue-100 rounded-lg shadow-lg">
        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Enrollment ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Workshop</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Progress</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Enrolled</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {filteredData().map((enrollment: Enrollment) => {
            // Find user details for this enrollment
            const user = users.find(u => u.id === enrollment.userId);
            const userName = user ? (user.displayName || user.email || 'Unknown User') : 'Unknown User';
            const userEmail = user ? user.email : 'N/A';
            
            // Find workshop details for this enrollment
            const workshop = workshops.find(w => w.id === enrollment.workshopId);
            const workshopName = workshop ? workshop.title : 'Unknown Workshop';
            
            return (
              <tr key={enrollment.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {enrollment.id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{userName}</div>
                      <div className="text-xs text-gray-500">{userEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="text-sm font-medium text-gray-900">{workshopName}</div>
                  <div className="text-xs text-gray-500">{enrollment.workshopId.substring(0, 8)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                    {enrollment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                      style={{ width: `${enrollment.progress.percentageComplete}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{enrollment.progress.percentageComplete}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(enrollment.enrolledAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="text-xs">
                    <div>{formatCurrency(enrollment.payment.amount, enrollment.payment.currency)}</div>
                    <div className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${getStatusColor(enrollment.payment.status)}`}>
                      {enrollment.payment.status}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderPaymentsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white/60 border border-blue-100 rounded-lg shadow-lg">
        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Workshop</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {filteredData().map((payment: Payment) => {
            // Find user details for this payment
            const user = users.find(u => u.id === payment.userId);
            const userName = user ? (user.displayName || user.email || 'Unknown User') : 'Unknown User';
            const userEmail = user ? user.email : 'N/A';
            
            // Find workshop details for this payment
            const workshop = workshops.find(w => w.id === payment.workshopId);
            const workshopName = workshop ? workshop.title : 'Unknown Workshop';
            
            return (
              <tr key={payment.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {payment.id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{userName}</div>
                      <div className="text-xs text-gray-500">{userEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="text-sm font-medium text-gray-900">{workshopName}</div>
                  <div className="text-xs text-gray-500">{payment.workshopId.substring(0, 8)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-semibold">{formatCurrency(payment.amount, payment.currency)}</div>
                    {payment.originalAmount && payment.originalAmount !== payment.amount && (
                      <div className="text-xs text-gray-500">
                        Original: {formatCurrency(payment.originalAmount, payment.originalCurrency || 'INR')}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="capitalize">{payment.paymentMethod}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(payment.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderWorkshopsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white/60 border border-blue-100 rounded-lg shadow-lg">
        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Workshop</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Level</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Duration</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {filteredData().map((workshop: Workshop) => (
            <tr key={workshop.id} className="hover:bg-blue-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {workshop.title.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{workshop.title}</div>
                    <div className="text-sm text-gray-500">{workshop.slug}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  workshop.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  workshop.level === 'foundation' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {workshop.level}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(workshop.price, workshop.currency)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workshop.status)}`}>
                  {workshop.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {workshop.duration} hours
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(workshop.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 rounded-xl shadow-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-500 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/70 to-purple-100/60 border border-purple-100 rounded-xl shadow-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-500 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
            <p className="text-2xl font-semibold text-gray-900">{enrollments.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/70 to-green-100/60 border border-green-100 rounded-xl shadow-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-500 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0), 'INR')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/70 to-orange-100/60 border border-orange-100 rounded-xl shadow-lg p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-orange-500 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Workshops</p>
            <p className="text-2xl font-semibold text-gray-900">
              {workshops.filter(w => w.status === 'active').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen text-gray-900 font-sans flex items-center justify-center">
        <div className="bg-white/60 border border-blue-100 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🦋</div>
            <h1 className="text-2xl font-bold text-gray-900">TitliAI Admin Access</h1>
            <p className="text-gray-600 mt-2">Enter admin password to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Access Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen text-gray-900 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">🦋 TitliAI Admin Dashboard</h1>
              <p className="text-blue-100 mt-1">Manage users, enrollments, payments, and workshops</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadData}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem('adminAuthenticated');
                  setIsAuthenticated(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white/60 border border-blue-100 rounded-xl shadow-lg p-1 mb-8">
          <div className="flex space-x-1">
            {[
              { id: 'analytics', label: '📊 Analytics', icon: '📊' },
              { id: 'users', label: '👥 Users', icon: '👥' },
              { id: 'enrollments', label: '🎓 Enrollments', icon: '🎓' },
              { id: 'payments', label: '💰 Payments', icon: '💰' },
              { id: 'workshops', label: '📚 Workshops', icon: '📚' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/60 border border-blue-100 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/60 border border-blue-100 rounded-xl shadow-lg p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading data...</span>
            </div>
          ) : (
            <div>
              {/* Debug Info */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Debug Info:</h3>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>Users: {users.length} | Enrollments: {enrollments.length} | Payments: {payments.length} | Workshops: {workshops.length}</div>
                  <div>Active Tab: {activeTab} | Search: "{searchTerm}" | Filter: {filterStatus}</div>
                  <div>Filtered Data: {filteredData().length} items</div>
                </div>
              </div>
              
              {activeTab === 'analytics' && renderAnalytics()}
              {activeTab === 'users' && renderUsersTable()}
              {activeTab === 'enrollments' && renderEnrollmentsTable()}
              {activeTab === 'payments' && renderPaymentsTable()}
              {activeTab === 'workshops' && renderWorkshopsTable()}
              
              {filteredData().length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Debug: Check browser console for detailed error messages</p>
                    <p>Make sure your Firestore collections exist and have data</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
