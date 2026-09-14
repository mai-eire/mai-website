import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by looking for a token in localStorage
    const checkAuth = () => {
      const authToken = localStorage.getItem('adminAuthToken');
      setIsAuthenticated(!!authToken);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return null; // Or a loading spinner if you prefer
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute; 