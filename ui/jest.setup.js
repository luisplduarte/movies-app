import '@testing-library/jest-dom';
import 'dotenv/config';


require('dotenv').config({ path: '.env.test' });

globalThis.importMetaEnv = {
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3000',

};
