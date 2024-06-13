import axios from 'axios';
import AuthService from './AuthService';

const API_URL = process.env.REACT_APP_API_URL;

const sendRequest = async (url, data = null, accessToken = null, method = 'get') => {
  try {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    const response = await axios({
      url: `${API_URL}${url}`,
      method,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Request failed: ${url}`, error);
    throw error;
  }
};

const UserService = {
  updateUser: async (userData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      return sendRequest('/members/update', userData, accessToken, 'put');
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  deleteUser: async (num) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      return sendRequest(`/members/delete/${num}`, null, accessToken, 'delete');
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },

  getUser: async (num) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const userData = await sendRequest(`/members/get/${num}`, null, accessToken);
      console.log('Fetched user data:', userData); // 데이터 로그 확인
      return userData;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      return sendRequest('/members/get/all', null, accessToken);
    } catch (error) {
      console.error('Failed to fetch all users:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      return sendRequest('/members/me', null, accessToken);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  },

  getCurrentUserPosts: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const currentUser = await UserService.getCurrentUser();
      return sendRequest(`/members/${currentUser.mno}/posts`, null, accessToken);
    } catch (error) {
      console.error('Failed to fetch current user posts:', error);
      throw error;
    }
  },

  getCurrentUserChatRooms: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const currentUser = await UserService.getCurrentUser();
      return sendRequest(`/members/${currentUser.mno}/chatrooms`, null, accessToken);
    } catch (error) {
      console.error('Failed to fetch current user chat rooms:', error);
      throw error;
    }
  },

  setCurrentUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  setCurrentUserToken: (token) => {
    localStorage.setItem('accessToken', token);
  },

  logout: async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  },

  deleteAccount: async () => {
    try {
      await AuthService.deleteAccount();
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  },
};

export default UserService;
