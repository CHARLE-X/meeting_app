'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '@/app/styles/answers.module.css';
import { API_ENDPOINTS } from '@/constant/static';

interface QuestionAnswer {
  meeting_id: number;
  id: number;
  question_text: string;
  answer_text: string;
}

const AnswersComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const meetingId = searchParams.get('meetingId');
  const [qaData, setQaData] = useState<QuestionAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!meetingId) {
        setError('Invalid meeting ID');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_ENDPOINTS.GENERATE_ANSWERS}/${meetingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': '69420' // Bypass ngrok warning
          },
          body: JSON.stringify({ meeting_id: meetingId })
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

    fetchAnswers();
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

const Answers: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnswersComponent />
    </Suspense>
  );
};

export default Answers;
