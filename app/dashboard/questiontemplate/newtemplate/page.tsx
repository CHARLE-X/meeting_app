"use client";
// pages/dashboard/createtemplate.tsx

import React, { useState } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import styles from '@/app/styles/newtemplate.module.css';
import { useUser } from '@/app/context/UserContext';
import { API_ENDPOINTS } from '@/constant/static';

const CreateNewTemplate: React.FC = () => {
  const [templateName, setTemplateName] = useState('');
  const [questions, setQuestions] = useState(['', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useUser(); // Retrieve the user from the context

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, '']);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    // Ensure user is not null before accessing user.id
    if (!user || !user.id) {
      setError('User not authenticated'); // Handle scenario where user is null
      return;
    }

    const templateData = {
      user_id: user.id, // Ensure user.id is provided
      template_name: templateName,
      questions: questions.map(question => ({ question_text: question })),
    };

    try {
      const response = await fetch(API_ENDPOINTS.NEW_TEMPLATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      setSuccess('Template saved successfully!');
      setError(null);

      // Clear the form
      setTemplateName('');
      setQuestions(['', '', '']);
    } catch (error: any) {
      console.error('Error:', error); // Log the actual error to the console
      setError(error.message || 'Failed to fetch');
      setSuccess(null);
    }
  };

  return (
    <form onSubmit={handleSave} className={styles.container}>
      <h1 className={styles.heading}>Create New Template</h1>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <input
        type="text"
        placeholder="Template Name"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        className={styles.input}
        required
      />
      <h2 className={styles.subheading}>
        Add Questions <FaPlus className={styles.addIcon} onClick={handleAddQuestion} />
      </h2>
      {questions.map((question, index) => (
        <div key={index} className={styles.questionRow}>
          <input
            type="text"
            placeholder={`Question ${index + 1}`}
            value={question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            className={styles.input}
            required
          />
          <FaTrashAlt className={styles.deleteIcon} onClick={() => handleDeleteQuestion(index)} />
        </div>
      ))}
      <button type="submit" className={styles.saveButton}>Save</button>
    </form>
  );
};

export default CreateNewTemplate;
