'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/Newmeeting.module.css';

interface Template {
  template_id: number;
  template_name: string;
}

const EditMeeting = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [meetingName, setMeetingName] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userIdParam = params.get('user_id');
    const meetingIdParam = params.get('meeting_id');
    if (userIdParam && meetingIdParam) {
      setUserId(userIdParam);
      setMeetingId(meetingIdParam);
    }
  }, []);

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      if (userId && meetingId) {
        try {
          console.log(`Fetching meeting details for user ID: ${userId} and meeting ID: ${meetingId}`);
          const response = await fetch(`https://3992-197-211-63-124.ngrok-free.app/meeting/${userId}?meeting_id=${meetingId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': '69420',
            },
          });

          console.log('Response status:', response.status);

          if (!response.ok) {
            throw new Error('Failed to fetch meeting details');
          }

          const data = await response.json();
          console.log('Fetched meeting details:', data);
          setMeetingName(data.name);
          setSelectedTemplate(data.template_name);
        } catch (error) {
          console.error('Error fetching meeting details:', error);
        }
      } else {
        console.log('Invalid user ID or meeting ID');
      }
    };

    fetchMeetingDetails();
  }, [userId, meetingId]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!userId) {
        console.error('User ID is not available');
        return;
      }

      try {
        const response = await fetch(`https://3992-197-211-63-124.ngrok-free.app/template/get-template?user_id=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420',
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
  }, [userId]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://3992-197-211-63-124.ngrok-free.app/meeting/edit-meeting/${meetingId}?name=${meetingName}&template_name=${selectedTemplate}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
        },
      });

      if (response.ok) {
        console.log('Meeting updated successfully');
        router.push(`/dashboard/meetingdetails?user_id=${userId}&meeting_id=${meetingId}`);
      } else {
        console.error('Error updating meeting');
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };

  return (
    <form onSubmit={handleSave} className={styles.container}>
      <h1 className={styles.head}>Edit Meeting</h1>
      <div className={styles.formRow}>
        <input
          type="text"
          placeholder="Meeting title"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          className={styles.input}
        />
        <select 
          value={selectedTemplate} 
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className={styles.select}
        >
          <option value="">Select Template</option>
          {templates.map(template => (
            <option key={template.template_id} value={template.template_name}>
              {template.template_name}
            </option>
          ))}
        </select>
      </div>
      <button className={styles.saveButton}>Save</button>
    </form>
  );
};

export default EditMeeting;
