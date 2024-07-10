'use client';
import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { FiUploadCloud } from 'react-icons/fi';
import styles from '@/app/styles/Newmeeting.module.css';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import { API_ENDPOINTS } from '@/constant/static';

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
  const [selectedTemplateID, setSelectedTemplateID] = useState<number | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [recordingFilePath, setRecordingFilePath] = useState<string | null>(null);
  const [meetingID, setMeetingID] = useState<number | null>(null);
  const router = useRouter();
  const { user } = useUser();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!meetingTitle) {
      alert('Please enter the meeting title first.');
      return;
    }

    if (!user) {
      alert('User not found. Please log in.');
      return;
    }

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        setUploadProgress(0);
        setUploading(true);
        setShowReminder(false);

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', API_ENDPOINTS.TEMP_UPLOAD_AUDIO, true);
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 201 || xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setRecordingFilePath(response.temp_audio_path);
            console.log('Temporary audio file path:', response.temp_audio_path);
            setUploading(false);
            alert('File uploaded successfully!');
          } else {
            console.error('Failed to upload file:', xhr.responseText);
            alert('Error uploading file');
            setUploading(false);
          }
        };

        xhr.onerror = () => {
          console.error('Error uploading file:', xhr.responseText);
          alert('Error uploading file');
          setUploading(false);
        };

        xhr.send(formData);
      } else {
        alert('Please upload an audio file.');
      }
    }
  };

  const handleFileDelete = async () => {
    if (!recordingFilePath) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.DELETE_TEMP_AUDIO}=${encodeURIComponent(recordingFilePath)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to delete audio:', errorText);
        throw new Error('Failed to delete audio');
      }

      setSelectedFile(null);
      setRecordingFilePath(null);
      setUploadProgress(0);
      setUploading(false);
      setShowReminder(true);
      alert('Audio deleted successfully!');
    } catch (error) {
      console.error('Error deleting audio:', error);
      alert('Error deleting audio');
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!recordingFilePath || !meetingTitle || !selectedTemplateID || !user) {
      alert('Please fill in all fields and upload a file.');
      setShowReminder(true);
      return;
    }

    const requestBody = {
      user_id: user.id,
      name: meetingTitle,
      template_name: selectedTemplate,
      temp_audio_path: recordingFilePath,
    };

    console.log('Request Body:', requestBody);

    try {
      const response = await fetch(API_ENDPOINTS.FINAL_UPLOAD_AUDIO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create meeting:', errorText);
        throw new Error('Failed to create meeting');
      }

      const data = await response.json();
      setMeetingID(data.meeting.meeting_id);
      alert('Meeting created successfully!');
      router.push(`/dashboard/meetingdetails?user_id=${user.id}&meeting_id=${data.meeting.meeting_id}`);
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Error creating meeting');
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user || typeof user.id !== 'number' || isNaN(user.id)) {
        console.error('User ID is not a valid integer:', user);
        return;
      }

      try {
        const response = await fetch(`${API_ENDPOINTS.GET_TEMPLATES}?user_id=${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "ngrok-skip-browser-warning": "69420",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch templates:', errorText);
          throw new Error('Failed to fetch templates');
        }

        const data = await response.json();
        console.log('Fetched templates:', data);
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, [user]);

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
          onChange={(e) => {
            setSelectedTemplate(e.target.value);
            const selected = templates.find(t => t.template_name === e.target.value);
            setSelectedTemplateID(selected ? selected.template_id : null);
          }}
          className={styles.select}
          required
        >
          <option value="">Select Template</option>
          {templates.map((template) => (
            <option key={template.template_id} value={template.template_name}>
              {template.template_name}
            </option>
          ))}
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
            required={!selectedFile}
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
          <p>{uploadProgress.toFixed(2)}%</p>
        </div>
      )}
      
      <button type="submit" className={styles.saveButton}>
        Save
      </button>
    </form>
  );
};

export default NewMeeting;
