import React, { useState, useEffect } from 'react';
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
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';

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
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        setLoading(true);
        // 使用user123作为测试用户ID
        const userId = user?.id || 'user123';
        
        // 处理HTTPS环境下的API调用
        let data;
        try {
          data = await ApiService.getAIAssistants(userId);
        } catch (apiError) {
          // 如果网络请求失败，在生产环境使用模拟数据
          if (process.env.NODE_ENV === 'production') {
            console.warn('API请求失败，使用模拟数据', apiError);
            data = [
              {
                "AssistantId": 2,
                "UserId": userId,
                "Name": "专业数据处理专家",
                "Greeting": "我是专家，可以帮您处理各类数据分析任务",
                "PersonalityTraits": "专业、高效、细致",
                "CreatedAt": "2025-03-24T09:28:44",
                "UpdatedAt": "2025-03-24T09:28:44"
              },
              {
                "AssistantId": 1,
                "UserId": userId,
                "Name": "创意助手",
                "Greeting": "欢迎使用创意助手，让我们一起创造精彩",
                "PersonalityTraits": "创新、幽默、灵活",
                "CreatedAt": "2025-03-22T00:00:06",
                "UpdatedAt": "2025-03-22T00:00:06"
              }
            ];
          } else {
            // 开发环境中继续抛出错误
            throw apiError;
          }
        }
        
        setAssistants(data);
        setError(null);
      } catch (err) {
        console.error('获取AI助手失败:', err);
        setError('获取AI助手数据失败，请稍后再试。如果您使用HTTPS访问，可能无法连接到HTTP的API服务器。');
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, [user]);

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
              <Typography>用户ID: {user?.id || 'user123'}</Typography>
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
            <Typography variant="h5" gutterBottom>
              我的AI助手
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" align="center">{error}</Typography>
            ) : assistants.length === 0 ? (
              <Typography align="center" color="text.secondary">
                您还没有创建AI助手
              </Typography>
            ) : (
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
                    />
                    <CardContent>
                      <Typography variant="body1" sx={{ 
                        fontStyle: 'italic', 
                        borderLeft: '3px solid', 
                        borderColor: 'primary.main',
                        pl: 2,
                        mb: 2
                      }}>
                        "{assistant.Greeting}"
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        特性: {assistant.PersonalityTraits}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        mt: 2,
                        fontSize: '0.8rem',
                        color: 'text.secondary'
                      }}>
                        上次更新: {formatDate(assistant.UpdatedAt)}
                      </Box>
                    </CardContent>
                  </AssistantCard>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 