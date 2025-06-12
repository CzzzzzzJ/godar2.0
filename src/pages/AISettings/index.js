import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { AssistantService } from "../../services";
import { useApiExecution } from "../../hooks/useApi";
import { useAuth } from "../../contexts/AuthContext";
import {
  getFetcher,
  postFetcher,
  putFetcher,
} from "../../utils/request/fetcher";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import Modal from "../../components/Modal";
import KnowledgeCategoryForm from "./components/KnowledgeCategoryForm";
import KnowledgeDocumentForm from "./components/KnowledgeDocumentForm";
import { get } from "../../utils/request";
import { GODAR_REQUEST_FILE_URL, GODAR_REQUEST_URL } from "../../config";
import DocumentList from "./components/DocumentList";
import localStorage from "../../utils/storage";

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  backgroundColor: "#FFFFFF",
  minHeight: "calc(100vh - 64px)",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 500,
  color: "#333333",
  marginBottom: theme.spacing(1),
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#666666",
  marginBottom: theme.spacing(4),
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#333333",
  marginBottom: theme.spacing(3),
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  marginRight: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: theme.palette.grey[200],
}));

const CameraIconWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.common.white,
  borderRadius: "50%",
  padding: theme.spacing(0.5),
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  "& .name": {
    fontSize: "16px",
    fontWeight: 500,
    color: "#333333",
    marginBottom: theme.spacing(0.5),
  },
  "& .title": {
    fontSize: "14px",
    color: "#666666",
  },
  "& .experience": {
    fontSize: "14px",
    color: "#666666",
    marginTop: theme.spacing(0.5),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#F5F7F5",
  },
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

const AddQuestionButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: "transparent",
    textDecoration: "underline",
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#FFFFFF",
    "& fieldset": {
      borderColor: "#E5E5E5",
    },
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
  flexShrink: 0,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  height: "40px",
  padding: "0 16px",
  minWidth: "100px",
  whiteSpace: "nowrap",
  textTransform: "none",
  boxShadow: "none",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  "& .icon": {
    fontSize: "18px",
    marginRight: "2px",
  },
}));

const KnowledgeGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const KnowledgeCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E5E5",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderColor: theme.palette.primary.main,
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: "#333333",
  marginBottom: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#666666",
  marginBottom: theme.spacing(2),
  minHeight: "40px",
}));

const CardFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderTop: "1px solid #E5E5E5",
  paddingTop: theme.spacing(2),
}));

const CardStats = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  color: "#666666",
  fontSize: "12px",
}));

const CardActions = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
}));

const Pagination = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const PageButton = styled(Button)(({ theme, active }) => ({
  minWidth: "32px",
  height: "32px",
  padding: 0,
  backgroundColor: active ? theme.palette.primary.main : "transparent",
  color: active ? "#FFFFFF" : "#666666",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.dark
      : "rgba(0, 0, 0, 0.04)",
  },
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// // 模拟知识库数据
// const mockKnowledgeBase = [
//   {
//     id: 1,
//     title: "市场营销策略",
//     description: "收集整理市场分析报告和营销策略方案",
//     date: "2023-12-10",
//     filesCount: 15,
//   },
//   {
//     id: 2,
//     title: "技术研发资料",
//     description: "核心技术文档和研发成果记录",
//     date: "2023-12-05",
//     filesCount: 42,
//   },
//   {
//     id: 3,
//     title: "人力资源制度",
//     description: "公司人事制度和员工手册文档",
//     date: "2023-11-28",
//     filesCount: 19,
//   },
//   {
//     id: 4,
//     title: "财务管理规范",
//     description: "财务制度和税务流程指南",
//     date: "2023-11-25",
//     filesCount: 23,
//   },
// ];

function AISettings() {
  const navigate = useNavigate();
  const params = useParams();
  const modalRef = React.useRef();
  const documentModalRef = React.useRef();
  const [userInfo, setUserInfo] = React.useState({});
  const userId = userInfo.id;
  const [categoryId, setCategoryId] = React.useState();

  React.useEffect(() => {
    get({ url: GODAR_REQUEST_URL + "/loginRegister/getUserInfo" }).then(
      ({ data }) => {
        setUserInfo(data);
      }
    );
  }, []);

  const { trigger: getKnowledgeCategories, data: knowledgeCategoryList } =
    useSWRMutation(
      params.assistantId ? `/Knowledge/categories/${params.assistantId}` : null,
      getFetcher
    );

  const { trigger: postKnowledgeDocuments } = useSWRMutation(
    `/Knowledge/documents`,
    postFetcher
  );

  // const { trigger: getQuestions, data: questions } = useSWRMutation(
  //   `/AIAssistant/questions/${params.assistantId}`,
  //   getFetcher
  // );

  const { trigger: getAssistantDetails } = useSWRMutation(
    `/AIAssistant/details/${params.assistantId}`,
    getFetcher,
    {
      onSuccess: (result) => {
        setSettings(result);
      },
    }
  );

  const { trigger: createAssistant, isMutating: isCreating } = useSWRMutation(
    "/AIAssistant",
    postFetcher,
    {
      onSuccess: (result) => {
        setSnackbar({
          open: true,
          message: "AI助手创建成功！",
          severity: "success",
        });

        // 延迟后跳转到个人页面
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `创建失败: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const { trigger: updateAssistant, isMutating: isUpdating } = useSWRMutation(
    "/AIAssistant",
    putFetcher,
    {
      onSuccess: (result) => {
        setSnackbar({
          open: true,
          message: "AI助手更新成功！",
          severity: "success",
        });

        // 延迟后跳转到个人页面
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `更新失败: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  React.useEffect(() => {
    if (params.assistantId) {
      getAssistantDetails();
      getKnowledgeCategories();
      // getQuestions();
    }
  }, [params.assistantId, getAssistantDetails, getKnowledgeCategories]);

  // 表单状态
  const [settings, setSettings] = useState({
    Name: "",
    Greeting: "",
    PersonalityTraits: "",
    searchQuery: "",
  });

  // 表单错误状态
  const [errors, setErrors] = useState({});

  // 弹窗状态
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCreateKnowledge = () => {
    modalRef.current?.onToggle();
    // postKnowledgeDocuments({
    //   CategoryId: 3,
    //   Title: "市场营销策略",
    //   Content: "收集整理市场分析报告和营销策略方案",
    //   FileType: "string",
    //   FilePath: "string",
    // });
  };

  // 处理表单字段变更
  const handleChange = (field) => (event) => {
    setSettings({
      ...settings,
      [field]: event.target.value,
    });

    // 清除相关字段的错误
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};

    if (!settings.Name.trim()) {
      newErrors.Name = "助手名称不能为空";
    }

    if (!settings.Greeting.trim()) {
      newErrors.Greeting = "问候语不能为空";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "请完善表单信息",
        severity: "warning",
      });
      return;
    }

    // 构建请求数据
    const assistantData = {
      UserId: userId,
      Name: settings.Name,
      Greeting: settings.Greeting,
      PersonalityTraits: settings.PersonalityTraits,
      ...(params.assistantId && { assistantId: params.assistantId }),
    };

    const handler = params.assistantId ? updateAssistant : createAssistant;

    // 调用API创建助手
    await handler(assistantData);
  };

  // 处理取消操作
  const handleCancel = () => {
    navigate("/profile");
  };

  // 关闭提示弹窗
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleEnterCategory = (data) => () => {
    setCategoryId(data);
  };

  const handleUpload = (event) => {
    const userToken = localStorage.get("userToken");
    const { files } = event.target;
    const file = files[0];
    console.log(file);

    const formData = new FormData();
    formData.append("file", file);

    fetch(GODAR_REQUEST_FILE_URL + "/upload", {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${userToken}` },
    });
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <Title>AI 助理设置</Title>
        <Subtitle>配置您的 AI 数字助理</Subtitle>

        <Section>
          <SectionTitle>基础设置</SectionTitle>
          <ProfileSection>
            <AvatarWrapper>
              <StyledAvatar>
                <CameraAltIcon onClick={handleUpload} />
                <input type="file" onChange={handleUpload} />
              </StyledAvatar>
              <CameraIconWrapper>
                <CameraAltIcon fontSize="small" />
              </CameraIconWrapper>
            </AvatarWrapper>
            <UserInfo>
              <Typography className="name">
                {userInfo.name || "用户名"}
              </Typography>
              <Typography className="title">AI助手创建者</Typography>
            </UserInfo>
          </ProfileSection>
          <StyledTextField
            fullWidth
            placeholder="如：专业、幽默、严谨等"
            value={settings.PersonalityTraits}
            onChange={handleChange("PersonalityTraits")}
            variant="outlined"
            label="性格特征"
            error={!!errors.PersonalityTraits}
            helperText={
              errors.PersonalityTraits ||
              '多个特点用逗号分隔，如"专业,高效,细致"'
            }
          />
          <StyledTextField
            fullWidth
            placeholder="请输入助手名称"
            value={settings.Name}
            onChange={handleChange("Name")}
            variant="outlined"
            label="助手名称"
            required
            error={!!errors.Name}
            helperText={errors.Name}
          />
        </Section>

        <Section>
          <SectionTitle>问答设置</SectionTitle>
          <StyledTextField
            fullWidth
            multiline
            rows={4}
            placeholder="请输入AI助手的问候语"
            value={settings.Greeting}
            onChange={handleChange("Greeting")}
            variant="outlined"
            label="问候语"
            required
            error={!!errors.Greeting}
            helperText={errors.Greeting}
          />

          <Box sx={{ mt: 3 }}>
            <SectionTitle>特殊问题</SectionTitle>
            <StyledTextField
              fullWidth
              placeholder="请输入特殊问题"
              value={settings.specialQuestion}
              onChange={handleChange("specialQuestion")}
              variant="outlined"
            />
            <StyledTextField
              fullWidth
              multiline
              rows={4}
              placeholder="请输入该问题的固定回答"
              value={settings.fixedAnswer}
              onChange={handleChange("fixedAnswer")}
              variant="outlined"
            />
            <AddQuestionButton>+ 添加更多问题</AddQuestionButton>
          </Box>
        </Section>

        <Section>
          <SectionTitle>知识库管理</SectionTitle>

          {!categoryId ? (
            <React.Fragment>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <SearchField
                  fullWidth
                  placeholder="搜索知识库..."
                  value={settings.searchQuery}
                  onChange={handleChange("searchQuery")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <ActionButtons>
                  <ActionButton
                    variant="contained"
                    color="primary"
                    startIcon={<span className="icon">+</span>}
                    onClick={handleCreateKnowledge}
                  >
                    新建分类
                  </ActionButton>
                  {/* <ActionButton
                variant="contained"
                color="primary"
                startIcon={<span className="icon">↑</span>}
                onClick={handleCreateDocument}
              >
                上传文档
              </ActionButton>
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={<span className="icon">⇧</span>}
              >
                上传bot
              </ActionButton> */}
                </ActionButtons>
              </Box>
              {knowledgeCategoryList?.length > 0 && (
                <React.Fragment>
                  <KnowledgeGrid>
                    {knowledgeCategoryList.map((item) => (
                      <KnowledgeCard
                        key={item.id}
                        onClick={handleEnterCategory(item.CategoryId)}
                      >
                        <CardTitle>
                          {item.CategoryName}
                          <EditIcon
                            onClick={() => {
                              modalRef.current.onToggle(item);
                            }}
                            fontSize="small"
                            sx={{ color: "#666666", cursor: "pointer" }}
                          />
                        </CardTitle>
                        <CardDescription>{item.Description}</CardDescription>
                        {/* <CardFooter>
                      <CardStats>
                        <span>📅 {item.date}</span>
                        <span>📄 {item.filesCount} 个文档</span>
                      </CardStats>
                      <CardActions>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </CardActions>
                    </CardFooter> */}
                      </KnowledgeCard>
                    ))}
                  </KnowledgeGrid>

                  <Pagination>
                    <Button size="small">上一页</Button>
                    <PageButton active={true}>1</PageButton>
                    <PageButton>2</PageButton>
                    <PageButton>3</PageButton>
                    <Button size="small">下一页</Button>
                  </Pagination>
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <DocumentList categoryId={categoryId} />
          )}
        </Section>

        <ButtonGroup>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCancel}
            disabled={isCreating || isUpdating}
          >
            取消
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
            startIcon={
              isCreating || isUpdating ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isCreating || isUpdating
              ? !params.assistantId
                ? "创建中..."
                : "更新中..."
              : "保存设置"}
          </Button>
        </ButtonGroup>
      </Container>

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
      <Modal ref={modalRef} title="新建分类">
        <KnowledgeCategoryForm onRefresh={getKnowledgeCategories} />
      </Modal>
    </PageContainer>
  );
}

export default AISettings;
