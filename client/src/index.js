import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './interface/App';
import { ThemeProvider } from './interface/ThemeContext';
import { CssBaseline } from '@mui/material';
import { TimeProvider } from './component/TimeContext';
import { AuthProvider } from './util/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TimeProvider>
          <AuthProvider>
            <CssBaseline />
            <App />
          </AuthProvider>
          
        </TimeProvider>

      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);