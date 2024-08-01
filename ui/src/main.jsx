import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { QueryClientProviderWrapper } from './queryClient';
import { AuthProvider } from './AuthContext';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProviderWrapper>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProviderWrapper>
  </React.StrictMode>,
)