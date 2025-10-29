export const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bolt-new-eta-neon.vercel.app/api' 
  : 'http://localhost:3000/api';
