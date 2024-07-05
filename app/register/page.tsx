'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/app/styles/Login.module.css';
import { API_ENDPOINTS } from '@/constant/static';

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420', // Bypass ngrok warning
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      setSuccess('Registration successful. Redirecting to login...');
      setError('');
      
      // Clear the form
      setName('');
      setEmail('');
      setPassword('');
      setAgree(false);

      // Redirect to the login page after a delay
      setTimeout(() => {
        router.push('/');
      }, 2000); // Adjust the delay as needed
    } catch (error: any) {
      setError(error.message || 'Failed to fetch');
      setSuccess('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Create Account</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className={styles.checkbox}
              required
            />
            <span className={styles.checkboxText}>
              By clicking Sign Up, you agree to the account terms of service and privacy policy
            </span>
          </div>
          <button type="submit" className={styles.registerButton}>Sign up</button>
          <Link href="/" legacyBehavior>
            <a className={styles.signButton}>Log in</a>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
