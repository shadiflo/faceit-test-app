'use client';

import { useState, useEffect } from 'react';

interface FaceitUser {
  player_id: string;
  nickname: string;
  avatar: string;
  country: string;
  level: number;
  games?: any;
}

export default function ProfilePage() {
  const [user, setUser] = useState<FaceitUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/user');
      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in</h1>
          <p className="text-gray-600 mb-8">You need to log in with FACEIT to view your profile.</p>
          <a
            href="/"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-orange-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              <img
                src={user.avatar}
                alt={user.nickname}
                className="w-20 h-20 rounded-full border-4 border-white"
              />
              <div>
                <h1 className="text-3xl font-bold text-white">{user.nickname}</h1>
                <p className="text-orange-100">Level {user.level}</p>
                <p className="text-orange-100">Country: {user.country}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Player ID:</span>
                    <span className="ml-2 text-gray-800 font-mono text-sm">{user.player_id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Nickname:</span>
                    <span className="ml-2 text-gray-800">{user.nickname}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Level:</span>
                    <span className="ml-2 text-gray-800">{user.level}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Country:</span>
                    <span className="ml-2 text-gray-800">{user.country}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Raw User Data</h2>
                <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}