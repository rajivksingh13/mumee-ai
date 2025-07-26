import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data for user achievements
const achievements = [
  {
    type: 'Workshop',
    title: 'AI Workshop – Foundation Level',
    date: '2024-06-01',
    status: 'Completed',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h6" /></svg>
    ),
  },
  {
    type: 'Training',
    title: 'AI Advanced Training',
    date: '2024-07-10',
    status: 'Enrolled',
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 13.5c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5c0-.943.38-1.823 1.06-2.578L12 14z" /></svg>
    ),
  },
  {
    type: 'Certificate',
    title: 'AI Specialist Certificate',
    date: '2024-08-15',
    status: 'Obtained',
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
    ),
  },
  {
    type: 'AI Lab',
    title: 'AI Lab – NLP Project',
    date: '2024-09-01',
    status: 'Completed',
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" /></svg>
    ),
  },
];

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-8 px-4">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/account')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Account
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">View all your achievements and enrolled items</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-4xl font-bold text-blue-700">
              {user?.displayName?.[0] || 'U'}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{user?.displayName || 'User'}</div>
              <div className="text-gray-600 text-sm">{user?.email}</div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements & Enrollments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {achievements.map((item, idx) => (
              <div key={idx} className="bg-white/90 border border-white/40 rounded-2xl p-6 flex flex-col items-start shadow-xl hover:shadow-2xl transition-shadow hover:border-blue-200 hover:bg-blue-50/60 min-h-[140px]">
                <div className="mb-2">{item.icon}</div>
                <div className="font-bold text-lg text-gray-900 mb-1">{item.title}</div>
                <div className="text-gray-600 text-sm mb-1">{item.type}</div>
                <div className="text-gray-500 text-xs mb-1">{item.date}</div>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Completed' || item.status === 'Obtained' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 