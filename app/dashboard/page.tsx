'use client';

import { useUser } from '../contexts/UserContext';
import { useState, useEffect } from 'react';
import { 
  AiOutlineFileText, 
  AiOutlineUser, 
  AiOutlineMail 
} from 'react-icons/ai';

interface Stats {
  totalPosts: number;
  totalNewsletterSubscribers: number;
  totalUsers: number;
}

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        const response = await fetch('http://localhost:3001/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: stats?.totalPosts || 0,
      icon: AiOutlineFileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Newsletter Subscribers',
      value: stats?.totalNewsletterSubscribers || 0,
      icon: AiOutlineMail,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: AiOutlineUser,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}! 👋</h2>
        <p className="text-gray-600 mt-2">Here's what's happening with your blog today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <span className="text-gray-500 text-sm">Last 30 days</span>
            </div>
            
            <div className="mt-4">
              <h3 className="text-gray-600 text-sm font-medium">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {stat.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* User Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Account Information</h3>
          <div className="space-y-3">
            <p className="text-sm">
              <span className="text-gray-600 font-medium">Email:</span>{' '}
              <span className="text-gray-800">{user.email}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600 font-medium">Member since:</span>{' '}
              <span className="text-gray-800">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => window.location.href = '/dashboard/posts/new'}
              className="w-full text-left px-4 py-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
            >
              Create New Post
            </button>
            <button
              onClick={() => window.location.href = '/dashboard/posts'}
              className="w-full text-left px-4 py-2 rounded-lg text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
            >
              View All Posts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
