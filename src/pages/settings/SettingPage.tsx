import React, { useState, useEffect } from 'react';
import { useSettings } from './useSettings';
import ProfileSettings from './ProfileSettings';
// import PasswordSettings from './PasswordSettings';  // ✅ معلق

type TabType = 'profile' | 'password';

const SettingsPage: React.FC = () => {
  const {
    profile,
    isLoading,
    error,
    successMessage,
    loadProfile,
    updateProfile,
    // updatePassword,   // ✅ معلق
    uploadAvatar,
    clearError,
    clearSuccessMessage,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<TabType>('profile');

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => clearSuccessMessage(), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // ✅ tabs - بس Profile
  const tabs: { id: TabType; name: string; icon: string }[] = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    // { id: 'password', name: 'Password', icon: '🔒' },  // ✅ معلق
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 shadow transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your account settings</p>
        </div>
      </div>

      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-700 dark:text-green-300">{successMessage}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow p-2 transition-colors duration-300">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-6">
            {activeTab === 'profile' && (
              <ProfileSettings
                profile={profile}
                isLoading={isLoading}
                onUpdate={updateProfile}
                onUploadAvatar={uploadAvatar}
              />
            )}

            {/* ✅ Password Tab - معلق */}
            {/* {activeTab === 'password' && (
              <PasswordSettings
                onUpdate={updatePassword}
                isLoading={isLoading}
              />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;