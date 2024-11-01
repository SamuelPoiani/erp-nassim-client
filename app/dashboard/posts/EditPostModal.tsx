'use client';

import { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';

type APIError = {
  message: string;
  code?: string;
  validation?: {
    field: string;
    message: string;
  }[];
};

interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
}

interface EditPostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditPostModal({ post, isOpen, onClose, onUpdate }: EditPostModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Post, 'id'>>({
    title: '',
    description: '',
    content: '',
    image: ''
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        description: post.description,
        content: post.content,
        image: post.image
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`http://localhost:3001/api/blog/edit/${post?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Post updated successfully!');
        onUpdate();
        onClose();
      } else {
        const error = data as APIError;
        if (error.validation?.length) {
          error.validation.forEach(({ message }) => toast.error(message));
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('Failed to update post');
        }
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Network error: Could not update post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full p-2 border rounded"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-2 border rounded min-h-[200px]"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
