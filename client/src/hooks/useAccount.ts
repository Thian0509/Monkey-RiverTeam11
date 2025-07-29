import { useState, useEffect } from 'react';

interface GeoJsonFeature {
  type: "Feature";
  properties: {
    name: string;
    iso_a2?: string;
    name_long?: string;
  };
  geometry: any;
}

interface FormData {
  name: string;
  email: string;
  location: string;
  notificationThreshold: number;
  receiveEmailNotifications: boolean;
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'participant';
  receiveEmailNotifications: boolean;
  notificationThreshold: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export const useAccount = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationOptions, setLocationOptions] = useState<{ label: string; value: string }[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    location: '',
    notificationThreshold: 50,
    receiveEmailNotifications: false,
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  const loadGeoJsonData = async () => {
    try {
      const response = await fetch('/custom.geo.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const options = data.features.map((feature: GeoJsonFeature) => ({
        label: feature.properties.name_long || feature.properties.name,
        value: feature.properties.name_long || feature.properties.name,
      }));
      setLocationOptions(options);
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
    }
  };
  
  // Fetch account data from the server
  useEffect(() => {
      setLoading(true);
      loadGeoJsonData();
      async function fetchUser() {
        try {
          const token = localStorage.getItem('token');
  
          const res = await fetch('/api/account/me', {
            headers: {
              "Authorization": `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!res.ok) throw new Error('Failed to fetch user data');
  
          const data = await res.json();
          setUser(data);
  
          setFormData((prev) => ({
            ...prev,
            name: data.name || '',
            email: data.email || '',
            location: data.location || '',
            notificationThreshold: data.notificationThreshold || 50,
            receiveEmailNotifications: data.receiveEmailNotifications || false,
          }));
  
        } catch (err: unknown) {
          if (err instanceof Error) setError(err.message);
          else setError('Unknown error');
        } finally {
          setLoading(false);
        }
      }
  
      fetchUser();
      setLoading(false);
    }, []);

  // Function to update account data
  const updateAccountData = async (updateData: Partial<FormData>) => {
    try {
      const token = localStorage.getItem('token'); // or sessionStorage
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/users/${user?._id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(updateData),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to update account data');
      }
      const updatedData = await response.json();
      setUser((prev) => ({ ...prev, ...updatedData }));
      setFormData((prev) => ({ ...prev, ...updateData }));
    } catch (error) {
      console.error('Error updating account data:', error);
    }
  }

  return {
    user,
    loading,
    error,
    locationOptions,
    setLocationOptions,
    formData,
    setFormData,
    updateAccountData,
  };
}