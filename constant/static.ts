// constants/static.tsx
export const BASE_URL = 'https://3992-197-211-63-124.ngrok-free.app';

export const API_ENDPOINTS = {
  SIGNUP: `${BASE_URL}/user/signup`,
  LOGIN: `${BASE_URL}/user/login`,
  TRANSCRIBE_AUDIO: `${BASE_URL}/meeting/transcribe-audio`,
  DOWNLOAD_TRANSCRIPTION: `${BASE_URL}/meeting/transcription/download`,
  GENERATE_ANSWERS: `${BASE_URL}/meeting/generate-answers`,
  GET_TEMPLATES: `${BASE_URL}/template/get-template`,
  GET_MEETING: `${BASE_URL}/meetings/user/`,
  TEMP_UPLOAD_AUDIO: 'https://3992-197-211-63-124.ngrok-free.app/meeting/upload-audio',
  DELETE_TEMP_AUDIO: 'https://3992-197-211-63-124.ngrok-free.app/meeting/delete-audio?temp_audio_path',
  FINAL_UPLOAD_AUDIO: 'https://3992-197-211-63-124.ngrok-free.app/meeting/create-meeting-with-audio',
  NEW_TEMPLATE:`${BASE_URL}/template/create-template`,
  GET_VIEWTEMPLATE: 'https://3992-197-211-63-124.ngrok-free.app/template/user',
  ADD_QUESTION: 'https://3992-197-211-63-124.ngrok-free.app/template/add-question',
  DELETE_QUESTION: 'https://3992-197-211-63-124.ngrok-free.app/template/delete-question',
  UPDATE_TEMPLATE: 'https://3992-197-211-63-124.ngrok-free.app/template/update-template',
  MEETING_DETAILS: (userId: number, meetingId: number) => `https://3992-197-211-63-124.ngrok-free.app/meeting/${userId}?meeting_id=${meetingId}`,
};
