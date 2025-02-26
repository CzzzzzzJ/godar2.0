import React from 'react';
import { styled, alpha } from '@mui/material/styles';
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
import { menuItems } from './menuItems';

const StyledBox = styled(Box)(({ theme, isCollapsed }) => ({
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: isCollapsed ? 64 : 240,
  backgroundColor: theme.palette.primary.main,
  transition: 'width 0.3s ease',
  zIndex: theme.zIndex.drawer,
  display: 'flex',
  flexDirection: 'column',
}));

const SidebarContainer = styled(Box)(({ theme, collapsed }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2, 1),
  width: collapsed ? 64 : 240,
  transition: 'width 0.3s ease',
}));

const TopSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginBottom: '16px',
  padding: '0 8px',
});

const ToggleButton = styled(IconButton)(({ theme }) => ({
  padding: '8px',
  color: '#fff',
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: '4px',
  padding: theme.spacing(1),
  cursor: 'pointer',
  color: '#fff',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  ...(active && {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '& .MuiListItemIcon-root': {
      color: '#fff',
    },
    '& .MuiListItemText-primary': {
      color: '#fff',
      fontWeight: 500,
    },
  }),
  '& .MuiListItemIcon-root': {
    color: alpha(theme.palette.common.white, 0.7),
    minWidth: '40px',
  },
  '& .MuiListItemText-primary': {
    color: '#fff',
    fontSize: '0.95rem',
  },
}));

function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <StyledBox isCollapsed={collapsed ? 1 : 0}>
      <SidebarContainer collapsed={collapsed}>
        <TopSection>
          <ToggleButton onClick={onToggle} size="small">
            <MenuIcon 
              sx={{ 
                transform: collapsed ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s ease',
                fontSize: '1.2rem'
              }} 
            />
          </ToggleButton>
        </TopSection>
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => (
            <Tooltip 
              key={item.text}
              title={collapsed ? item.text : ''} 
              placement="right"
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
    </StyledBox>
  );
}

export default Sidebar; 