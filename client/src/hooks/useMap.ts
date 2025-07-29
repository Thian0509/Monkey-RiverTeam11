import { useState, useEffect } from 'react';

export const useMap = () => {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const token = localStorage.getItem('token'); // or sessionStorage
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch('/api/destinations', {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch map data');
        }
        console.log('Fetching map data from /api/destinations'); // Debugging line
        const data = await response.json();
        console.log('Map data fetched:', data); // Debugging line to check fetched data
        setMapData(data);
      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  return { mapData, loading };
}