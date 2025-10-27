// src/utils/axios.js
import axios from 'axios';

// Create an axios instance with the TMDB base URL
const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

export default instance;
