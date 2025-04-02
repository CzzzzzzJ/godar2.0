import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Avatar, 
  Box, 
  Divider,
  Card,
  CardContent,
  CardHeader,
  List,
  CircularProgress,
  Chip,
  Button,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '../contexts/AuthContext';
import { AssistantService } from '../services';
import useApi from '../hooks/useApi';
import AssistantDetail from '../components/AssistantDetail';

const ProfileInfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

const AssistantCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id || 'user123';
  
  // 状态管理
  const [selectedAssistantId, setSelectedAssistantId] = useState(null);
  
  // 使用API Hook获取助手列表
  const { 
    data: assistants = [], 
    loading, 
    error, 
    refresh: refreshAssistants 
  } = useApi(
    () => AssistantService.getAssistants(userId, { useCache: true }), 
    [userId],
    {
      onError: (err) => console.error('获取AI助手数据失败:', err)
    }
  );

  // 查看助手详情
  const handleViewDetail = (assistantId) => {
    setSelectedAssistantId(assistantId);
  };
  
  // 返回列表
  const handleBackToList = () => {
    setSelectedAssistantId(null);
  };
  
  // 处理编辑助手
  const handleEditAssistant = (assistant) => {
    console.log('编辑助手:', assistant);
    // 这里可以实现跳转到编辑页面或打开编辑对话框
  };

  // 格式化日期显示
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // 渲染助手列表或详情
  const renderAssistantContent = () => {
    if (selectedAssistantId) {
      return (
        <AssistantDetail 
          assistantId={selectedAssistantId}
          onEdit={handleEditAssistant}
          onBack={handleBackToList}
        />
      );
    }
    
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Typography color="error" align="center">
          {error.message || '获取AI助手数据失败，请稍后再试'}
        </Typography>
      );
    }
    
    if (assistants.length === 0) {
      return (
        <Typography align="center" color="text.secondary">
          您还没有创建AI助手
        </Typography>
      );
    }
    
    return (
      <List>
        {assistants.map((assistant) => (
          <AssistantCard key={assistant.AssistantId}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SmartToyIcon />
                </Avatar>
              }
              title={
                <Typography variant="h6">{assistant.Name}</Typography>
              }
              subheader={`创建于: ${formatDate(assistant.CreatedAt)}`}
              action={
                <IconButton 
                  aria-label="查看详情"
                  onClick={() => handleViewDetail(assistant.AssistantId)}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {assistant.Greeting}
              </Typography>
              <Box>
                {assistant.PersonalityTraits.split(',').map((trait, index) => (
                  <Chip 
                    key={index}
                    label={trait.trim()}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </CardContent>
          </AssistantCard>
        ))}
      </List>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* 个人信息部分 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                src={user?.avatar} 
                alt={user?.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h5" fontWeight="bold">{user?.name || '用户名'}</Typography>
              <Chip 
                label={`${user?.tokens || 0} Tokens`}
                color="primary"
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>个人资料</Typography>
            
            <ProfileInfoItem>
              <PersonIcon />
              <Typography>用户ID: {userId}</Typography>
            </ProfileInfoItem>
            
            <ProfileInfoItem>
              <EmailIcon />
              <Typography>邮箱: {user?.email || '未设置'}</Typography>
            </ProfileInfoItem>
            
            <ProfileInfoItem>
              <Typography variant="body2" color="text.secondary">
                账户创建于: 2025年3月15日
              </Typography>
            </ProfileInfoItem>
          </Paper>
        </Grid>
        
        {/* AI助手部分 */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                {selectedAssistantId ? '助手详情' : '我的AI助手'}
              </Typography>
              {!loading && !selectedAssistantId && (
                <Chip 
                  label="刷新" 
                  color="primary" 
                  variant="outlined" 
                  onClick={refreshAssistants}
                  size="small"
                />
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {renderAssistantContent()}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 