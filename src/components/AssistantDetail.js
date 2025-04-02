import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider, 
  Avatar, 
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AssistantService } from '../services';
import useApi from '../hooks/useApi';
import { useApiExecution } from '../hooks/useApi';

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
 * @param {Function} props.onDelete - 删除成功回调
 */
const AssistantDetail = ({ assistantId, onEdit, onBack, onDelete }) => {
  const navigate = useNavigate();
  
  // 状态管理
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
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
  
  // 使用API执行钩子删除助手
  const [deleteAssistant, deleteResult, isDeleting, deleteError] = useApiExecution(
    AssistantService.deleteAssistant,
    {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: '助手删除成功！',
          severity: 'success'
        });
        
        // 延迟后关闭对话框并执行回调
        setTimeout(() => {
          if (onDelete) onDelete();
          else onBack(); // 如果没有提供删除回调，则返回列表
        }, 1500);
      },
      onError: (error) => {
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: `删除失败: ${error.message}`,
          severity: 'error'
        });
      }
    }
  );

  // 处理编辑按钮点击
  const handleEdit = () => {
    if (onEdit) {
      onEdit(assistant);
    } else {
      // 如果没有提供编辑回调，则导航到编辑页面
      navigate(`/ai-settings/${assistantId}`, { state: { assistant } });
    }
  };
  
  // 处理删除按钮点击
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  // 确认删除
  const handleConfirmDelete = async () => {
    if (assistant && assistant.UserId) {
      await deleteAssistant(assistantId, assistant.UserId);
    }
  };
  
  // 取消删除
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };
  
  // 关闭提示弹窗
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
    <>
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
            
            <Box display="flex" gap={1}>
              <Button 
                startIcon={<EditIcon />} 
                variant="outlined"
                onClick={handleEdit}
              >
                编辑
              </Button>
              <Button 
                startIcon={<DeleteIcon />} 
                variant="outlined"
                color="error"
                onClick={handleDeleteClick}
              >
                删除
              </Button>
            </Box>
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
      
      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={!isDeleting ? handleCancelDelete : undefined}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          确认删除
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            您确定要删除助手"{assistant.Name}"吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancelDelete} 
            disabled={isDeleting}
          >
            取消
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            autoFocus
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? '删除中...' : '确认删除'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 提示信息 */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AssistantDetail; 