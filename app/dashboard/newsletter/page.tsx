'use client';

import { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';
import CreateNewsletterModal from '@/app/dashboard/newsletter/CreateNewsletterModal';
import { toast } from 'react-toastify';

interface Newsletter {
  id: number;
  email: string;
  createdAt: string;
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchNewsletters = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`${backendUrl}/api/newsletter/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNewsletters(data);
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const deleteNewsletter = async (email: string) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      const response = await fetch(`${backendUrl}/api/newsletter/unsubscribe/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        toast.success('Subscriber removed successfully!');
        fetchNewsletters();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to remove subscriber');
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      toast.error('Network error: Could not remove subscriber');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Newsletter Subscribers</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <AiOutlinePlus className="w-5 h-5" />
          Add Subscriber
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscribed Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {newsletters.map((newsletter) => (
              <tr key={newsletter.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{newsletter.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(newsletter.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => deleteNewsletter(newsletter.email)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <AiOutlineDelete className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateNewsletterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={() => {
          fetchNewsletters();
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}
