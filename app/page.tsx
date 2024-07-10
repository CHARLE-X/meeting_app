'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/router
import { useUser } from '@/app/context/UserContext'; // Assuming this is correctly imported
import styles from '@/app/styles/Login.module.css';
import Link from 'next/link';
import { API_ENDPOINTS } from '@/constant/static';

const Login: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUser(); // Assuming useUser hook provides setUser function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Define error state as string or null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN ,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }), // Use email and password directly
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      
      const data = await response.json();
      console.log('Response Data:', data);

      localStorage.setItem('token', data.access_token);
      setUser({ id: data.user_id, email });

      // Redirect to the dashboard with user_id as query parameter
      router.push(`/dashboard?user_id=${data.user_id}`);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Welcome Back</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
            id="email"
            name="email"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            id="password"
            name="password"
          />
          <p className={styles.text}>Forgot Password</p>
          <button type="submit" className={styles.loginButton}>
            Log In
          </button>
          <p className={styles.text}>Don&apos;t have an account?</p>
          <Link href="/register" legacyBehavior>
            <a className={styles.signButton}>Sign Up</a>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
