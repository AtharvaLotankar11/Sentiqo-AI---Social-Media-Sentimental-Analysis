import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/auth';

export const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register/`, {
    username,
    email,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login/`, {
    username,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  const user = getCurrentUser();
  return user ? user.token : null;
};

export const getProfile = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/auth/profile/', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axios.post('http://127.0.0.1:8000/api/auth/profile/update/', data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const resetPassword = async (password) => {
  const response = await axios.post('http://127.0.0.1:8000/api/auth/password/reset/', { password }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};
