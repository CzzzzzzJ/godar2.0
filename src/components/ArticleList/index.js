import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const HeaderRight = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 500,
  color: '#333333',
}));

const CreateButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  padding: '6px 16px',
  borderRadius: '4px',
  fontSize: '14px',
  height: '32px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '16px',
    marginRight: '4px',
  },
}));

const ViewMoreButton = styled(Button)(({ theme }) => ({
  color: '#666666',
  fontSize: '14px',
  padding: '6px 8px',
  height: '32px',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
  '& .MuiButton-endIcon': {
    marginLeft: '4px',
    '& svg': {
      fontSize: '16px',
    },
  },
}));

const ArticleCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E5E5',
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    borderColor: theme.palette.primary.main,
  },
}));

const ArticleImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '160px',
  borderRadius: theme.shape.borderRadius,
  objectFit: 'cover',
  marginBottom: theme.spacing(2),
}));

const ArticleContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const ArticleTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  color: '#333333',
  marginBottom: theme.spacing(1),
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  lineHeight: 1.4,
}));

const ArticleDescription = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#666666',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  lineHeight: 1.5,
}));

const ArticleStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  color: '#666666',
  fontSize: '12px',
  marginTop: 'auto',
}));

const ArticleInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const AuthorInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
}));

const InfoText = styled(Typography)({
  fontSize: '12px',
  color: '#666666',
});

// 模拟数据
const mockArticles = [
  {
    id: 1,
    image: '/images/article1.jpg',
    title: '2024年跨境电商行业趋势分析',
    description: '深入解析跨境电商最新发展趋势，预计新兴市场机遇与挑战',
    author: {
      avatar: '/avatars/expert1.jpg',
      name: 'Dr. 王秋菊',
      title: '跨境电商顾问'
    },
    readCount: '2.3k',
    likeCount: '526',
    date: '2024-01-15'
  },
  {
    id: 2,
    image: '/images/article2.jpg',
    title: '全球供应链优化策略与实践',
    description: '探讨跨境贸易中的供应链优化方案，提升企业效率与竞争力',
    author: {
      avatar: '/avatars/expert2.jpg',
      name: 'Dr. 林琦琳',
      title: '英国法律顾问'
    },
    readCount: '1.8k',
    likeCount: '438',
    date: '2024-01-12'
  },
  {
    id: 3,
    image: '/images/article3.jpg',
    title: '跨境企业税务规划指南',
    description: '深入剖析国际税收政策，为企业提供合规且优化的税务方案',
    author: {
      avatar: '/avatars/expert3.jpg',
      name: 'Dr. 李明远',
      title: '美国注册税务师'
    },
    readCount: '1.5k',
    likeCount: '392',
    date: '2024-01-10'
  },
  {
    id: 4,
    image: '/images/article4.jpg',
    title: '跨境企业税务规划指南',
    description: '深入剖析国际税收政策，为企业提供合规且优化的税务方案',
    author: {
      avatar: '/avatars/expert4.jpg',
      name: 'Dr. 李明远',
      title: '美国注册税务师'
    },
    readCount: '1.5k',
    likeCount: '392',
    date: '2024-01-10'
  }
];

function ArticleList() {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 4 }}>
      <SectionHeader>
        <Title variant="h2">热门文章推荐</Title>
        <HeaderRight>
          <CreateButton
            variant="contained"
            startIcon={<AddIcon />}
            disableElevation
          >
            创建文章
          </CreateButton>
          <ViewMoreButton 
            endIcon={<ArrowForwardIcon />}
            disableRipple
          >
            查看更多
          </ViewMoreButton>
          <Box component="span" sx={{ 
            color: '#666666',
            fontSize: '14px',
          }}>
            {'>'}
          </Box>
        </HeaderRight>
      </SectionHeader>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
        {mockArticles.map((article) => (
          <ArticleCard key={article.id}>
            <ArticleImage src={article.image} alt={article.title} />
            <ArticleContent>
              <AuthorInfo>
                <StyledAvatar src={article.author.avatar} alt={article.author.name} />
                <Box>
                  <InfoText sx={{ fontWeight: 500 }}>{article.author.name}</InfoText>
                  <InfoText>{article.author.title}</InfoText>
                </Box>
              </AuthorInfo>
              
              <Box>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleDescription>{article.description}</ArticleDescription>
              </Box>

              <ArticleStats>
                <Box component="span">阅读量 {article.readCount}</Box>
                <Box component="span">收藏 {article.likeCount}</Box>
                <Box component="span" sx={{ marginLeft: 'auto' }}>{article.date}</Box>
              </ArticleStats>
            </ArticleContent>
          </ArticleCard>
        ))}
      </Box>
    </Box>
  );
}

export default ArticleList; 