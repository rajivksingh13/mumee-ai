import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { accountService, AccountData } from '../services/accountService';
import { Payment } from '../services/databaseService';
import { Timestamp } from 'firebase/firestore';
import PurchaseHistoryPage from './PurchaseHistoryPage';

const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const [accountData, setAccountData] = useState<AccountData>({
    user: null,
    enrollments: [],
    payments: [],
    workshops: [],
    stats: {
      totalEnrollments: 0,
      completedWorkshops: 0,
      certificatesEarned: 0,
      totalSpent: 0,
      aiTokens: 0,
      preferredCurrency: 'INR'
    },
    isLoading: true,
    error: null
  });
  
  // State for sub-page navigation
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);

  // Navigation handlers
  const handlePurchaseHistoryClick = () => {
    setShowPurchaseHistory(true);
  };

  const handleBackFromPurchaseHistory = () => {
    setShowPurchaseHistory(false);
  };

  useEffect(() => {
    const loadAccountData = async () => {
      if (!user?.uid) return;
      setAccountData(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await accountService.getAccountData(user.uid);
        setAccountData(data);
      } catch (error) {
        setAccountData(prev => ({ ...prev, isLoading: false, error: error instanceof Error ? error.message : 'Failed to load account data' }));
      }
    };
    loadAccountData();
  }, [user?.uid]);

  // Conditional rendering for sub-pages
  if (showPurchaseHistory) {
    return (
      <PurchaseHistoryPage onBack={handleBackFromPurchaseHistory} />
    );
  }

  if (accountData.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your account data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (accountData.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <p className="font-semibold">Error loading account data</p>
            <p className="text-sm mt-1">{accountData.error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
              <p className="text-gray-600">Welcome back, {user?.displayName || 'User'}! Here's your learning dashboard.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="font-medium text-gray-900">{user?.displayName || 'User'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{accountData.stats.totalEnrollments}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{accountData.stats.completedWorkshops}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{accountData.stats.certificatesEarned}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">AI Tokens</p>
                <p className="text-2xl font-bold text-gray-900">{accountData.stats.aiTokens}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Quick Actions & Recent Activity */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {/* Purchase History */}
                <div
                  onClick={handlePurchaseHistoryClick}
                  className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <div className="flex-shrink-0 mr-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h6" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4v2m8-2v2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Purchase History
                    </h3>
                    <p className="text-sm text-gray-500">View purchases and download invoices</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {accountData.payments.length}
                    </span>
                  </div>
                </div>



                {/* Learning Progress */}
                <div className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="flex-shrink-0 mr-4">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Learning Progress</h3>
                    <p className="text-sm text-gray-500">Track your learning journey</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {accountData.stats.totalEnrollments}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {accountData.enrollments.slice(0, 3).map((enrollment) => {
                  const workshop = accountData.workshops.find(w => w.id === enrollment.workshopId);
                  return (
                    <div key={enrollment.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {workshop?.title || 'Unknown Workshop'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)} • {enrollment.progress?.percentageComplete || 0}% complete
                        </p>
                      </div>
                    </div>
                  );
                })}
                {accountData.enrollments.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No recent activity</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Enrollments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Enrollments</h2>
                <span className="text-sm text-gray-500">{accountData.enrollments.length} total</span>
              </div>

              {accountData.enrollments.length > 0 ? (
                <div className="space-y-4">
                  {accountData.enrollments.map((enrollment) => {
                    const workshop = accountData.workshops.find(w => w.id === enrollment.workshopId);
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

                    const getWorkshopLink = (workshopId: string) => {
                      const workshopMap: { [key: string]: string } = {
                        'beginner-workshop': '/workshops/beginner',
                        'foundation-workshop': '/workshops/foundation',
                        'advanced-workshop': '/workshops/advance'
                      };
                      return workshopMap[workshopId] || '/workshops';
                    };

                    return (
                      <div key={enrollment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                  {workshop?.title || 'Unknown Workshop'}
                                </h4>
                                <p className="text-gray-600 mb-3 line-clamp-2">
                                  {workshop?.description || 'No description available'}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(enrollment.status)} ml-4 flex-shrink-0`}>
                                {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                              </span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                <span className="text-sm text-gray-500">
                                  {enrollment.progress?.percentageComplete || 0}% Complete
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(enrollment.progress?.percentageComplete || 0)}`}
                                  style={{ width: `${enrollment.progress?.percentageComplete || 0}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Payment Info */}
                            {enrollment.payment && (
                              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Payment Status:</span>
                                  <span className={`font-medium ${enrollment.payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {enrollment.payment.status.charAt(0).toUpperCase() + enrollment.payment.status.slice(1)}
                                  </span>
                                </div>
                                {enrollment.payment.amount && (
                                  <div className="flex items-center justify-between text-sm mt-1">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="font-medium text-gray-900">
                                      ₹{enrollment.payment.amount}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                                                         {/* Action Buttons */}
                             <div className="flex flex-wrap gap-3">
                               <a
                                 href={getWorkshopLink(enrollment.workshopId)}
                                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                               >
                                 Continue Learning
                               </a>
                               {/* View Certificate button hidden for future use */}
                               {/* <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                 View Certificate
                               </button> */}
                             </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Enrollments Yet</h3>
                  <p className="text-gray-500 mb-6">Start your learning journey by enrolling in our AI workshops.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

// PaymentDetailsPage component
export const PaymentDetailsPage: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      if (!user?.uid) return;

      try {
        setIsLoading(true);
        console.log('🔄 Loading payment history...');
        
        // For now, we'll use mock data since getUserPayments is not implemented
        // In a real implementation, you would call accountService.getUserPayments(user.uid)
        const mockPayments: Payment[] = [
          {
            id: 'pay_001',
            userId: user.uid,
            workshopId: 'foundation-workshop',
            enrollmentId: 'enroll_001',
            amount: 2999,
            currency: 'INR',
            status: 'completed',
            paymentMethod: 'razorpay',
            razorpay: {
              paymentId: 'pay_123456789',
              orderId: 'order_123456789',
              method: 'card'
            },
            createdAt: new Timestamp(Date.now() / 1000, 0),
            paidAt: new Timestamp(Date.now() / 1000, 0)
          },
          {
            id: 'pay_002',
            userId: user.uid,
            workshopId: 'advanced-workshop',
            enrollmentId: 'enroll_002',
            amount: 4999,
            currency: 'INR',
            status: 'completed',
            paymentMethod: 'razorpay',
            razorpay: {
              paymentId: 'pay_987654321',
              orderId: 'order_987654321',
              method: 'netbanking'
            },
            createdAt: new Timestamp(Date.now() / 1000, 0),
            paidAt: new Timestamp(Date.now() / 1000, 0)
          }
        ];

        setPayments(mockPayments);
        console.log('✅ Payment history loaded successfully');
      } catch (error) {
        console.error('❌ Error loading payment history:', error);
        setError(error instanceof Error ? error.message : 'Failed to load payment history');
      } finally {
        setIsLoading(false);
      }
    };

    loadPayments();
  }, [user?.uid]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading payment history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error loading payment history</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left bg-white/90 rounded-xl shadow-xl">
            <thead>
              <tr>
                <th className="px-4 py-2 text-gray-700">Date</th>
                <th className="px-4 py-2 text-gray-700">Workshop</th>
                <th className="px-4 py-2 text-gray-700">Amount</th>
                <th className="px-4 py-2 text-gray-700">Method</th>
                <th className="px-4 py-2 text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-gray-500 px-4 py-2">No payments found.</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b last:border-b-0 border-gray-100">
                    <td className="px-4 py-2">
                      {payment.paidAt?.toDate().toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="px-4 py-2">
                      {payment.workshopId === 'foundation-workshop' ? 'AI Workshop – Foundation Level' :
                       payment.workshopId === 'advanced-workshop' ? 'AI Advanced Training' :
                       payment.workshopId}
                    </td>
                    <td className="px-4 py-2 font-bold text-blue-700">₹{payment.amount}</td>
                    <td className="px-4 py-2">
                      {payment.razorpay?.method || payment.paymentMethod}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 