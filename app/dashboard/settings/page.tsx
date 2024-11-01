'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from '@/app/contexts/UserContext';
import { toast } from 'react-toastify';
import { User, Lock, Save, KeyRound, Mail, Loader2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator"

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
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Profile Settings</CardTitle>
          </div>
          <CardDescription>
            Update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Full Name
              </label>
              <Input 
                value={formState.values.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email Address
              </label>
              <div className="flex gap-2">
                <Input value={user?.email || ''} disabled />
                <Button variant="ghost" size="icon" disabled>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleUpdateProfile}
              disabled={loading || !formState.dirty.profile}
              className="min-w-[120px]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Update your password and secure your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Current Password
              </label>
              <Input 
                type="password"
                value={formState.values.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  New Password
                </label>
                <Input 
                  type="password"
                  value={formState.values.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Confirm Password
                </label>
                <Input 
                  type="password"
                  value={formState.values.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              variant="secondary" 
              disabled={loading || !formState.dirty.password}
              onClick={handleChangePassword}
              className="min-w-[140px]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
