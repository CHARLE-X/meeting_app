// pages/dashboard/meetingdetails.tsx
'use client'
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaMicrophone, FaEdit } from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { FiDownloadCloud } from 'react-icons/fi';
import styles from '@/app/styles/MeetingDetails.module.css';
import Link from 'next/link';

const MeetingDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const meetingId = searchParams.get('meeting_id');
  const meetingTitle = searchParams.get('title') || 'Unknown Meeting';
  const template = searchParams.get('template') || 'No Template';
  const fileName = searchParams.get('fileName') || 'No File Uploaded';

  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [transcriptionDone, setTranscriptionDone] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState<string>('');

  

  const handleEdit = () => {
    router.push('/dashboard/newmeeting');
  };

  const handleTranscribe = async () => {
    if (!meetingId) {
      console.error('Meeting ID not found.');
      return;
    }

    setTranscribing(true);
    setTranscriptionProgress(0);

    try {
      // Call the transcription endpoint with meeting_id
      const response = await fetch(`https://d35d-197-211-53-14.ngrok-free.app/meeting/transcribe-audio/${meetingId}`);

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      console.log('Transcription Data:', data);

      // Simulate transcription progress
      const interval = setInterval(() => {
        setTranscriptionProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTranscribing(false);
            setTranscriptionDone(true);
            setTranscriptionText(data.transcription_text); // Assuming endpoint returns transcription text
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

      const response = await fetch(`https://d35d-197-211-53-14.ngrok-free.app/meeting/transcription/download/${meetingId}`);

      if (!response.ok) {
        throw new Error('Failed to download transcription text');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${meetingTitle}_transcription.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading transcription text:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{meetingTitle}</h1>
      <div className={styles.section}>
        <h3 className={styles.subheading}>Uploaded File</h3>
        <div className={styles.detail}>
          <FaMicrophone className={styles.icon} />
          <span>{fileName}</span>
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.subheading}>Question Template</h3>
        <div className={styles.detail}>
          <MdDescription className={styles.icon} />
          <span>{template}</span>
          <FaEdit className={styles.editIcon} onClick={handleEdit} />
        </div>
      </div>
      <button onClick={handleTranscribe} className={styles.transcribeButton} disabled={transcribing}>
        {transcribing ? 'Transcribing...' : 'Transcribe'}
      </button>
      {transcribing && (
        <div className={styles.progressSection}>
          <p className={styles.trans}>Transcribing...</p>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${transcriptionProgress}%` }}
            ></div>
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
