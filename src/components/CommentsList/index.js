import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, Grid, Rating } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 500,
  color: '#333333',
}));

const ViewMore = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: '#666666',
  fontSize: '14px',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '16px',
  },
}));

const CommentCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#FFFFFF',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid #E5E5E5',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    borderColor: theme.palette.primary.main,
  },
}));

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
});

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  marginRight: theme.spacing(2),
}));

const UserName = styled(Typography)({
  fontSize: '16px',
  fontWeight: 500,
  color: '#333333',
  marginBottom: '4px',
});

const StyledRating = styled(Rating)({
  fontSize: '16px',
  color: '#FFB800',
});

const CommentContent = styled(Typography)({
  fontSize: '14px',
  color: '#666666',
  lineHeight: 1.6,
  marginBottom: '12px',
});

const CommentDate = styled(Typography)({
  fontSize: '12px',
  color: '#999999',
});

// 模拟数据
const comments = [
  {
    id: 1,
    user: {
      name: '陈美玲',
      avatar: '/avatars/user1.jpg',
    },
    rating: 5,
    content: '王教授博士士的建议非常专业且实用。她帮助我们解决了中印贸易中的多个难题，尤其是在海关申报和税务规划方面的建议让我们避免了很多潜在风险。',
    date: '2024-01-18',
  },
  {
    id: 2,
    user: {
      name: '张英远',
      avatar: '/avatars/user2.jpg',
    },
    rating: 5,
    content: '李明远博士士对跨境税收政策的见解非常深入，为我们公司制定的税务优化方案既合规又高效，帮助我们节省了大量成本。',
    date: '2024-01-17',
  },
  {
    id: 3,
    user: {
      name: '林琦琳',
      avatar: '/avatars/user3.jpg',
    },
    rating: 4.5,
    content: '如前面总结在线咨询在马来西亚面临的经营挑战。她的建议既实用又具有前瞻性，帮助我们规避了很多潜在风险。',
    date: '2024-01-16',
  },
];

function CommentsList() {
  return (
    <Box sx={{ mb: 6 }}>
      <SectionHeader>
        <Title>用户评价</Title>
        <ViewMore>
          查看更多
          <ArrowForwardIcon />
        </ViewMore>
      </SectionHeader>

      <Grid container spacing={2}>
        {comments.map((comment) => (
          <Grid item xs={12} sm={6} md={4} key={comment.id}>
            <CommentCard>
              <UserInfo>
                <UserAvatar src={comment.user.avatar} alt={comment.user.name} />
                <Box>
                  <UserName>{comment.user.name}</UserName>
                  <StyledRating 
                    value={comment.rating} 
                    precision={0.5} 
                    readOnly 
                  />
                </Box>
              </UserInfo>
              <CommentContent>{comment.content}</CommentContent>
              <CommentDate>{comment.date}</CommentDate>
            </CommentCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CommentsList; 