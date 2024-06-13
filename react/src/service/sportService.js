import axios from 'axios';

// 환경 변수에서 API URL을 가져옴
const API_URL = process.env.REACT_APP_API_URL;

export const fetchSports = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/sports`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch sports:', error);
        throw error;
    }
};

export const fetchSportById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/sports/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch sport by ID:', error);
        throw error;
    }
};
