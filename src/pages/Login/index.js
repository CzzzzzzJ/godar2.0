import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 48px)',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#FFFFFF',
}));

const LoginContent = styled(Container)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: theme.spacing(6),
  maxWidth: '440px !important',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiTabs-indicator': {
    height: '2px',
  },
  '& .MuiTab-root': {
    fontSize: '16px',
    fontWeight: 500,
    color: '#666666',
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
}));

const LoginForm = styled(Box)(({ theme }) => ({
  width: '100%',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F5F7F5',
  },
}));

const RememberForgot = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const LoginButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '48px',
  fontSize: '16px',
  marginBottom: theme.spacing(4),
}));

const ThirdPartyLogin = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  '& .title': {
    color: '#999999',
    fontSize: '14px',
    marginBottom: theme.spacing(2),
  },
}));

const ThirdPartyButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
  '& img': {
    width: '32px',
    height: '32px',
    cursor: 'pointer',
  },
}));

const RegisterLink = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  color: '#666666',
  fontSize: '14px',
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    marginLeft: theme.spacing(1),
  },
}));

function Login() {
  const [loginType, setLoginType] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLoginTypeChange = (event, newValue) => {
    setLoginType(newValue);
  };

  return (
    <LoginContainer>
      <LoginContent>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          用户登录
        </Typography>

        <StyledTabs
          value={loginType}
          onChange={handleLoginTypeChange}
          variant="fullWidth"
        >
          <Tab label="账号密码登录" />
          <Tab label="手机验证码登录" />
        </StyledTabs>

        <LoginForm>
          {loginType === 0 ? (
            <>
              <StyledTextField
                fullWidth
                placeholder="请输入邮箱"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : (
            <>
              <StyledTextField
                fullWidth
                placeholder="请输入手机号"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                placeholder="请输入验证码"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button>获取验证码</Button>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}

          <RememberForgot>
            <FormControlLabel
              control={<Checkbox />}
              label="记住密码"
            />
            <Link to="/forgot-password" style={{ color: '#666666', textDecoration: 'none' }}>
              忘记密码？
            </Link>
          </RememberForgot>

          <LoginButton variant="contained" color="primary">
            登录
          </LoginButton>

          <ThirdPartyLogin>
            <Typography className="title">其他登录方式</Typography>
            <ThirdPartyButtons>
              <img src="/icons/wechat.png" alt="WeChat" />
              <img src="/icons/github.png" alt="GitHub" />
              <img src="/icons/linkedin.png" alt="LinkedIn" />
            </ThirdPartyButtons>
          </ThirdPartyLogin>

          <RegisterLink>
            <Box component="span">还没有账号？</Box>
            <Link to="/register">立即注册</Link>
          </RegisterLink>
        </LoginForm>
      </LoginContent>
    </LoginContainer>
  );
}

export default Login; 