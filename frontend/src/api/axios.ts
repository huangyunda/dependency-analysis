import axios from 'axios';
import qs from 'qs';

const instance = axios.create({
  baseURL: 'http://localhost:2345/',
  timeout: 10000,
});

instance.interceptors.response.use(function (response) {
  const { success, message, data } = response.data;
  if (!success) {
    return Promise.reject(message);
  }
  return data;
});

export const get = (url: string, params?: object) => instance.get(`${url}?${qs.stringify(params)}`);
export const post = (url: string, params?: object) => instance.post(url, params);
