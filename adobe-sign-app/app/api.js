import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.eu1.echosign.com/api/rest/v6',
});

export default api;
