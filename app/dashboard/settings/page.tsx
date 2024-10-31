'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from '@/app/contexts/UserContext';
import { toast } from 'react-toastify';

interface FormState {
  values: {
    name: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  original: {
    name: string;
  };
  dirty: {
    profile: boolean;
    password: boolean;
  };
}

export default function Settings() {
  const { user, updateUserData } = useUser();
  const [loading, setLoading] = useState(false);
  
  const [formState, setFormState] = useState<FormState>({
    values: {
      name: user?.name || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    original: {
      name: user?.name || ''
    },
    dirty: {
      profile: false,
      password: false
    }
  });

  // Sync form data with user context
  useEffect(() => {
    if (user) {
      setFormState(prev => ({
        values: {
          ...prev.values,
          name: user.name || ''
        },
        original: {
          name: user.name || ''
        },
        dirty: {
          profile: false,
          password: false
        }
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => {
      const newState = {
        ...prev,
        values: {
          ...prev.values,
          [field]: value
        }
      };

      // Update dirty states
      if (field === 'name') {
        newState.dirty = {
          ...prev.dirty,
          profile: newState.values.name !== prev.original.name
        };
      } else if (['currentPassword', 'newPassword', 'confirmPassword'].includes(field)) {
        newState.dirty = {
          ...prev.dirty,
          password: !!(newState.values.currentPassword || newState.values.newPassword || newState.values.confirmPassword)
        };
      }

      return newState;
    });
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`http://localhost:3001/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: formState.values.name })
      });

      if (response.ok) {
        await updateUserData();
        setFormState(prev => ({
          ...prev,
          original: {
            ...prev.original,
            name: prev.values.name
          },
          dirty: {
            ...prev.dirty,
            profile: false
          }
        }));
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (formState.values.newPassword !== formState.values.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`http://localhost:3001/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formState.values.currentPassword,
          password: formState.values.newPassword
        })
      });

      if (response.ok) {
        toast.success('Password updated successfully');
        setFormState(prev => ({
          ...prev,
          values: {
            ...prev.values,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          },
          dirty: {
            ...prev.dirty,
            password: false
          }
        }));
      } else {
        toast.error('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input 
              value={formState.values.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={user?.email || ''} disabled />
          </div>
          <Button 
            onClick={handleUpdateProfile}
            disabled={loading || !formState.dirty.profile}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input 
              type="password"
              value={formState.values.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input 
              type="password"
              value={formState.values.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input 
              type="password"
              value={formState.values.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            />
          </div>
          <Button 
            variant="secondary" 
            disabled={loading || !formState.dirty.password}
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
