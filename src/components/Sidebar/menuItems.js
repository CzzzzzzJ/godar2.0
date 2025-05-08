import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import KeyIcon from '@mui/icons-material/Key';
import HelpIcon from '@mui/icons-material/Help';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import GroupIcon from '@mui/icons-material/Group';

export const menuItems = [
  {
    title: '首页',
    icon: <HomeIcon />,
    path: '/',
  },
  {
    title: '专家列表',
    icon: <GroupIcon />,
    path: '/experts',
  },
  {
    title: '对话消息',
    icon: <MessageIcon />,
    path: '/messages',
  },
  // 暂时隐藏"我的收藏"菜单项
  /*
  {
    title: '我的收藏',
    icon: <StarIcon />,
    path: '/favorites',
  },
  */
  // 暂时隐藏"使用记录"菜单项
  /*
  {
    title: '使用记录',
    icon: <HistoryIcon />,
    path: '/history',
  },
  */
  {
    title: '个人中心',
    icon: <PersonIcon />,
    path: '/profile',
  },
  {
    title: 'AI助手设置',
    icon: <SmartToyIcon />,
    path: '/ai-settings',
  },
  {
    title: 'Token设置',
    icon: <KeyIcon />,
    path: '/token',
  },
  // 暂时隐藏"问题帮助"菜单项
  /*
  {
    title: '问题帮助',
    icon: <HelpIcon />,
    path: '/help',
  },
  */
]; 