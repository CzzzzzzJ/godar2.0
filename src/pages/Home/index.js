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
  Select,
  MenuItem,
  InputBase,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
// 暂时注释掉这些组件的导入
// import ExpertsList from '../../components/ExpertsList';
import CommentsList from '../../components/CommentsList';
import ChatBox from '../../components/ChatBox';
import { askQuestion } from '../../services/ai';
import ArticleList from '../../components/ArticleList';

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

const RegionSelect = styled(Select)(({ theme }) => ({
  width: '120px',
  backgroundColor: '#FFFFFF',
  borderRadius: `${theme.shape.borderRadius * 3}px 0 0 ${theme.shape.borderRadius * 3}px`,
  '& .MuiSelect-select': {
    padding: '12px 32px 12px 16px',
    fontSize: '14px',
    color: '#333333',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px',
    borderColor: '#E0E0E0',
    borderRight: 'none',
    transition: 'border-color 0.3s ease',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px',
    borderColor: theme.palette.primary.main,
  },
}));

const SearchFieldContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  maxWidth: '600px',
  margin: '0 auto',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  borderRadius: theme.shape.borderRadius * 3,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  '&:focus-within': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  },
}));

const StyledSearchField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: `0 ${theme.shape.borderRadius * 3}px ${theme.shape.borderRadius * 3}px 0`,
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderWidth: '1px',
      borderColor: '#E0E0E0',
      borderLeft: 'none',
      transition: 'border-color 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderWidth: '1px',
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: '#333333',
    '&::placeholder': {
      color: '#999999',
      opacity: 1,
    },
  },
  '& .MuiIconButton-root': {
    color: theme.palette.primary.main,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(75, 100, 85, 0.08)',
    },
    '&.Mui-disabled': {
      color: '#CCCCCC',
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

// 区域选项数据
const regions = [
  { value: 'all', label: '全球' },
  { value: 'china', label: '中国' },
  { value: 'us', label: '美国' },
  { value: 'europe', label: '欧洲' },
  { value: 'japan', label: '日本' },
  { value: 'australia', label: '澳大利亚' },
  { value: 'singapore', label: '新加坡' },
  { value: 'korea', label: '韩国' },
  { value: 'southeast-asia', label: '东南亚' },
  { value: 'africa', label: '非洲' },
  { value: 'others', label: '其他' },
];

function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [retrying, setRetrying] = useState(false);
  const [thinkingStep, setThinkingStep] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

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

    const userMessage = { 
      isUser: true, 
      content: `${regions.find(r => r.value === selectedRegion).label}及${question.trim()}`
    };
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
              <RegionSelect
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                variant="outlined"
              >
                {regions.map((region) => (
                  <MenuItem key={region.value} value={region.value}>
                    {region.label}
                  </MenuItem>
                ))}
              </RegionSelect>
              <StyledSearchField
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

        {/* 暂时注释掉这些组件，后续会重新启用 */}
        {/* <ExpertsList /> */}
        {/* <ArticleList /> */}
        {/* <CommentsList /> */}
      </Container>
    </Box>
  );
}

export default Home; 