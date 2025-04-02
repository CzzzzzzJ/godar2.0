import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { AssistantService } from '../services';
import { useApiExecution } from '../hooks/useApi';

/**
 * AI助手表单组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.open - 对话框是否打开
 * @param {Function} props.onClose - 关闭回调函数
 * @param {Object} props.initialData - 初始数据（用于编辑模式）
 * @param {string} props.userId - 用户ID
 * @param {Function} props.onSuccess - 成功回调函数
 */
const AssistantForm = ({ open, onClose, initialData, userId, onSuccess }) => {
  // 判断是创建模式还是编辑模式
  const isEditMode = !!initialData;
  
  // 表单状态
  const [form, setForm] = useState({
    Name: '',
    Greeting: '',
    PersonalityTraits: '',
  });
  
  // 表单错误状态
  const [errors, setErrors] = useState({});
  
  // 弹窗状态
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // 使用API执行钩子
  const [createAssistant, createResult, isCreating, createError] = useApiExecution(
    AssistantService.createAssistant,
    {
      onSuccess: (result) => {
        setSnackbar({
          open: true,
          message: '助手创建成功！',
          severity: 'success'
        });
        
        // 延迟关闭对话框，给用户反馈时间
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess(result);
        }, 1000);
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `创建失败: ${error.message}`,
          severity: 'error'
        });
      }
    }
  );
  
  // 使用API执行钩子 - 更新助手
  const [updateAssistant, updateResult, isUpdating, updateError] = useApiExecution(
    AssistantService.updateAssistant,
    {
      onSuccess: (result) => {
        setSnackbar({
          open: true,
          message: '助手更新成功！',
          severity: 'success'
        });
        
        // 延迟关闭对话框，给用户反馈时间
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess(result);
        }, 1000);
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `更新失败: ${error.message}`,
          severity: 'error'
        });
      }
    }
  );
  
  // 初始化表单数据
  useEffect(() => {
    if (isEditMode && initialData) {
      setForm({
        Name: initialData.Name || '',
        Greeting: initialData.Greeting || '',
        PersonalityTraits: initialData.PersonalityTraits || '',
      });
    } else {
      // 重置表单
      setForm({
        Name: '',
        Greeting: '',
        PersonalityTraits: '',
      });
    }
    
    // 重置错误
    setErrors({});
  }, [isEditMode, initialData, open]);
  
  // 表单字段变更处理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除相关字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.Name.trim()) {
      newErrors.Name = '助手名称不能为空';
    }
    
    if (!form.Greeting.trim()) {
      newErrors.Greeting = '问候语不能为空';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const assistantData = {
      ...form,
      UserId: userId,
    };
    
    if (isEditMode) {
      await updateAssistant(initialData.AssistantId, assistantData);
    } else {
      await createAssistant(assistantData);
    }
  };
  
  // 关闭弹窗
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
  
  // 是否处于加载状态
  const isLoading = isCreating || isUpdating;
  // 是否发生错误
  const error = createError || updateError;
  
  return (
    <>
      <Dialog 
        open={open} 
        onClose={!isLoading ? onClose : undefined}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? '编辑AI助手' : '创建新AI助手'}
        </DialogTitle>
        
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Name"
              label="助手名称"
              name="Name"
              value={form.Name}
              onChange={handleChange}
              error={!!errors.Name}
              helperText={errors.Name}
              disabled={isLoading}
              autoFocus
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="Greeting"
              label="问候语"
              name="Greeting"
              value={form.Greeting}
              onChange={handleChange}
              error={!!errors.Greeting}
              helperText={errors.Greeting}
              disabled={isLoading}
              multiline
              rows={3}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="PersonalityTraits"
              label="性格特点"
              name="PersonalityTraits"
              value={form.PersonalityTraits}
              onChange={handleChange}
              error={!!errors.PersonalityTraits}
              helperText={errors.PersonalityTraits || "多个特点用逗号分隔，如\"专业,高效,细致\""}
              disabled={isLoading}
            />
            
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error.message}
              </Typography>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={onClose} 
            disabled={isLoading}
            color="inherit"
          >
            取消
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            color="primary"
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? '处理中...' : isEditMode ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default AssistantForm; 