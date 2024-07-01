'use client'
import { useRouter } from 'next/navigation';

const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    // Remove the authentication token (adjust based on where you store it)
    localStorage.removeItem('authToken');
    
    // Redirect to login page
    router.push('/');
  };

  return logout;
};

export default useLogout;
