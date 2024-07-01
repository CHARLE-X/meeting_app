'use client'
// pages/dashboard/settings.tsx

import React, { useState } from 'react';
import styles from '@/app/styles/settings.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Settings: React.FC = () => {
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleUsernameSave = (event: React.FormEvent) => {
    event.preventDefault();
    // Placeholder for saving new username to the database
    console.log('New username:', newName);
    alert('Username changed successfully!');
  };

  const handlePasswordSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    // Placeholder for saving new password to the database
    console.log('Current password:', currentPassword);
    console.log('New password:', newPassword);
    alert('Password changed successfully!');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Settings</h1>
      <form onSubmit={handleUsernameSave} className={styles.formGroup}>
        <h2 className={styles.subHeading}>Change Name</h2>
        <input
          type="text"
          placeholder="New Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.saveButton}>
          Save
        </button>
      </form>
      <form onSubmit={handlePasswordSave} className={styles.formGroup}>
        <h2 className={styles.subHeading}>Change Password</h2>
        <div className={styles.passwordField}>
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={styles.input}
            required
          />
          <span
            className={styles.togglePassword}
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className={styles.passwordField}>
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            required
          />
          <span
            className={styles.togglePassword}
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className={styles.passwordField}>
          <input
            type={showConfirmNewPassword ? 'text' : 'password'}
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className={styles.input}
            required
          />
          <span
            className={styles.togglePassword}
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
          >
            {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button type="submit" className={styles.saveButton}>
          Save
        </button>
      </form>
    </div>
  );
};

export default Settings;
