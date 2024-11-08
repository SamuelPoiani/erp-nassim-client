import { getToken } from './auth';

export const fetchRoles = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:3001/api/roles', {
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