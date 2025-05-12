import React from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import KeyIcon from "@mui/icons-material/Key";
import HelpIcon from "@mui/icons-material/Help";
import StarIcon from "@mui/icons-material/Star";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { menuItems } from "./menuItems";
import localStorage from "../../utils/storage";

const StyledBox = styled(Box)(({ theme, isCollapsed }) => ({
  position: "fixed",
  left: 0,
  top: 0,
  bottom: 0,
  width: isCollapsed ? 64 : 240,
  backgroundColor: theme.palette.primary.main,
  transition: "width 0.3s ease",
  zIndex: theme.zIndex.drawer,
  display: "flex",
  flexDirection: "column",
}));

const SidebarContainer = styled(Box)(({ theme, collapsed }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2, 1),
  width: collapsed ? 64 : 240,
  transition: "width 0.3s ease",
}));

const TopSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  marginBottom: "16px",
  padding: "0 8px",
});

const ToggleButton = styled(IconButton)(({ theme }) => ({
  padding: "8px",
  color: "#fff",
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
  },
}));

const MenuItem = styled(ListItem)(({ theme, active }) => ({
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: active
    ? alpha(theme.palette.common.white, 0.15)
    : "transparent",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: theme.spacing((collapsed) => (collapsed ? 0 : 2)),
    color: active
      ? theme.palette.common.white
      : alpha(theme.palette.common.white, 0.7),
  },
  "& .MuiListItemText-primary": {
    color: theme.palette.common.white,
    fontWeight: active ? 500 : 400,
  },
}));

function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    const userToken = localStorage.get("userToken");
    navigate(userToken ? path : "/login");
  };

  return (
    <StyledBox isCollapsed={collapsed}>
      <SidebarContainer collapsed={collapsed}>
        <TopSection>
          <ToggleButton onClick={onToggle}>
            <MenuIcon />
          </ToggleButton>
        </TopSection>

        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return collapsed ? (
              <Tooltip key={item.path} title={item.title} placement="right">
                <MenuItem
                  button
                  active={isActive ? 1 : 0}
                  onClick={() => handleNavigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                </MenuItem>
              </Tooltip>
            ) : (
              <MenuItem
                key={item.path}
                button
                active={isActive ? 1 : 0}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </MenuItem>
            );
          })}
        </List>
      </SidebarContainer>
    </StyledBox>
  );
}

export default Sidebar;
