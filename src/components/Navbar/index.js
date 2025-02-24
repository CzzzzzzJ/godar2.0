import React from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UserMenu from '../UserMenu';
import { useAuth } from '../../contexts/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: '#FFFFFF',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Logo = styled('img')({
  height: '32px',
  cursor: 'pointer',
});

function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Logo 
          src="/logo.jpg" 
          alt="Godar" 
          onClick={() => navigate('/')}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={toggleLanguage}>{t('nav.language')}</Button>
        
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <>
            <Button 
              color="primary"
              onClick={() => navigate('/login')}
            >
              {t('nav.login')}
            </Button>
            <Button 
              color="primary" 
              variant="contained"
              onClick={() => navigate('/register')}
            >
              {t('nav.register')}
            </Button>
          </>
        )}
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navbar; 