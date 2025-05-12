import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import TokenIcon from "@mui/icons-material/Token";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../contexts/AuthContext";
import { _delete, post } from "../../utils/request";
import { GODAR_REQUEST_URL } from "../../config";
import localStorage from "../../utils/storage";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "#FFFFFF",
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Logo = styled("img")({
  height: "32px",
  cursor: "pointer",
});

const TokenCounter = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "6px 16px",
  borderRadius: "20px",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  boxShadow: "0 2px 8px rgba(75, 100, 85, 0.15)",
  border: "1px solid rgba(75, 100, 85, 0.1)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    boxShadow: "0 4px 12px rgba(75, 100, 85, 0.25)",
    "& .token-icon": {
      transform: "rotate(15deg)",
    },
  },
  "& .MuiSvgIcon-root": {
    fontSize: "20px",
    marginRight: theme.spacing(1),
    transition: "transform 0.3s ease",
  },
  "& .token-amount": {
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  "& .token-label": {
    fontSize: "13px",
    opacity: 0.9,
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  margin: theme.spacing(0, 0.5),
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  marginRight: theme.spacing(1),
}));

const UserName = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const AISettingsMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: theme.shape.borderRadius,
    minWidth: 200,
    boxShadow: theme.shadows[3],
  },
}));

const UserMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: theme.shape.borderRadius,
    minWidth: 180,
    boxShadow: theme.shadows[3],
  },
}));

function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [aiSettingsAnchor, setAiSettingsAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const userToken = localStorage.get("userToken");
  const isAuthenticated = !!userToken;

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "zh" : "en");
  };

  const handleAISettingsClick = (event) => {
    setAiSettingsAnchor(event.currentTarget);
  };

  const handleAISettingsClose = () => {
    setAiSettingsAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    _delete({
      url: GODAR_REQUEST_URL + "/loginRegister/logout",
    }).then(() => {
      localStorage.remove("userToken");
      navigate("/login");
    });
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Logo src="/logo.jpg" alt="Godar" onClick={() => navigate("/")} />
        <Box sx={{ flexGrow: 1 }} />

        <Button onClick={toggleLanguage}>{t("nav.language")}</Button>

        {isAuthenticated ? (
          <>
            <UserInfo onClick={handleUserMenuOpen}>
              <UserAvatar src={user?.avatar} alt={user?.name} />
              <UserName>{user?.name}</UserName>
              <KeyboardArrowDownIcon
                sx={{ color: "#666666", fontSize: 20, ml: 0.5 }}
              />
            </UserInfo>

            <UserMenu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/profile");
                  handleUserMenuClose();
                }}
              >
                <Typography variant="body2">个人资料</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/settings");
                  handleUserMenuClose();
                }}
              >
                <Typography variant="body2">账号设置</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">退出登录</Typography>
              </MenuItem>
            </UserMenu>

            <Tooltip title="消息通知">
              <ActionButton>
                <Badge badgeContent={user?.notifications || 0} color="error">
                  <NotificationsIcon />
                </Badge>
              </ActionButton>
            </Tooltip>

            <Tooltip title="AI助理设置">
              <ActionButton
                onClick={() => {
                  navigate("/ai-settings");
                  handleAISettingsClose();
                }}
              >
                <SmartToyIcon />
              </ActionButton>
            </Tooltip>

            <TokenCounter>
              <TokenIcon className="token-icon" />
              <span className="token-amount">
                <span>{user?.tokens || 0}</span>
                <span className="token-label">Tokens</span>
              </span>
            </TokenCounter>

            <AISettingsMenu
              anchorEl={aiSettingsAnchor}
              open={Boolean(aiSettingsAnchor)}
              onClose={handleAISettingsClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem>
                <Typography variant="body2">AI模型: GPT-4</Typography>
              </MenuItem>
              <MenuItem>
                <Typography variant="body2">温度: 0.7</Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  navigate("/ai-settings");
                  handleAISettingsClose();
                }}
              >
                <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">高级设置</Typography>
              </MenuItem>
            </AISettingsMenu>
          </>
        ) : (
          <>
            <Button color="primary" onClick={() => navigate("/login")}>
              {t("nav.login")}
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate("/register")}
            >
              {t("nav.register")}
            </Button>
          </>
        )}
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navbar;
