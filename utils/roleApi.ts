import { getToken } from './auth';

export const fetchRoles = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const token = getToken();
      const response = await fetch(`${backendUrl}/api/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  };