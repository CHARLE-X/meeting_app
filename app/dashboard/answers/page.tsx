// pages/dashboard/answers.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '@/app/styles/Answers.module.css';

interface QuestionAnswer {
  meeting_id: number;
  id: number;
  question_text: string;
  answer_text: string;
}

const Answers: React.FC = () => {
  const searchParams = useSearchParams();
  const meetingId = searchParams.get('meetingId');
  const [qaData, setQaData] = useState<QuestionAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await fetch(`https://d35d-197-211-53-14.ngrok-free.app/meeting/generate-answers/${meetingId}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: ''
        });

        if (!response.ok) {
          throw new Error('Failed to fetch answers');
        }

        const data: QuestionAnswer[] = await response.json();
        setQaData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (meetingId) {
      fetchAnswers();
    }
  }, [meetingId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Answers</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Answers</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Answers</h1>
      {qaData.length === 0 ? (
        <p>No answers found.</p>
      ) : (
        qaData.map((qa) => (
          <div key={qa.id} className={styles.qaSection}>
            <h2 className={styles.question}>{qa.question_text}</h2>
            <p className={styles.answer}>{qa.answer_text}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Answers;
