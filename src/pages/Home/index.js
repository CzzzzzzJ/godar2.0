import React from 'react';
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

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
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
          <Box sx={{ width: '100%', mt: 4 }}>
            <SearchField
              placeholder={t('home.searchPlaceholder')}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </SearchContainer>

        <ExpertsList />
        <CommentsList />
      </Container>
    </Box>
  );
}

export default Home; 