import axios from 'axios';

const BASE_URL = 'http:/192.168.100.206:8000/api/v1/datakunjungan'; // Change to your backend URL

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    // Log full error for debugging purposes
    console.error(error);

    // If the error is a network issue (e.g., no connection)
    if (!error.response) {
      return { status: 'error', message: 'Network error. Please check your internet connection.' };
    }

    // If the backend returns a response (e.g., invalid credentials or server error)
    return { status: 'error', message: error.response.data.message || 'An error occurred' };
  }
};
