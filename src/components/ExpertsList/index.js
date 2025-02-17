import React from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, Grid } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const ExpertCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  position: 'relative',
}));

const ChatIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  width: '24px',
  height: '24px',
  background: theme.palette.background.paper,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: '16px',
    color: theme.palette.primary.main,
  },
}));

const experts = [
  {
    id: 1,
    name: 'Dr. Karla Gutierrez',
    specialty: 'gynecology',
    avatar: '/avatars/expert1.jpg',
  },
  {
    id: 2,
    name: 'Dr. Mario Gutierrez',
    specialty: 'dentistry',
    avatar: '/avatars/expert2.jpg',
  },
  {
    id: 3,
    name: 'Dr. Karla Gutierrez',
    specialty: 'gynecology',
    avatar: '/avatars/expert3.jpg',
  },
  {
    id: 4,
    name: 'Dr. Karla Gutierrez',
    specialty: 'gynecology',
    avatar: '/avatars/expert4.jpg',
  },
  {
    id: 5,
    name: 'Dr. Karla Gutierrez',
    specialty: 'gynecology',
    avatar: '/avatars/expert5.jpg',
  },
];

function ExpertsList() {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" gutterBottom>
        {t('experts.title')}
      </Typography>
      <Grid container spacing={2}>
        {experts.map((expert) => (
          <Grid item xs={12} sm={6} md={2.4} key={expert.id}>
            <ExpertCard>
              <ChatIcon>
                <ChatBubbleOutlineIcon />
              </ChatIcon>
              <Avatar
                src={expert.avatar}
                sx={{ width: 80, height: 80, mb: 1 }}
              />
              <Typography variant="subtitle1" gutterBottom>
                {expert.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(`experts.specialty.${expert.specialty}`)}
              </Typography>
            </ExpertCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ExpertsList; 