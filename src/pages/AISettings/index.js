import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  InputAdornment,
  IconButton,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  backgroundColor: '#FFFFFF',
  minHeight: 'calc(100vh - 64px)',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 500,
  color: '#333333',
  marginBottom: theme.spacing(1),
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#666666',
  marginBottom: theme.spacing(4),
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  color: '#333333',
  marginBottom: theme.spacing(3),
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginRight: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: theme.palette.grey[200],
}));

const CameraIconWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.common.white,
  borderRadius: '50%',
  padding: theme.spacing(0.5),
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  '& .name': {
    fontSize: '16px',
    fontWeight: 500,
    color: '#333333',
    marginBottom: theme.spacing(0.5),
  },
  '& .title': {
    fontSize: '14px',
    color: '#666666',
  },
  '& .experience': {
    fontSize: '14px',
    color: '#666666',
    marginTop: theme.spacing(0.5),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F5F7F5',
  },
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

const AddQuestionButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E5E5E5',
    },
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  flexShrink: 0,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  height: '40px',
  padding: '0 16px',
  minWidth: '100px',
  whiteSpace: 'nowrap',
  textTransform: 'none',
  boxShadow: 'none',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  '& .icon': {
    fontSize: '18px',
    marginRight: '2px',
  },
}));

const KnowledgeGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const KnowledgeCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E5E5',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderColor: theme.palette.primary.main,
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  color: '#333333',
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#666666',
  marginBottom: theme.spacing(2),
  minHeight: '40px',
}));

const CardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: '1px solid #E5E5E5',
  paddingTop: theme.spacing(2),
}));

const CardStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  color: '#666666',
  fontSize: '12px',
}));

const CardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

const Pagination = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const PageButton = styled(Button)(({ theme, active }) => ({
  minWidth: '32px',
  height: '32px',
  padding: 0,
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? '#FFFFFF' : '#666666',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : 'rgba(0, 0, 0, 0.04)',
  },
}));

function AISettings() {
  const [settings, setSettings] = useState({
    specialties: '',
    questionStyle: '',
    specialQuestion: '',
    fixedAnswer: '',
    searchQuery: '',
  });

  // 模拟知识库数据
  const mockKnowledgeBase = [
    {
      id: 1,
      title: '市场营销策略',
      description: '收集整理市场分析报告和营销策略方案',
      date: '2023-12-10',
      filesCount: 15,
    },
    {
      id: 2,
      title: '技术研发资料',
      description: '核心技术文档和研发成果记录',
      date: '2023-12-05',
      filesCount: 42,
    },
    {
      id: 3,
      title: '人力资源制度',
      description: '公司人事制度和员工手册文档',
      date: '2023-11-28',
      filesCount: 19,
    },
    {
      id: 4,
      title: '财务管理规范',
      description: '财务制度和税务流程指南',
      date: '2023-11-25',
      filesCount: 23,
    },
  ];

  const handleChange = (field) => (event) => {
    setSettings({
      ...settings,
      [field]: event.target.value,
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
                <CameraAltIcon />
              </StyledAvatar>
              <CameraIconWrapper>
                <CameraAltIcon fontSize="small" />
              </CameraIconWrapper>
            </AvatarWrapper>
            <UserInfo>
              <Typography className="name">张志远</Typography>
              <Typography className="title">新加坡跨境电商顾问</Typography>
              <Typography className="experience">10年经验</Typography>
            </UserInfo>
          </ProfileSection>
          <StyledTextField
            fullWidth
            placeholder="如：专业、发表、微软等"
            value={settings.specialties}
            onChange={handleChange('specialties')}
            variant="outlined"
            label="性格特征"
          />
        </Section>

        <Section>
          <SectionTitle>问答设置</SectionTitle>
          <StyledTextField
            fullWidth
            multiline
            rows={4}
            placeholder="请输入用户声明的问候语"
            value={settings.questionStyle}
            onChange={handleChange('questionStyle')}
            variant="outlined"
            label="问候语"
          />
          
          <Box sx={{ mt: 3 }}>
            <SectionTitle>特殊问题</SectionTitle>
            <StyledTextField
              fullWidth
              placeholder="请输入特殊问题"
              value={settings.specialQuestion}
              onChange={handleChange('specialQuestion')}
              variant="outlined"
            />
            <StyledTextField
              fullWidth
              multiline
              rows={4}
              placeholder="请输入该问题的固定回答"
              value={settings.fixedAnswer}
              onChange={handleChange('fixedAnswer')}
              variant="outlined"
            />
            <AddQuestionButton>
              + 添加更多问题
            </AddQuestionButton>
          </Box>
        </Section>

        <Section>
          <SectionTitle>知识库管理</SectionTitle>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <SearchField
              fullWidth
              placeholder="搜索知识库..."
              value={settings.searchQuery}
              onChange={handleChange('searchQuery')}
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
              >
                新建文档
              </ActionButton>
              <ActionButton 
                variant="contained" 
                color="primary"
                startIcon={<span className="icon">↑</span>}
              >
                上传文档
              </ActionButton>
              <ActionButton 
                variant="contained" 
                color="primary"
                startIcon={<span className="icon">⇧</span>}
              >
                上传bot
              </ActionButton>
            </ActionButtons>
          </Box>

          <KnowledgeGrid>
            {mockKnowledgeBase.map((item) => (
              <KnowledgeCard key={item.id}>
                <CardTitle>
                  {item.title}
                  <EditIcon fontSize="small" sx={{ color: '#666666', cursor: 'pointer' }} />
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <CardFooter>
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
                </CardFooter>
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
        </Section>

        <ButtonGroup>
          <Button variant="outlined" color="primary">
            取消
          </Button>
          <Button variant="contained" color="primary">
            保存设置
          </Button>
        </ButtonGroup>
      </Container>
    </PageContainer>
  );
}

export default AISettings; 