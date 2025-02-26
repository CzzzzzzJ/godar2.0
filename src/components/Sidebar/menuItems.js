import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import KeyIcon from '@mui/icons-material/Key';
import HelpIcon from '@mui/icons-material/Help';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';

export const menuItems = [
  { text: '主页', icon: <HomeIcon />, path: '/' },
  { text: '专家', icon: <GroupIcon />, path: '/experts' },
  { text: '消息', icon: <MessageIcon />, path: '/messages' },
  { text: 'AI设置', icon: <SettingsIcon />, path: '/ai-settings' },
  { text: 'Token 设置', icon: <KeyIcon />, path: '/token' },
  { text: '收藏', icon: <StarIcon />, path: '/favorites' },
  { text: '历史记录', icon: <HistoryIcon />, path: '/history' },
  { text: '帮助', icon: <HelpIcon />, path: '/help' },
  { text: '退出', icon: <LogoutIcon />, path: '/logout' },
]; 