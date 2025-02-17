import React from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, Grid, Button } from '@mui/material';

const CommentCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
});

const comments = [
  {
    id: 1,
    user: {
      name: 'Karla Gutierrez',
      avatar: '/avatars/user1.jpg',
    },
    content: 'Suspendisse potenti. Sed in lacinia nunc. Proin gravida tellus lorem, sit amet tempus enim vehicula et.',
  },
  {
    id: 2,
    user: {
      name: 'Brayan Edgardo Lopez Manzanares',
      avatar: '/avatars/user2.jpg',
    },
    content: 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.',
  },
  {
    id: 3,
    user: {
      name: 'Karla Gutierrez',
      avatar: '/avatars/user3.jpg',
    },
    content: 'Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.',
  },
  {
    id: 4,
    user: {
      name: 'Karla Gutierrez',
      avatar: '/avatars/user4.jpg',
    },
    content: 'Nulla quis lorem ut libero malesuada feugiat. Nulla quis lorem ut libero malesuada feugiat.',
  },
];

function CommentsList() {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" gutterBottom>
        {t('comments.title')}
      </Typography>
      <Grid container spacing={2}>
        {comments.map((comment) => (
          <Grid item xs={12} sm={6} key={comment.id}>
            <CommentCard>
              <UserInfo>
                <Avatar
                  src={comment.user.avatar}
                  sx={{ width: 40, height: 40, mr: 1 }}
                />
                <Typography variant="subtitle2">{comment.user.name}</Typography>
              </UserInfo>
              <Typography variant="body2" color="text.secondary">
                {comment.content}
              </Typography>
            </CommentCard>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="outlined" color="primary">
          {t('comments.viewMore')}
        </Button>
      </Box>
    </Box>
  );
}

export default CommentsList; 