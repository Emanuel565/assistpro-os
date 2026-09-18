import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupMockApiInterceptor } from './utils/mockApiInterceptor';

// Ativa o interceptor mock para garantir navegação estática completa no GitHub Pages e offline
setupMockApiInterceptor();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);