import axios from 'axios';
import useStore from './store/useStore';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8800/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    let token = useStore.getState().token;
    if (!token) {
       // fallback manual retrieval
       try {
         const storage = JSON.parse(localStorage.getItem('novas-storage'));
         if (storage && storage.state && storage.state.token) {
            token = storage.state.token;
         }
       } catch (e) {}
    }
    
    if (token) {
      config.headers['token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`; // standard headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
