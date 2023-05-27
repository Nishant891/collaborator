import { createClient } from 'appwrite';

const initializeAppwrite = () => {
    // Initialize Appwrite client
    const appwrite = createClient({
      endpoint: process.env.REACT_APP_APPWRITE_ENDPOINT,
      project: process.env.REACT_APP_APPWRITE_PROJECT_ID,
    });
  
    return appwrite;
  };
  
  export default initializeAppwrite;
  