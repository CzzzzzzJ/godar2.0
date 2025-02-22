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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const RegisterContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 48px)',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#FFFFFF',
}));

const RegisterContent = styled(Container)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: theme.spacing(6),
  maxWidth: '440px !important',
}));

const RegisterForm = styled(Box)(({ theme }) => ({
  width: '100%',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F5F7F5',
  },
}));

const RegisterButton = styled(Button)(({ theme }) => ({
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

const LoginLink = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  color: '#666666',
  fontSize: '14px',
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    marginLeft: theme.spacing(1),
  },
}));

const TermsCheckbox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiFormControlLabel-label': {
    fontSize: '14px',
    color: '#666666',
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <RegisterContainer>
      <RegisterContent>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          注册账号
        </Typography>

        <RegisterForm>
          <StyledTextField
            fullWidth
            placeholder="请输入用户名"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <StyledTextField
            fullWidth
            placeholder="请输入电子邮箱"
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

          <StyledTextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="请确认密码"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TermsCheckbox>
            <FormControlLabel
              control={<Checkbox />}
              label={
                <span>
                  我已阅读并同意
                  <Link to="/terms">《用户协议》</Link>
                  和
                  <Link to="/privacy">《隐私政策》</Link>
                </span>
              }
            />
          </TermsCheckbox>

          <RegisterButton variant="contained" color="primary">
            注册账号
          </RegisterButton>

          <ThirdPartyLogin>
            <Typography className="title">其他注册方式</Typography>
            <ThirdPartyButtons>
              <img src="/icons/wechat.png" alt="WeChat" />
              <img src="/icons/github.png" alt="GitHub" />
              <img src="/icons/linkedin.png" alt="LinkedIn" />
            </ThirdPartyButtons>
          </ThirdPartyLogin>

          <LoginLink>
            <Box component="span">已有账号？</Box>
            <Link to="/login">立即登录</Link>
          </LoginLink>
        </RegisterForm>
      </RegisterContent>
    </RegisterContainer>
  );
}

export default Register; 