import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './interface/App';
import { ThemeProvider } from './interface/ThemeContext';
import { CssBaseline } from '@mui/material';
import { TimeProvider } from './component/TimeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TimeProvider>
          <CssBaseline />
          <App />
        </TimeProvider>

      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);