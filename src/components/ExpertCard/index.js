import React from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  height: "280px",
  backgroundColor: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
  border: "1px solid #E5E5E5",
  "&:hover": {
    boxShadow: "0 0 0 2px #4B6455",
    borderColor: "transparent",
  },
  position: "relative",
  padding: theme.spacing(2, 2, 3, 2),
  display: "flex",
  flexDirection: "column",
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  border: "2px solid #F5F5F5",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

const StatsChip = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  padding: "4px 8px",
  borderRadius: "16px",
  backgroundColor: "#F5F5F5",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  zIndex: 1,
  "& .MuiTypography-root": {
    fontSize: "12px",
    color: "#666666",
    whiteSpace: "nowrap",
  },
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  height: "36px",
  fontSize: "14px",
  padding: "0 16px",
  borderRadius: "4px",
  fontWeight: "normal",
  whiteSpace: "nowrap",
  minWidth: "80px",
  ...(variant === "contained" && {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(variant === "outlined" && {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "rgba(75, 100, 85, 0.04)",
    },
  }),
}));

const InfoText = styled(Typography)({
  fontSize: "12px",
  color: "#666666",
  display: "inline-block",
  "&:after": {
    content: '"·"',
    margin: "0 4px",
  },
  "&:last-child:after": {
    display: "none",
  },
});

function ExpertCard({ expert }) {
  const {
    avatar,
    Name,
    title,
    location,
    specialty,
    responseRate,
    todayResponses,
    experience,
  } = expert;

  return (
    <StyledCard>
      <Box
        sx={{
          textAlign: "center",
          mb: 2,
          flex: "0 0 auto",
          position: "relative",
          pt: 3, // 为统计信息留出空间
        }}
      >
        <AvatarWrapper>
          <StyledAvatar src={avatar} alt={Name} />
        </AvatarWrapper>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#333333",
            mb: 0.5,
            mt: 1,
          }}
        >
          {Name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            color: "#666666",
            mb: 1,
            height: "40px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "20px",
          }}
        >
          {title}
        </Typography>
      </Box>

      <StatsChip>
        <Typography component="span">今日回复: {todayResponses}</Typography>
        <Typography component="span">好评率: {responseRate}%</Typography>
      </StatsChip>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          mb: "auto",
          gap: "4px",
          minHeight: "24px",
        }}
      >
        <InfoText>{location}</InfoText>
        <InfoText>{specialty}</InfoText>
        <InfoText>{experience}</InfoText>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          mt: "auto",
          "& .MuiButton-root": {
            flex: 1,
          },
        }}
      >
        <ActionButton variant="contained">在线聊天</ActionButton>
        <ActionButton variant="outlined">预约咨询</ActionButton>
      </Box>
    </StyledCard>
  );
}

export default ExpertCard;
