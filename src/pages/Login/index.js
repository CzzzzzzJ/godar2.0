import React, { useState } from "react";
import { styled } from "@mui/material/styles";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { get, post } from "../../utils/request";
import { GODAR_REQUEST_URL } from "../../config";
import localStorage from "../../utils/storage";

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 48px)",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#FFFFFF",
}));

const LoginContent = styled(Container)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: theme.spacing(6),
  maxWidth: "440px !important",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  width: "100%",
  "& .MuiTabs-indicator": {
    height: "2px",
  },
  "& .MuiTab-root": {
    fontSize: "14px",
    fontWeight: 500,
    minWidth: "120px",
    padding: "12px 16px",
    color: "#666666",
    "&.Mui-selected": {
      color: theme.palette.primary.main,
    },
  },
  "& .MuiTabs-flexContainer": {
    justifyContent: "center",
  },
}));

const StyledTab = styled(Tab)({
  whiteSpace: "nowrap",
  minHeight: "48px",
});

const LoginForm = styled(Box)(({ theme }) => ({
  width: "100%",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#F5F7F5",
  },
}));

const RememberForgot = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const LoginButton = styled(Button)(({ theme }) => ({
  width: "100%",
  height: "48px",
  fontSize: "16px",
  marginBottom: theme.spacing(4),
}));

const ThirdPartyLogin = styled(Box)(({ theme }) => ({
  textAlign: "center",
  "& .title": {
    color: "#999999",
    fontSize: "14px",
    marginBottom: theme.spacing(2),
  },
}));

const ThirdPartyButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
  "& img": {
    width: "32px",
    height: "32px",
    cursor: "pointer",
  },
}));

const RegisterLink = styled(Box)(({ theme }) => ({
  textAlign: "center",
  color: "#666666",
  fontSize: "14px",
  "& a": {
    color: theme.palette.primary.main,
    textDecoration: "none",
    marginLeft: theme.spacing(1),
  },
}));

const MAX_COUNT_DOWN = 60;

function Login() {
  const [loginType, setLoginType] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // 表单错误状态
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    phone: "",
    smsCode: "",
  });
  // 弹窗状态
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [countDown, setCountdown] = useState(MAX_COUNT_DOWN);
  const timerRef = React.useRef(-1);

  // 表单验证
  const validateForm = () => {
    const newErrors = {};

    if (loginType === 0) {
      if (!formData.email.trim()) {
        newErrors.email = "邮箱不能为空";
      }

      if (!formData.password.trim()) {
        newErrors.password = "密码不能为空";
      }
    }

    if (loginType === 1) {
      if (!formData.phone.trim()) {
        newErrors.phone = "手机号不能为空";
      }

      if (!formData.smsCode.trim()) {
        newErrors.smsCode = "验证码不能为空";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginTypeChange = (event, newValue) => {
    console.log(newValue);
    setLoginType(newValue);
  };

  const handleChange = (field) => (evt) => {
    const { value } = evt.target;
    if (value) {
      delete errors[field];
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors(errors);
  };

  const handleSendSmsCode = () => {
    if (countDown < MAX_COUNT_DOWN) {
      return;
    }

    const newErrors = {};
    if (!formData.phone.trim()) {
      newErrors.phone = "手机号不能为空";
      setErrors(newErrors);
      return;
    }

    get({
      url:
        GODAR_REQUEST_URL +
        `/loginRegister/generateCode?phone=${formData.phone}&method=login`,
    }).then(() => {
      setCountdown((prev) => (prev -= 1));
      timerRef.current = setInterval(() => {
        setCountdown((prev) => (prev -= 1));
      }, 1000);

      setSnackbar({
        open: true,
        message: "验证码发送成功，请注意查收",
        severity: "success",
      });
    });
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "请完善表单信息",
        severity: "warning",
      });
      return;
    }

    post({
      url: GODAR_REQUEST_URL + "/loginRegister/login",
      data: {
        ...formData,
        loginMethod: !loginType ? 2 : 1,
        email: !loginType ? formData.email : undefined,
      },
    }).then(({ data }) => {
      localStorage.set("userToken", data.access_token);
      setSnackbar({ open: true, message: "登录成功", severity: "success" });
      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    });
  };

  // 关闭提示弹窗
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  React.useEffect(() => {
    if (countDown < 0) {
      clearInterval(timerRef.current);
      setCountdown(MAX_COUNT_DOWN);
    }
  }, [countDown]);

  React.useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      setCountdown(MAX_COUNT_DOWN);
    };
  }, []);

  return (
    <LoginContainer>
      <LoginContent>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          用户登录
        </Typography>

        <StyledTabs
          value={loginType}
          onChange={handleLoginTypeChange}
          variant="standard"
        >
          <StyledTab label="账号密码登录" />
          <StyledTab label="手机验证码登录" />
        </StyledTabs>

        <LoginForm>
          {loginType === 0 ? (
            <>
              <StyledTextField
                fullWidth
                placeholder="请输入邮箱"
                onChange={handleChange("email")}
                required
                error={!!errors.email}
                helperText={errors.email}
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
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码"
                onChange={handleChange("password")}
                required
                error={!!errors.password}
                helperText={errors.password}
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
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
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
                onChange={handleChange("phone")}
                required
                error={!!errors.phone}
                helperText={errors.phone}
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
                onChange={handleChange("smsCode")}
                required
                error={!!errors.smsCode}
                helperText={errors.smsCode}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={handleSendSmsCode}>
                        {countDown < MAX_COUNT_DOWN
                          ? `${countDown} s`
                          : "获取验证码"}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}

          <RememberForgot>
            <FormControlLabel control={<Checkbox />} label="记住密码" />
            <Link
              to="/forgot-password"
              style={{ color: "#666666", textDecoration: "none" }}
            >
              忘记密码？
            </Link>
          </RememberForgot>

          <LoginButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            登录
          </LoginButton>

          {/* <ThirdPartyLogin>
            <Typography className="title">其他登录方式</Typography>
            <ThirdPartyButtons>
              <img src="/icons/wechat.png" alt="WeChat" />
              <img src="/icons/github.png" alt="GitHub" />
              <img src="/icons/linkedin.png" alt="LinkedIn" />
            </ThirdPartyButtons>
          </ThirdPartyLogin> */}

          <RegisterLink>
            <Box component="span">还没有账号？</Box>
            <Link to="/register">立即注册</Link>
          </RegisterLink>
        </LoginForm>
      </LoginContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LoginContainer>
  );
}

export default Login;
