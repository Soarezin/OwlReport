import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import muiTheme from './theme/muiTheme';
import App from './pages/App';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import 'rrweb-player/dist/style.css';

import './index.css';
import ReportDetailPage from './pages/ReportDetail';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={muiTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<App />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/report-detail/:reportId" element={<ReportDetailPage />} />
          <Route
            path="/login"
            element={<LoginPage />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);