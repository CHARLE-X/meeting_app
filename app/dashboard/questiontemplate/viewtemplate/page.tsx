'use client';
// pages/dashboard/viewtemplate.tsx

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/styles/viewtemplate.module.css';
import { FaSearch } from 'react-icons/fa';
import { useUser } from '@/app/context/UserContext';
import { API_ENDPOINTS } from '@/constant/static';

interface Question {
  id: number;
  question_text: string;
}

interface TemplateData {
  template_name: string;
  questions: Question[];
}

const ViewTemplateContent: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template_id');

  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (!user || !templateId) {
        setError('User or template ID is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_ENDPOINTS.GET_VIEWTEMPLATE}/${user.id}/${templateId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch template data:', errorText);
          throw new Error(`Failed to fetch template data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setTemplateData({
          template_name: data.template_name,
          questions: data.questions,
        });
      } catch (error) {
        console.error('Error fetching template data:', error);
        setError('Failed to fetch template data');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateData();
  }, [user, templateId]);

  const filteredQuestions = templateData?.questions.filter((question) => {
    if (typeof question.question_text !== 'string') {
      console.error('Question text is not a string:', question);
      return false;
    }
    return question.question_text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!templateData) {
    return <p>No template data found</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{templateData.template_name}</h1>
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
      {filteredQuestions?.map((question, index) => (
        <div key={index} className={styles.question}>
          <h2 className={styles.subheading}>{`Question ${index + 1}`}</h2>
          <p>{question.question_text}</p>
        </div>
      ))}
    </div>
  );
};

const ViewTemplate: React.FC = () => {
  return (
    <Suspense fallback={<p>Loading template...</p>}>
      <ViewTemplateContent />
    </Suspense>
  );
};

export default ViewTemplate;
