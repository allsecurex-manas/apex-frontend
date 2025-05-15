// src/api/api.js

import axios from 'axios';

const API_BASE_URL = "https://apex.allsecurex.com"; // ✅ your backend domain (public EC2)

export const fetchDashboardData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/dashboard-summary`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
};
