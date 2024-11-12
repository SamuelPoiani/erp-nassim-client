'use client';

import { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { getToken } from '@/utils/auth';
import { fetchRoles } from '@/utils/roleApi';
import { toast } from 'react-toastify';

type APIError = {
  message: string;
  code?: string;
  validation?: {
    field: string;
    message: string;
  }[];
};

interface Role {
  id: number;
  name: string;
  description: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}

export default function CreateUserModal({ isOpen, onClose, onCreate }: CreateUserModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const loadRoles = async () => {
      const rolesData = await fetchRoles();
      setRoles(rolesData);
    };
    loadRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${backendUrl}/api/auth/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User created successfully!');
        onCreate();
        onClose();
        setFormData({ name: '', email: '', password: '', roleId: 1 });
      } else {
        const error = data as APIError;
        if (error.validation?.length) {
          error.validation.forEach(({ message }) => toast.error(message));
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('Failed to create user');
        }
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Network error: Could not create user');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New User</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-2 border rounded"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-2 border rounded"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1">Role</label>
            <select
              value={formData.roleId}
              onChange={(e) => setFormData(prev => ({ ...prev, roleId: Number(e.target.value) }))}
              className="w-full p-2 border rounded"
              disabled={isLoading}
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
}
