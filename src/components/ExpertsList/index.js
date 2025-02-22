import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpertCard from '../ExpertCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SectionTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '& h2': {
    fontSize: '18px',
    fontWeight: 500,
    color: '#333333',
  },
}));

const ViewMoreButton = styled(Button)(({ theme }) => ({
  color: '#666666',
  fontSize: '14px',
  padding: '4px 8px',
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

const ExpertsGrid = styled(Grid)(({ theme }) => ({
  margin: '0 -8px',
  width: 'calc(100% + 16px)',
  '& .MuiGrid-item': {
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
}));

// 模拟数据，后续可以通过API获取
const mockExperts = [
  {
    id: 1,
    avatar: '/avatars/expert1.jpg',
    name: 'Dr. Jacky Tong',
    title: '新加坡跨境电商顾问',
    location: '深圳',
    specialty: '跨境电商',
    responseRate: 95,
    todayResponses: 40,
    experience: '10年经验',
  },
  {
    id: 2,
    avatar: '/avatars/expert2.jpg',
    name: 'Dr. Jacky Tong',
    title: '新加坡跨境电商顾问',
    location: '深圳',
    specialty: '跨境电商',
    responseRate: 93,
    todayResponses: 40,
    experience: '10年经验',
  },
  {
    id: 3,
    avatar: '/avatars/expert3.jpg',
    name: 'Dr. Jacky Tong',
    title: '新加坡跨境电商顾问',
    location: '深圳',
    specialty: '跨境电商',
    responseRate: 95,
    todayResponses: 40,
    experience: '10年经验',
  },
  {
    id: 4,
    avatar: '/avatars/expert4.jpg',
    name: 'Dr. Jacky Tong',
    title: '新加坡跨境电商顾问',
    location: '深圳',
    specialty: '跨境电商',
    responseRate: 95,
    todayResponses: 40,
    experience: '10年经验',
  },
  {
    id: 5,
    avatar: '/avatars/expert5.jpg',
    name: 'Dr. Jacky Tong',
    title: '新加坡跨境电商顾问',
    location: '深圳',
    specialty: '跨境电商',
    responseRate: 95,
    todayResponses: 40,
    experience: '10年经验',
  },
];

function ExpertsList() {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      <SectionTitle>
        <Typography variant="h2" component="h2">
          注册跨境专家
        </Typography>
        <ViewMoreButton 
          endIcon={<ArrowForwardIcon />}
          disableRipple
          onClick={() => navigate('/experts')}
        >
          查看更多
        </ViewMoreButton>
      </SectionTitle>
      
      <ExpertsGrid container>
        {mockExperts.map((expert) => (
          <Grid item xs={12} sm={6} md={3} lg={2.4} key={expert.id}>
            <ExpertCard expert={expert} />
          </Grid>
        ))}
      </ExpertsGrid>
    </Box>
  );
}

export default ExpertsList; 