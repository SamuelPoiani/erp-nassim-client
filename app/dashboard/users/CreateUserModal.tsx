'use client';

import { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { getToken, fetchRoles } from '@/utils/auth';

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

  useEffect(() => {
    const loadRoles = async () => {
      const rolesData = await fetchRoles();
      setRoles(rolesData);
    };
    loadRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = getToken();
      const response = await fetch('http://localhost:3001/api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onCreate();
        setFormData({ name: '', email: '', password: '', roleId: 1 }); // Reset form
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
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
            />
          </div>

          <div>
            <label className="block mb-1">Role</label>
            <select
              value={formData.roleId}
              onChange={(e) => setFormData(prev => ({ ...prev, roleId: Number(e.target.value) }))}
              className="w-full p-2 border rounded"
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
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
