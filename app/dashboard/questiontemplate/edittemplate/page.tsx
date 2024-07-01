'use client';
// pages/dashboard/edittemplate.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/edittemplate.module.css';
import { FaTrashAlt } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

const dummyData = {
  templateName: 'Product Design',
  questions: [
    'What is your design philosophy?',
    'How do you handle design critiques?',
    'Describe a challenging design project you worked on.',
  ],
};

const EditTemplate: React.FC = () => {
  const router = useRouter();
  const [templateName, setTemplateName] = useState(dummyData.templateName);
  const [questions, setQuestions] = useState(dummyData.questions);

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

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedTemplate = {
      templateName,
      questions,
    };
    console.log('Saving updated template:', updatedTemplate);
    // Placeholder for saving data to the database
    setTimeout(() => {
      alert('Template updated successfully!');
    }, 1000);
  };

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
          <div key={index} className={styles.questionRow}>
            <input
              type="text"
              value={question}
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
      <button type="submit" className={styles.saveButton}>
        Save
      </button>
    </form>
  );
};

export default EditTemplate;
