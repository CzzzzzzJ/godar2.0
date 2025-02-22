import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import './i18n/config';
import Sidebar from './components/Sidebar';
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
          <MainContent
            component="main"
            sx={{
              flexGrow: 1,
              ml: sidebarCollapsed ? '64px' : '240px',
              minHeight: '100vh',
              bgcolor: 'background.default',
              p: 3,
              transition: 'margin-left 0.3s ease'
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              {/* 添加其他路由 */}
            </Routes>
          </MainContent>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
