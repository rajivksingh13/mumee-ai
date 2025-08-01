import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { databaseService } from '../services/databaseService';

interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    location: string;
    bio: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
  };
  preferences: {
    emailNotifications: boolean;
    marketingEmails: boolean;
    newsletter: boolean;
  };
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      location: '',
      bio: '',
      skillLevel: 'beginner'
    },
    preferences: {
      emailNotifications: true,
      marketingEmails: false,
      newsletter: false
    }
  });

  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user?.uid) return;
      
      try {
        const db = await databaseService.getUser(user.uid);
        
        if (db) {
          setSettings({
            profile: {
              firstName: db.profile?.firstName || '',
              lastName: db.profile?.lastName || '',
              phone: db.profile?.phone || '',
              location: db.profile?.location || '',
              bio: db.profile?.bio || '',
              skillLevel: db.profile?.skillLevel || 'beginner'
            },
            preferences: {
              emailNotifications: db.preferences?.emailNotifications ?? true,
              marketingEmails: db.preferences?.marketingEmails ?? false,
              newsletter: db.preferences?.newsletter ?? false
            }
          });
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      }
    };

    loadUserSettings();
  }, [user?.uid]);

  const handleSave = async () => {
    if (!user?.uid) return;

    try {
      setSaveStatus('saving');
      const userRef = doc(firestore, 'users', user.uid);
      
      await updateDoc(userRef, {
        profile: settings.profile,
        preferences: settings.preferences,
        updatedAt: Timestamp.now()
      });

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleInputChange = (section: 'profile' | 'preferences', field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your profile, preferences, and account settings.</p>
        </div>

        {/* Save Status */}
        {saveStatus !== 'idle' && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveStatus === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
            saveStatus === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
            'bg-blue-50 border border-blue-200 text-blue-700'
          }`}>
            {saveStatus === 'saving' && 'Saving changes...'}
            {saveStatus === 'success' && 'Settings saved successfully!'}
            {saveStatus === 'error' && 'Error saving settings. Please try again.'}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Settings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={settings.profile.firstName}
                    onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={settings.profile.lastName}
                    onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={settings.profile.location}
                    onChange={(e) => handleInputChange('profile', 'location', e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                  <select
                    value={settings.profile.skillLevel}
                    onChange={(e) => handleInputChange('profile', 'skillLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive updates about your courses and progress</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.preferences.emailNotifications}
                      onChange={(e) => handleInputChange('preferences', 'emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                    <p className="text-sm text-gray-500">Receive promotional content and special offers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.preferences.marketingEmails}
                      onChange={(e) => handleInputChange('preferences', 'marketingEmails', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Newsletter</h3>
                    <p className="text-sm text-gray-500">Receive weekly updates about AI trends and tips</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.preferences.newsletter}
                      onChange={(e) => handleInputChange('preferences', 'newsletter', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Account Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Actions</h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                  Change Password
                </button>
                
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                  Export Data
                </button>
                
                <button className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors">
                  Delete Account
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Last Sign In</p>
                  <p className="font-medium text-gray-900">
                    {user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 