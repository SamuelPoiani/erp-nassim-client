'use client';
import { useUser } from '../contexts/UserContext';
import { useState, useEffect } from 'react';
import { FiFileText, FiUsers, FiLogOut, FiSettings, FiPlusCircle, FiList } from 'react-icons/fi';
import { HiOutlineChartBar } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Stats {
  totalPosts: number;
  totalNewsletterSubscribers: number;
  totalUsers: number;
}

export default function Dashboard() {
  const { user, setUser } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogout = async () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
    router.push('/');
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        const response = await fetch(`${backendUrl}/api/stats`, {
          cache: 'force-cache',
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

  if (!user) return null;

  const statCards = [
    { 
      title: 'Total Posts', 
      value: stats?.totalPosts || 0,
      icon: <FiFileText size={24} className="text-blue-500" />,
      change: '+12%'
    },
    { 
      title: 'Newsletter Subscribers', 
      value: stats?.totalNewsletterSubscribers || 0,
      icon: <HiOutlineChartBar size={24} className="text-green-500" />,
      change: '+25%'
    },
    { 
      title: 'Total Users', 
      value: stats?.totalUsers || 0,
      icon: <FiUsers size={24} className="text-orange-500" />,
      change: '+8%'
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              {card.icon}
            </div>
            <div className="pt-2">
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              {/* <p className="text-xs text-gray-500">{card.change} from last month</p> */}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-3">
            <Link href="/dashboard/posts/new" 
              className="flex items-center w-full px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FiPlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Link>
            <Link href="/dashboard/posts"
              className="flex items-center w-full px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FiList className="mr-2 h-4 w-4" />
              View All Posts
            </Link>
            <Link href="/dashboard/settings"
              className="flex items-center w-full px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FiSettings className="mr-2 h-4 w-4" />
              Manage Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-red-600 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors">
              <FiLogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Email</span>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Member since</span>
              <p className="text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
