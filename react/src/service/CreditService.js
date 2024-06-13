import axios from 'axios';

const BASE_URL = 'http://localhost:8005'; // Spring Boot 서버의 포트

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const CreditService = {
  addCredit: async (memberId, amount) => {
    try {
      const response = await axiosInstance.post('/credit/add', { memberId, amount });
      return response.data;
    } catch (error) {
      console.error('Error adding credit:', error);
      throw error;
    }
  },
  getBalance: async (memberId) => {
    try {
      const response = await axiosInstance.get(`/credit/balance/${memberId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }
};

export default CreditService;
