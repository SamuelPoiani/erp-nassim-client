'use client';

import { useUser } from '../contexts/UserContext';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Users, FileText, BarChart2, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Settings, List } from 'lucide-react'

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

  if (!user) return null;

  const statCards = [
    { 
      title: 'Total Posts', 
      value: stats?.totalPosts || 0,
      icon: <FileText size={24} className="text-blue-500" />,
      change: '+12%'
    },
    { 
      title: 'Newsletter Subscribers', 
      value: stats?.totalNewsletterSubscribers || 0,
      icon: <BarChart2 size={24} className="text-green-500" />,
      change: '+25%'
    },
    { 
      title: 'Total Users', 
      value: stats?.totalUsers || 0,
      icon: <Users size={24} className="text-orange-500" />,
      change: '+8%'
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {/* <p className="text-xs text-muted-foreground">{card.change} from last month</p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            <Link href="/dashboard/posts/new" passHref>
              <Button variant="secondary" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </Link>
            <Link href="/dashboard/posts" passHref>
              <Button variant="secondary" className="w-full justify-start">
                <List className="mr-2 h-4 w-4" />
                View All Posts
              </Button>
            </Link>
            <Link href="/dashboard/settings" passHref>
              <Button variant="secondary" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Manage Settings
              </Button>
            </Link>
            <Link href="/dashboard/settings" passHref>
              <Button variant="secondary" onClick={handleLogout} className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Member since</span>
              <span className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
