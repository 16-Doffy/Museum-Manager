import API from './API';
import routes from './routes';

const config = {
  routes,
  API,
};

export const initConfigApp = () => {
  // Initialize app configuration
  // Only log in development mode
  if (import.meta.env.DEV) {
    console.log('App initialized with config:', {
      apiUrl: API.API_URL,
      environment: import.meta.env.MODE,
    });
  }
};

export default config;