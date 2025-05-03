import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stories-off.vercel.app/api';

export const submitData = async (data: {
  userId: string;
  inputText: string;
  style: string;
  responses: string[];
}) => {
  try {
    const response = await axios.post(`${API_URL}/submit`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting data:', error);
    throw new Error(error.response?.data?.error || 'Failed to submit data');
  }
}; 