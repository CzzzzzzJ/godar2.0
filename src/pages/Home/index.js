import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpertsList from '../../components/ExpertsList';
import CommentsList from '../../components/CommentsList';
import ChatBox from '../../components/ChatBox';
import { askQuestion } from '../../services/ai';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Logo = styled('img')({
  height: '40px',
  cursor: 'pointer',
});

const MiniLogo = styled('img')(({ theme }) => ({
  width: '80px',
  height: '80px',
  marginBottom: theme.spacing(3),
  animation: 'float 6s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-10px)',
    },
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const SearchField = styled(TextField)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor: theme.palette.background.paper,
  },
}));

function Home() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [retrying, setRetrying] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMessage = { isUser: true, content: question.trim() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setRetrying(false);

    try {
      const response = await askQuestion(question);
      
      if (response.retryCount > 0) {
        setRetrying(true);
      }

      if (response.success && response.answer) {
        const aiMessage = { isUser: false, content: response.answer };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = { 
          isUser: false, 
          content: response.error
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('问答出错:', error);
      const errorMessage = { 
        isUser: false, 
        content: '抱歉，服务出现问题，请稍后再试。'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuestion('');
      setRetrying(false);
    }
  };

  return (
    <Box>
      <StyledAppBar position="static">
        <Toolbar>
          <Logo src="/logo.jpg" alt="Godar" />
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={toggleLanguage}>{t('nav.language')}</Button>
          <Button color="primary">{t('nav.login')}</Button>
          <Button color="primary" variant="contained">
            {t('nav.register')}
          </Button>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="lg">
        <SearchContainer>
          <MiniLogo src="/logo_mini.jpg" alt="Godar Mascot" />
          <Typography variant="h4" gutterBottom>
            {t('home.welcome')}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {t('home.subtitle')}
          </Typography>
          <Box sx={{ width: '100%', mt: 4 }} component="form" onSubmit={handleSearch}>
            <SearchField
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
              variant="outlined"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <IconButton type="submit" disabled={loading}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <ChatBox messages={messages} loading={loading} retrying={retrying} />
        </SearchContainer>

        <ExpertsList />
        <CommentsList />
      </Container>
    </Box>
  );
}

export default Home; 