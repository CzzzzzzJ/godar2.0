import React from 'react';
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
import TokenSettings from './pages/TokenSettings';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
// import ArticleEditor from './pages/ArticleEditor';  // 暂时注释掉，等待组件创建

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

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
              component="main"
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
              <Box sx={{ flex: 1, p: 3 }}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/experts" element={<ExpertsPage />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/expert-add" element={<ExpertAdd />} />
                  <Route path="/ai-settings" element={<AISettings />} />
                  <Route path="/token" element={<TokenSettings />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/profile" element={<Profile />} />
                  {/* <Route path="/article/editor" element={<ArticleEditor />} /> */}
                  <Route path="/" element={<Home />} />
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
