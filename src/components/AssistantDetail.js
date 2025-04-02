import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider, 
  Avatar, 
  CircularProgress,
  Chip,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import { AssistantService } from '../services';
import useApi from '../hooks/useApi';

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const DetailItem = ({ label, value }) => (
  <Box mb={2}>
    <DetailLabel variant="subtitle2">{label}</DetailLabel>
    <DetailValue variant="body1">{value}</DetailValue>
  </Box>
);

/**
 * AI助手详情组件
 * @param {Object} props - 组件属性
 * @param {number} props.assistantId - 助手ID
 * @param {Function} props.onEdit - 编辑回调
 * @param {Function} props.onBack - 返回回调
 */
const AssistantDetail = ({ assistantId, onEdit, onBack }) => {
  // 使用API Hook获取助手详情
  const { 
    data: assistant, 
    loading, 
    error, 
    refresh 
  } = useApi(
    () => AssistantService.getAssistantDetail(assistantId, { useCache: true }), 
    [assistantId],
    {
      onError: (err) => console.error('获取AI助手详情失败:', err)
    }
  );

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="300px"
      >
        <Typography color="error" gutterBottom>
          {error.message || '获取AI助手详情失败'}
        </Typography>
        <Button variant="outlined" onClick={refresh} sx={{ mt: 2 }}>
          重试
        </Button>
      </Box>
    );
  }

  if (!assistant) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="300px"
      >
        <Typography color="text.secondary">
          未找到助手信息
        </Typography>
      </Box>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        {/* 头部信息 */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <Avatar 
              sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}
            >
              <SmartToyIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5">{assistant.Name}</Typography>
              <Box display="flex" alignItems="center" mt={0.5}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  创建于 {formatDate(assistant.CreatedAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Button 
            startIcon={<EditIcon />} 
            variant="outlined"
            onClick={() => onEdit && onEdit(assistant)}
          >
            编辑
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* 详细信息 */}
        <Box mt={3}>
          <DetailItem label="助手ID" value={assistant.AssistantId} />
          <DetailItem label="用户ID" value={assistant.UserId} />
          
          <DetailItem 
            label="问候语" 
            value={
              <Typography 
                variant="body1" 
                component="div" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 1,
                  fontStyle: 'italic'
                }}
              >
                "{assistant.Greeting}"
              </Typography>
            } 
          />
          
          <DetailItem 
            label="性格特点" 
            value={
              <Box>
                {assistant.PersonalityTraits.split(',').map((trait, index) => (
                  <Chip 
                    key={index} 
                    label={trait.trim()} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            } 
          />
          
          <DetailItem 
            label="更新时间" 
            value={formatDate(assistant.UpdatedAt)} 
          />
        </Box>
        
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="text" onClick={onBack}>
            返回列表
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssistantDetail; 