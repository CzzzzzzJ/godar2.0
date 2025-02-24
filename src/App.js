import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import './i18n/config';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ExpertsPage from './pages/Experts';
import Messages from './pages/Messages';
import ExpertAdd from './pages/ExpertAdd';
import AISettings from './pages/AISettings';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex' }}>
            <Sidebar 
              collapsed={sidebarCollapsed} 
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
            />
            <Box
              sx={{
                flexGrow: 1,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                ml: sidebarCollapsed ? '64px' : '240px',
                transition: 'margin-left 0.3s ease',
                backgroundColor: theme.palette.background.default,
              }}
            >
              <Navbar />
              <Box sx={{ flex: 1 }}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/experts" element={<ExpertsPage />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/expert-add" element={<ExpertAdd />} />
                  <Route path="/ai-settings" element={<AISettings />} />
                  <Route path="/" element={<Home />} />
                  {/* 添加其他路由 */}
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
