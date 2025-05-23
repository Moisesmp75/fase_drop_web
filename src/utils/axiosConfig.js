import axios from 'axios';
import { getToken } from './auth';

let loadingCount = 0;
let setLoading = null;

export const setupAxiosInterceptors = (loadingContext) => {
  setLoading = loadingContext;

  axios.interceptors.request.use(
    (config) => {
      loadingCount++;
      if (setLoading) setLoading(true);
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      loadingCount--;
      if (loadingCount === 0 && setLoading) setLoading(false);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      loadingCount--;
      if (loadingCount === 0 && setLoading) setLoading(false);
      return response;
    },
    (error) => {
      loadingCount--;
      if (loadingCount === 0 && setLoading) setLoading(false);
      return Promise.reject(error);
    }
  );
}; 