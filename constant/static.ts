// constants/static.tsx
export const BASE_URL = 'https://d23e-2c0f-2a80-63-9a10-e8c1-bb27-6201-ff6e.ngrok-free.app';

export const API_ENDPOINTS = {
  SIGNUP: `${BASE_URL}/user/signup`,
  LOGIN: `${BASE_URL}/user/login`,
  TRANSCRIBE_AUDIO: `${BASE_URL}/meeting/transcribe-audio`,
  DOWNLOAD_TRANSCRIPTION: `${BASE_URL}/meeting/transcription/download`,
  GENERATE_ANSWERS: `${BASE_URL}/meeting/generate-answers`,
  GET_TEMPLATES: `${BASE_URL}/template/get-template`,
  GET_MEETING: `${BASE_URL}/meetings/user/`,
  TEMP_UPLOAD_AUDIO: 'https://d23e-2c0f-2a80-63-9a10-e8c1-bb27-6201-ff6e.ngrok-free.app/meeting/upload-audio',
  DELETE_TEMP_AUDIO: 'https://d23e-2c0f-2a80-63-9a10-e8c1-bb27-6201-ff6e.ngrok-free.app/meeting/delete-audio?temp_audio_path',
  FINAL_UPLOAD_AUDIO: 'https://d23e-2c0f-2a80-63-9a10-e8c1-bb27-6201-ff6e.ngrok-free.app/meeting/create-meeting-with-audio',
  NEW_TEMPLATE:`${BASE_URL}/template/create-template`,
  GET_VIEWTEMPLATE: 'https://d23e-2c0f-2a80-63-9a10-e8c1-bb27-6201-ff6e.ngrok-free.app/template/user',
  ADD_QUESTION: 'https://d23e-2c0f-2a80-63-9a10-e8c1-bb27-6201-ff6e.ngrok-free.app/template/add-question',
  DELETE_QUESTION: 'https://d23e-2c0f-2a80-63-9a10-e8c1-bb27-6201-ff6e.ngrok-free.app',
  UPDATE_TEMPLATE: 'https://d23e-2c0f-2a80-63-9a10-e8c1-bb27-6201-ff6e.ngrok-free.app/template',
  EDIT_MEETING:'https://d23e-2c0f-2a80-63-9a10-e8c1-bb27-6201-ff6e.ngrok-free.app/meeting/edit-meeting', // Add this line,
  VIEW_MEETING:'https://d23e-2c0f-2a80-63-9a10-e8c1-bb27-6201-ff6e.ngrok-free.app/meeting'
  // MEETING_DETAILS: (userId: number, meetingId: number) => `https://3992-197-211-63-124.ngrok-free.app/meeting/${userId}?meeting_id=${meetingId}`,
};
