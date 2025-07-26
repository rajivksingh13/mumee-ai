import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const dashboardCards = [
  {
    title: 'View profile',
    description: 'View your profile page as others see it',
    icon: (
      // User Circle icon
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20c0-2.5 3.6-4 8-4s8 1.5 8 4" /></svg>
    ),
    to: '/profile',
  },
  {
    title: 'Personal information',
    description: 'Update your name, bio, gender, birthday and more',
    icon: (
      // User Cog icon
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06A1.65 1.65 0 0015 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 008.6 15a1.65 1.65 0 00-1.82-.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0015 8.6a1.65 1.65 0 001.82.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 15z" /></svg>
    ),
    to: '/profile/edit',
  },
  {
    title: 'Purchase history',
    description: 'View purchases and download invoices',
    icon: (
      // Receipt icon
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4v2m8-2v2" /></svg>
    ),
    to: '/account#purchases',
  },
  {
    title: 'Payment details',
    description: 'Manage your bank account & other payment details',
    icon: (
      // Wallet icon
      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11h.01" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 11h20" /></svg>
    ),
    to: '/account/payments',
  },
  {
    title: 'Update number/email',
    description: 'View and update registered phone number & email',
    icon: (
      // Mobile with mail icon
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8M8 10h8" /></svg>
    ),
    to: '/account#update-contact',
  },
  {
    title: 'Tokens in Bucket',
    description: 'AI tokens collected for your learning journey',
    icon: (
      // Shiny coin with sparkles icon
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 5l1 1M19 3l1 1" /></svg>
    ),
    to: '/account#tokens',
    tokens: 120, // mock value for now
  },
];

const AccountPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-4xl font-bold text-blue-700">
              {user?.displayName?.[0] || 'U'}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">Hello, {user?.displayName || 'User'}</div>
              <div className="text-gray-600 text-sm">{user?.email}</div>
            </div>
          </div>
          {/* Removed Go to Dashboard button */}
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {dashboardCards.map((card) => (
            <Link
              to={card.to}
              key={card.title}
              className="group bg-white/90 border border-white/40 rounded-2xl p-6 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow hover:border-blue-200 hover:bg-blue-50/60 cursor-pointer min-h-[140px]"
            >
              <div className="mb-4">{card.icon}</div>
              <div className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{card.title}</div>
              <div className="text-gray-600 text-sm">{card.description}</div>
              {card.title === 'Tokens in Bucket' && (
                <div className="mt-2 text-2xl font-bold text-yellow-600">{card.tokens} AI Tokens</div>
              )}
            </Link>
          ))}
        </div>
        {/* Removed Enrolled Workshops and Payment History sections */}

        {/* More sections can be added here (profile update, etc.) */}
      </div>
    </div>
  );
};

export default AccountPage;

// PaymentDetailsPage component
export const PaymentDetailsPage: React.FC = () => {
  // Mock payment history data
  const paymentHistory = [
    {
      id: 'pay_001',
      date: '2024-06-01',
      amount: 499,
      method: 'Razorpay',
      status: 'Success',
      workshop: 'AI Workshop – Foundation Level',
    },
    {
      id: 'pay_002',
      date: '2024-07-10',
      amount: 999,
      method: 'Razorpay',
      status: 'Success',
      workshop: 'AI Advanced Training',
    },
  ];
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
              {paymentHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-gray-500 px-4 py-2">No payments found.</td>
                </tr>
              ) : (
                paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b last:border-b-0 border-gray-100">
                    <td className="px-4 py-2">{payment.date}</td>
                    <td className="px-4 py-2">{payment.workshop}</td>
                    <td className="px-4 py-2 font-bold text-blue-700">₹{payment.amount}</td>
                    <td className="px-4 py-2">{payment.method}</td>
                    <td className="px-4 py-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{payment.status}</span>
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