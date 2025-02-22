import React, { useState, useEffect } from 'react';
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
import ArticleList from '../../components/ArticleList';

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
  transition: 'transform 0.3s ease-in-out',
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: '400px',
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  position: 'relative',
  paddingTop: theme.spacing(6),
}));

const SearchField = styled(TextField)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.3s ease-in-out',
    '&.Mui-focused': {
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  },
}));

const ContentContainer = styled(Box)(({ theme, hasMessages }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'all 0.3s ease-in-out',
  marginTop: hasMessages ? theme.spacing(2) : theme.spacing(4),
}));

const SearchFieldContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  maxWidth: '600px',
  margin: '0 auto',
});

function Home() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [retrying, setRetrying] = useState(false);
  const [thinkingStep, setThinkingStep] = useState('');

  const hasMessages = messages.length > 0 || loading;

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
  };

  // 监听控制台日志的函数
  const handleConsoleLog = (event) => {
    const { detail } = event;
    if (typeof detail === 'string' && 
        (detail.includes('🤖') || detail.includes('🌏') || 
         detail.includes('🔍') || detail.includes('🏢') || 
         detail.includes('📚') || detail.includes('💡') || 
         detail.includes('🤝') || detail.includes('✨'))) {
      setThinkingStep(detail);
    }
  };

  // 添加和移除控制台日志监听器
  useEffect(() => {
    window.addEventListener('console-log', handleConsoleLog);
    return () => {
      window.removeEventListener('console-log', handleConsoleLog);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMessage = { isUser: true, content: question.trim() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setRetrying(false);
    setThinkingStep('');

    try {
      // 重写 console.log 来捕获思考过程
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        originalConsoleLog.apply(console, args);
        const message = args.join(' ');
        window.dispatchEvent(new CustomEvent('console-log', { detail: message }));
      };

      const response = await askQuestion(question);
      
      // 恢复原始的 console.log
      console.log = originalConsoleLog;
      
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
      setThinkingStep('');
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
          <MiniLogo 
            src="/logo_mini.jpg" 
            alt="Godar Mascot"
            sx={{ 
              transform: hasMessages ? 'scale(0.8)' : 'scale(1)',
            }}
          />
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              fontSize: hasMessages ? '1.5rem' : '2rem',
              transition: 'all 0.3s ease-in-out',
              mb: hasMessages ? 1 : 2,
            }}
          >
            {t('home.welcome')}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            gutterBottom
            sx={{ 
              opacity: hasMessages ? 0 : 1,
              height: hasMessages ? 0 : 'auto',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              mb: hasMessages ? 0 : 2,
            }}
          >
            {t('home.subtitle')}
          </Typography>
          <ContentContainer hasMessages={hasMessages}>
            <SearchFieldContainer component="form" onSubmit={handleSearch}>
              <SearchField
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                variant="outlined"
                disabled={loading}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton type="submit" disabled={loading}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </SearchFieldContainer>
            <ChatBox 
              messages={messages} 
              loading={loading} 
              retrying={retrying}
              thinkingStep={thinkingStep}
            />
          </ContentContainer>
        </SearchContainer>

        <ExpertsList />
        <ArticleList />
        <CommentsList />
      </Container>
    </Box>
  );
}

export default Home; 