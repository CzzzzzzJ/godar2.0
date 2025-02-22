import React from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import KeyIcon from '@mui/icons-material/Key';
import HelpIcon from '@mui/icons-material/Help';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarContainer = styled(Box)(({ theme, collapsed }) => ({
  width: collapsed ? '64px' : '240px',
  height: '100vh',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  position: 'fixed',
  left: 0,
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  transition: 'width 0.3s ease',
  overflow: 'hidden',
  zIndex: theme.zIndex.drawer,
}));

const TopSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  padding: theme.spacing(1.5, 2),
  cursor: 'pointer',
  backgroundColor: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiListItemIcon-root': {
    minWidth: '40px',
    color: theme.palette.primary.contrastText,
  },
  '& .MuiListItemText-root': {
    '& .MuiTypography-root': {
      fontSize: '0.95rem',
      fontWeight: active ? 500 : 400,
    },
  },
}));

const menuItems = [
  { text: '主页', icon: <HomeIcon />, path: '/' },
  { text: '消息', icon: <MessageIcon />, path: '/messages' },
  { text: 'Token 设置', icon: <KeyIcon />, path: '/token' },
  { text: '帮助', icon: <HelpIcon />, path: '/help' },
  { text: '收藏', icon: <StarIcon />, path: '/favorites' },
  { text: '历史记录', icon: <HistoryIcon />, path: '/history' },
  { text: '退出', icon: <LogoutIcon />, path: '/logout' },
];

function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <SidebarContainer collapsed={collapsed}>
      <TopSection>
        <ToggleButton onClick={onToggle}>
          <MenuIcon 
            sx={{ 
              transform: collapsed ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease'
            }} 
          />
        </ToggleButton>
      </TopSection>
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <Tooltip 
            title={collapsed ? item.text : ''} 
            placement="right" 
            key={item.text}
          >
            <StyledListItem
              active={location.pathname === item.path ? 1 : 0}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </StyledListItem>
          </Tooltip>
        ))}
      </List>
    </SidebarContainer>
  );
}

export default Sidebar; 