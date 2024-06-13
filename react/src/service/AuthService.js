import axios from 'axios';
import UserStore from '../store/UserStore'; // UserStore를 가져옵니다

const API_URL = process.env.REACT_APP_API_URL; // 스프링 서버 주소

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthService = {
  login: async (data) => {
    try {
      const response = await axiosInstance.post('/auth/login', data);
      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('id', response.data.user.id); // userId를 localStorage에 저장
        console.log('Token received:', response.data.token);
      } else {
        console.error('No access token received');
      }
      return response.data;
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  signup: async (data) => {
    try {
      const response = await axiosInstance.post('/auth/join', data);
      return response.data;
    } catch (error) {
      throw new Error('Signup failed');
    }
  },

  fetchUserData: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axiosInstance.get('/members/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user data');
    }
  },

  updateProfile: async (data) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axiosInstance.put('/members/update', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Profile update failed');
    }
  },

  logout: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axiosInstance.post(
        '/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('id'); // 로그아웃 시 userId 제거
      UserStore.reset(); // UserStore 초기화
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  },

  deleteAccount: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axiosInstance.delete('/members/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('id'); // 계정 삭제 시 userId 제거
      UserStore.reset(); // UserStore 초기화
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  },
};

export default AuthService;
