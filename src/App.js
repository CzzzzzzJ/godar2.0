import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import './i18n/config';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';

const MainContent = Box;

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            }}
          >
            <Box sx={{ flex: 1, p: 3 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* 添加其他路由 */}
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
