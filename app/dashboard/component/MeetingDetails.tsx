// MeetingDetails.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaMicrophone } from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import styles from '@/app/styles/MeetingDetails.module.css';
import { API_ENDPOINTS } from '@/constant/static';
import Link from 'next/link';
import { FiDownloadCloud } from 'react-icons/fi';

interface Question {
  id: number;
  question_text: string;
}

interface Template {
  id: number;
  template_name: string;
  questions: Question[];
}

interface Meeting {
  user_id: number;
  id: number;
  name: string;
  template: Template;
  recording_file_path: string;
  transcript_file_path: string;
}

const MeetingDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('user_id');
  const meetingIdParam = searchParams.get('meeting_id');
  const userId = userIdParam ? parseInt(userIdParam, 10) : null;
  const meetingId = meetingIdParam ? parseInt(meetingIdParam, 10) : null;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [transcriptionDone, setTranscriptionDone] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState<string>('');

  useEffect(() => {
    if (userId && meetingId) {
      const fetchMeetingDetails = async () => {
        try {
          const response = await fetch(`${API_ENDPOINTS.GET_MEETING}/${userId}?meeting_id=${meetingId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': '69420',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch meeting details');
          }

          const data = await response.json();
          setMeeting(data);
        } catch (error) {
          console.error('Error fetching meeting details:', error);
        }
      };

      fetchMeetingDetails();
    }
  }, [userId, meetingId]);

  const handleTranscribe = async () => {
    if (!meetingId) {
      console.error('Meeting ID not found.');
      return;
    }

    setTranscribing(true);
    setTranscriptionProgress(0);

    try {
      const response = await fetch(API_ENDPOINTS.TRANSCRIBE_AUDIO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meeting_id: meetingId }),
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      const interval = setInterval(() => {
        setTranscriptionProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTranscribing(false);
            setTranscriptionDone(true);
            setTranscriptionText(data.transcription_text);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setTranscribing(false);
      setTranscriptionProgress(0);
    }
  };

  const handleDownloadText = async () => {
    try {
      if (!meetingId) {
        console.error('Meeting ID not found.');
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.DOWNLOAD_TRANSCRIPTION}/${meetingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download transcription text');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${meeting?.name}_transcription.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading transcription text:', error);
    }
  };

  if (!meeting) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{meeting.name}</h1>
      <div className={styles.section}>
        <h3 className={styles.subheading}>Uploaded File</h3>
        <div className={styles.detail}>
          <FaMicrophone className={styles.icon} />
          <span>{meeting.recording_file_path}</span>
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.subheading}>Template Name</h3>
        <div className={styles.detail}>
          <MdDescription className={styles.icon} />
          <span>{meeting.template.template_name}</span>
        </div>
      </div>
      <button onClick={handleTranscribe} className={styles.transcribeButton} disabled={transcribing}>
        {transcribing ? 'Transcribing...' : 'Transcribe'}
      </button>
      {transcribing && (
        <div className={styles.progressSection}>
          <p className={styles.trans}>Transcribing...</p>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${transcriptionProgress}%` }}></div>
          </div>
          <p>{transcriptionProgress}%</p>
        </div>
      )}
      {transcriptionDone && (
        <>
          <div className={styles.downloadSection} onClick={handleDownloadText}>
            <FiDownloadCloud className={styles.downloadIcon} />
            <p className={styles.download}>Click to download text</p>
          </div>
          <Link href={`/dashboard/answers?meetingId=${meetingId}`} legacyBehavior>
            <button className={styles.generateButton}>Generate Answers</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default MeetingDetails;
