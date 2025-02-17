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

const Logo = styled('div')(({ theme }) => ({
  fontFamily: 'Helvetica Neue',
  fontSize: '24px',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
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
          <Logo>Godar</Logo>
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