'use client';
// pages/dashboard/edittemplate.tsx

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/styles/edittemplate.module.css';
import { FaTrashAlt } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { useUser } from '@/app/context/UserContext';
import { API_ENDPOINTS } from '@/constant/static';

interface Question {
  id: number;
  question_text: string;
}

interface TemplateData {
  id: number;
  template_name: string;
  questions: Question[];
}

const EditTemplate: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template_id');

  const [templateName, setTemplateName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
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

        const data: TemplateData = await response.json();
        setTemplateName(data.template_name);
        setQuestions(data.questions);
      } catch (error) {
        console.error('Error fetching template data:', error);
        setError('Failed to fetch template data');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateData();
  }, [user, templateId]);

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], question_text: value };
    setQuestions(newQuestions);
  };

  const handleAddQuestion = async () => {
    if (!templateId || !templateName) {
      alert('Template ID and name are required to add a question.');
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.ADD_QUESTION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
        },
        body: JSON.stringify({ template_id: templateId, question_text: '' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to add question:', errorText);
        throw new Error(`Failed to add question: ${response.status} ${response.statusText}`);
      }

      const newQuestion: Question = await response.json();
      setQuestions([...questions, newQuestion]);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleDeleteQuestion = async (index: number) => {
    const questionId = questions[index].id;
    console.log(questionId);

    if (questionId) {
      try {
        const response = await fetch(`${API_ENDPOINTS.DELETE_QUESTION}/template/delete-question/${templateId}/${questionId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420',
          },
          body: JSON.stringify({ template_id: templateId, question_id: questionId }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to delete question:', errorText);
          throw new Error(`Failed to delete question: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }

    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    const requestBody = {
      id: Number(templateId),
      template_name: templateName,
      add_questions: [],
      update_questions: questions.map((q) => ({ id: q.id, question_text: q.question_text })),
      delete_question_ids: [],
    };

    console.log('Request body:', requestBody); // Log the request body for debugging

    try {
      const response = await fetch(`${API_ENDPOINTS.UPDATE_TEMPLATE}/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update template:', errorText);
        throw new Error(`Failed to update template: ${response.status} ${response.statusText}`);
      }

      alert('Template updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating template:', error);
      setError('Failed to update template');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <form onSubmit={handleSave} className={styles.container}>
      <h1 className={styles.heading}>Edit Template</h1>
      <div className={styles.formGroup}>
        <label className={styles.label}>Template Name</label>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <div className={styles.questionsHeader}>
          <label className={styles.label}>Questions</label>
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddQuestion}
          >
            Add Question <FiPlus className={styles.addIcon} />
          </button>
        </div>
        {questions.map((question, index) => (
          <div key={question.id} className={styles.questionRow}>
            <input
              type="text"
              value={question.question_text}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              className={styles.input}
              required
            />
            <FaTrashAlt
              className={styles.deleteIcon}
              onClick={() => handleDeleteQuestion(index)}
            />
          </div>
        ))}
      </div>
      <button type="submit" className={styles.saveButton}>Save</button>
    </form>
  );
};

const EditTemplateWithSuspense: React.FC = () => (
  <Suspense fallback={<p>Loading...</p>}>
    <EditTemplate />
  </Suspense>
);

export default EditTemplateWithSuspense;
