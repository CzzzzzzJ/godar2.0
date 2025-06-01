import React, { useState } from "react";
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../contexts/AuthContext";
import { AssistantService } from "../services";
import useApi from "../hooks/useApi";
import { useApiExecution } from "../hooks/useApi";
import AssistantDetail from "../components/AssistantDetail";
import AssistantForm from "../components/AssistantForm";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { deleteFetcher, getFetcher } from "../utils/request/fetcher";
import useSWRMutation from "swr/mutation";
import { get } from "../utils/request";
import { GODAR_REQUEST_URL } from "../config";

const ProfileInfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

const AssistantCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const Profile = () => {
  const [userInfo, setUserInfo] = React.useState({});
  const userId = userInfo.id;
  const navigate = useNavigate();
  const {
    data: assistants,
    mutate: refreshAssistants,
    isLoading: loading,
    error,
  } = useSWR(userId ? `/AIAssistant/${userId}` : null, getFetcher);

  // 状态管理
  const [selectedAssistantId, setSelectedAssistantId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assistantToDelete, setAssistantToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  React.useEffect(() => {
    get({ url: GODAR_REQUEST_URL + "/loginRegister/getUserInfo" }).then(
      ({ data }) => {
        setUserInfo(data);
      }
    );
  }, []);

  // 确保assistants是数组
  const assistantsList = Array.isArray(assistants) ? assistants : [];

  const { trigger: deleteAssistant, isMutating: isDeleting } = useSWRMutation(
    selectedAssistantId ? `/AIAssistant/${selectedAssistantId}` : null,
    deleteFetcher,
    {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: "助手删除成功！",
          severity: "success",
        });
        setDeleteDialogOpen(false);
        refreshAssistants();
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `删除失败: ${error.message}`,
          severity: "error",
        });
        setDeleteDialogOpen(false);
      },
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

  // 打开创建助手表单
  const handleOpenCreateForm = () => {
    navigate("/ai-settings");
  };

  // 处理编辑助手
  const handleEditAssistant = (assistant) => {
    navigate(`/ai-settings/${assistant.AssistantId}`, { state: { assistant } });
  };

  // 处理删除助手
  const handleDeleteAssistant = (selectedAssistantId) => () => {
    setSelectedAssistantId(selectedAssistantId);
    refreshAssistants();
  };

  // 打开删除确认对话框
  const handleOpenDeleteDialog = (assistant, event) => {
    // 阻止事件冒泡，避免触发卡片的查看详情
    event.stopPropagation();
    setAssistantToDelete(assistant);
    setDeleteDialogOpen(true);
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (assistantToDelete) {
      await deleteAssistant(assistantToDelete.AssistantId, userId);
    }
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAssistantToDelete(null);
  };

  // 关闭提示弹窗
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // 关闭表单
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAssistant(null);
  };

  // 处理表单提交成功
  const handleFormSuccess = () => {
    refreshAssistants();
  };

  // 格式化日期显示
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
          onDelete={handleDeleteAssistant(selectedAssistantId)}
        />
      );
    }

    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography color="error" align="center">
          {error.message || "获取AI助手数据失败，请稍后再试"}
        </Typography>
      );
    }

    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateForm}
          >
            创建新助手
          </Button>
        </Box>

        {assistantsList.length === 0 ? (
          <Typography align="center" color="text.secondary">
            您还没有创建AI助手，点击上方按钮创建第一个助手
          </Typography>
        ) : (
          <List>
            {assistantsList.map((assistant) => (
              <AssistantCard key={assistant.AssistantId}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <SmartToyIcon />
                    </Avatar>
                  }
                  title={<Typography variant="h6">{assistant.Name}</Typography>}
                  subheader={`创建于: ${formatDate(assistant.CreatedAt)}`}
                  action={
                    <Box display="flex">
                      <IconButton
                        aria-label="删除助手"
                        onClick={(e) => handleOpenDeleteDialog(assistant, e)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="查看详情"
                        onClick={() => handleViewDetail(assistant.AssistantId)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Box>
                  }
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {assistant.Greeting}
                  </Typography>
                  <Box>
                    {assistant.PersonalityTraits &&
                    typeof assistant.PersonalityTraits === "string"
                      ? assistant.PersonalityTraits.split(",").map(
                          (trait, index) => (
                            <Chip
                              key={index}
                              label={trait.trim()}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          )
                        )
                      : null}
                  </Box>
                </CardContent>
              </AssistantCard>
            ))}
          </List>
        )}
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* 个人信息部分 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                src={userInfo.avatar}
                alt={userInfo.accountName}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h5" fontWeight="bold">
                {userInfo.accountName || "用户名"}
              </Typography>
              <Chip
                label={`${userInfo.tokens || 0} Tokens`}
                color="primary"
                sx={{ mt: 1 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              个人资料
            </Typography>

            <ProfileInfoItem>
              <PersonIcon />
              <Typography>用户ID: {userId}</Typography>
            </ProfileInfoItem>

            <ProfileInfoItem>
              <EmailIcon />
              <Typography>邮箱: {userInfo.email || "未设置"}</Typography>
            </ProfileInfoItem>

            {userInfo.createTime && (
              <ProfileInfoItem>
                <Typography variant="body2" color="text.secondary">
                  账户创建于: {formatDate(userInfo.createTime)}
                </Typography>
              </ProfileInfoItem>
            )}
          </Paper>
        </Grid>

        {/* AI助手部分 */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5">
                {selectedAssistantId ? "助手详情" : "我的AI助手"}
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

      {/* 创建/编辑助手表单对话框 */}
      <AssistantForm
        open={isFormOpen}
        onClose={handleCloseForm}
        initialData={editingAssistant}
        userId={userId}
        onSuccess={handleFormSuccess}
      />

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={!isDeleting ? handleCancelDelete : undefined}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            您确定要删除助手"{assistantToDelete?.Name}"吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={isDeleting}>
            取消
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? "删除中..." : "确认删除"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 提示信息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
