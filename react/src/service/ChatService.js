import axios from 'axios';

const BASE_URL =process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getChatRoomByPostId = async (postId) => {
  if (!postId) {
    throw new Error('Post ID is undefined');
  }
  const token = localStorage.getItem('accessToken');
  const response = await axiosInstance.get(`/chat/room/by-post/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const createChatRoom = async (postId) => {
  if (!postId) {
    throw new Error('Post ID is undefined');
  }
  const token = localStorage.getItem('accessToken');
  const response = await axiosInstance.post(`/chat/room`, { postId }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getMessagesByRoomId = async (chatRoomId) => {
  if (!chatRoomId) {
    throw new Error('Chat Room ID is undefined');
  }
  const response = await axiosInstance.get(`/chat/chatroom/${chatRoomId}/messages`);
  return response;
};

export const sendMessageToRoom = async (chatRoomId, message) => {
  if (!chatRoomId) {
    throw new Error('Chat Room ID is undefined');
  }
  const response = await axiosInstance.post(`/chat/${chatRoomId}/send`, message);
  return response;
};

export const getChatRoomMembers = async (chatRoomId) => {
  if (!chatRoomId) {
    throw new Error('Chat Room ID is undefined');
  }
  const response = await axiosInstance.get(`/chat/chatroom/${chatRoomId}/user`);
  return response;
};

export const leaveChatRoom = async (chatRoomId, memberId) => {
  if (!chatRoomId || !memberId) {
    throw new Error('Chat Room ID or Member ID is undefined');
  }
  const response = await axiosInstance.delete(`/chat/${chatRoomId}/leave/${memberId}`);
  return response;
};
