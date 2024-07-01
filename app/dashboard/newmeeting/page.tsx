'use client';
import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { FiUploadCloud } from 'react-icons/fi';
import styles from '@/app/styles/Newmeeting.module.css';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

interface Template {
  template_id: number;
  template_name: string;
}

const NewMeeting: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showReminder, setShowReminder] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [recordingFilePath, setRecordingFilePath] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!meetingTitle) {
      alert('Please enter the meeting title first.');
      return;
    }

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        setUploadProgress(0);
        setUploading(true);
        setShowReminder(false);

        // Upload the audio file
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`https://d35d-197-211-53-14.ngrok-free.app/meeting/upload-audio/${encodeURIComponent(meetingTitle)}`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to upload file:', errorText);
            throw new Error('Failed to upload file');
          }

          const data = await response.json();
          setRecordingFilePath(data.recording_file_path);
          console.log('File uploaded successfully:', data);

          setUploading(false);
        } catch (error) {
          console.error('Error uploading file:', error);
          setUploading(false);
        }
      } else {
        alert('Please upload an audio file.');
      }
    }
  };

  const handleFileDelete = () => {
    setSelectedFile(null);
    setRecordingFilePath(null);
    setUploadProgress(0);
    setUploading(false);
    setShowReminder(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!recordingFilePath) {
      setShowReminder(true);
      return;
    }
    if (!user || !user.id) {
      alert('User is not authenticated.');
      return;
    }

    // Prepare meeting data
    const meetingData = {
      name: meetingTitle,
      template_name: selectedTemplate,
      user_id: user.id,
      recording_file_path: recordingFilePath,
    };

    try {
      const response = await fetch('https://d35d-197-211-53-14.ngrok-free.app/meeting/create-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to save meeting:', errorText);
        throw new Error('Failed to save meeting');
      }

      alert('Meeting saved successfully!');
      router.push(`/dashboard/meetingdetails?title=${encodeURIComponent(meetingTitle)}&template=${encodeURIComponent(selectedTemplate)}&fileName=${encodeURIComponent(selectedFile!.name)}`);
    } catch (error) {
      console.error('Error saving meeting:', error);
      alert('Error saving meeting');
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('https://d35d-197-211-53-14.ngrok-free.app/template/user');
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch templates:', errorText);
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        console.log('Fetched templates:', data);
        setTemplates(data.templates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <form onSubmit={handleSave} className={styles.container}>
      <h1 className={styles.head}>New Meeting</h1>
      <div className={styles.formRow}>
        <input
          type="text"
          placeholder="Meeting title"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          className={styles.input}
          required
        />
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className={styles.select}
          required
        >
          <option value="">Select Template</option>
          {templates.map((template) => (
            <option key={template.template_id} value={template.template_name}>
              {template.template_name}
            </option>
          ))}
           {/* <option value="1">Product</option>  */}
        </select>
      </div>
      <div className={styles.uploadSection}>
        <p className={styles.selectfile}>Click the icon to upload file</p>
        <label className={styles.uploadLabel}>
          <FiUploadCloud className={styles.uploadIcon} />
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className={styles.fileInput}
            required
          />
        </label>
        {selectedFile && (
          <div className={styles.fileDetails}>
            <p>{selectedFile.name}</p>
            <FaTrashAlt className={styles.deleteIcon} onClick={handleFileDelete} />
          </div>
        )}
        {showReminder && !selectedFile && (
          <p className={styles.reminderText}>Please upload a file to continue</p>
        )}
      </div>
      {uploading && (
        <div className={styles.progressSection}>
          <p className={styles.uploadinggg}>File uploading...</p>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p>{uploadProgress}%</p>
        </div>
      )}
      <button type="submit" className={styles.saveButton}>
        Save
      </button>
    </form>
  );
};

export default NewMeeting;
