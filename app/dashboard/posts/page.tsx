'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useRouter } from 'next/navigation';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import EditPostModal from './EditPostModal';
import Link from 'next/link';

interface Author {
  id: number;
  name: string;
  description: string;
}

interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

export default function Posts() {
  const { user } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch('http://localhost:3001/api/blog/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <AiOutlinePlus className="w-5 h-5" />
          Add New
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-600">
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Author</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2">Actions</div>
        </div>

        <div className="divide-y">
          {posts.map((post) => (
            <div key={post.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
              <div className="col-span-5">
                <h2 className="font-medium text-blue-600 hover:text-blue-800">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 truncate">{post.description}</p>
              </div>
              <div className="col-span-3">
                <span className="text-gray-600">{post.author.name}</span>
              </div>
              <div className="col-span-2 text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="col-span-2 flex gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                >
                  <AiOutlineEdit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditPostModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
        }}
        onUpdate={fetchPosts}
      />
    </div>
  );
}
