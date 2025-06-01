import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import localStorage from "../../utils/storage";

const UserContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
}));

const IconButtonWrapper = styled(IconButton)(({ theme }) => ({
  color: "#666666",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  cursor: "pointer",
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  border: "2px solid #FFFFFF",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

const UserName = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 500,
  color: "#333333",
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    fontSize: "10px",
    height: "16px",
    minWidth: "16px",
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    borderRadius: theme.shape.borderRadius,
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: "14px",
  padding: theme.spacing(1, 2),
  color: "#666666",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    color: theme.palette.primary.main,
  },
}));

function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      localStorage.remove("userId");
      localStorage.remove("userToken");
      navigate("/login");
    }
    handleMenuClose();
  };

  if (!user) return null;

  return (
    <UserContainer>
      <IconButtonWrapper>
        <StyledBadge badgeContent={user.notifications} color="error">
          <NotificationsIcon />
        </StyledBadge>
      </IconButtonWrapper>

      <IconButtonWrapper>
        <StyledBadge badgeContent={user.messages} color="error">
          <MessageIcon />
        </StyledBadge>
      </IconButtonWrapper>

      <UserInfo onClick={handleMenuOpen}>
        <UserAvatar src={user.avatar} alt={user.name} />
        <UserName>{user.name}</UserName>
        <KeyboardArrowDownIcon sx={{ color: "#666666", fontSize: 20 }} />
      </UserInfo>

      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <StyledMenuItem onClick={() => handleNavigate("/profile")}>
          个人资料
        </StyledMenuItem>
        <StyledMenuItem onClick={() => handleNavigate("/settings")}>
          账号设置
        </StyledMenuItem>
        <Divider />
        <StyledMenuItem onClick={() => handleNavigate("/help")}>
          帮助中心
        </StyledMenuItem>
        <StyledMenuItem onClick={handleLogout}>退出登录</StyledMenuItem>
      </StyledMenu>
    </UserContainer>
  );
}

export default UserMenu;
