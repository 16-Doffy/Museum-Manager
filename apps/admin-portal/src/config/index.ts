import API from './API';
import routes from './routes';

const config = {
  routes,
  API,
};

export const initConfigApp = () => {
  // Initialize app configuration
  console.log('App initialized with config:', {
    apiUrl: API.API_URL,
    environment: import.meta.env.MODE,
  });
};

export default config;