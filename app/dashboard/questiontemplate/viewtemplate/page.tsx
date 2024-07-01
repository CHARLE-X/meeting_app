'use client';
// pages/dashboard/viewtemplate.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/viewtemplate.module.css';
import { FaSearch, FaEdit, FaEye } from 'react-icons/fa';

const dummyData = {
  templateName: 'Product Design',
  questions: [
    'What is your design philosophy?',
    'How do you handle design critiques?',
    'Describe a challenging design project you worked on.',
  ],
};

const ViewTemplate: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = dummyData.questions.filter((question) =>
    question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{dummyData.templateName}</h1>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search questions"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}

        />
       <FaSearch className={styles.searchIcon} />
      </div>
      {filteredQuestions.map((question, index) => (
        <div key={index} className={styles.question}>
          <h2 className={styles.subheading}>{`Question ${index + 1}`}</h2>
          <p>{question}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewTemplate;
