import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddExpertButton from "../../components/AddExpertButton";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { getFetcher } from "../../utils/request/fetcher";

const PageContainer = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 64px)",
  backgroundColor: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
}));

const TopSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(2),
  borderBottom: "1px solid #E5E5E5",
}));

const SearchField = styled(TextField)(({ theme }) => ({
  flex: 1,
  "& .MuiOutlinedInput-root": {
    height: "40px",
    backgroundColor: "#F5F7F5",
    borderRadius: theme.shape.borderRadius,
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const MessageList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
}));

const MessageItem = styled(Box)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  cursor: "pointer",
  backgroundColor: selected ? "#EBF5EC" : "transparent",
  borderBottom: "1px solid #F0F0F0",
  "&:hover": {
    backgroundColor: selected ? "#EBF5EC" : "#F5F7F5",
  },
}));

const MessageContent = styled(Box)({
  flex: 1,
  minWidth: 0,
});

const MessageHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "4px",
});

const UserName = styled(Typography)({
  fontSize: "14px",
  fontWeight: 500,
  color: "#333333",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const UserTitle = styled(Typography)({
  fontSize: "12px",
  color: "#666666",
  marginLeft: "8px",
  fontWeight: "normal",
});

const MessageTime = styled(Typography)({
  fontSize: "12px",
  color: "#999999",
});

const MessageText = styled(Typography)({
  fontSize: "14px",
  color: "#666666",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

// 模拟消息数据
const mockMessages = [
  {
    id: 1,
    avatar: "/avatars/expert1.jpg",
    name: "王秋菊",
    title: "外贸顾问",
    message: "您好，关于您咨询的跨境物流问题，我建议...",
    time: "14:40",
  },
  {
    id: 2,
    avatar: "/avatars/expert2.jpg",
    name: "李明远",
    title: "新加坡跨境电商顾问",
    message: "好的，我已经收到了您的资料，让我们一起探讨...",
    time: "11:20",
  },
  {
    id: 3,
    avatar: "/avatars/expert3.jpg",
    name: "张英远",
    title: "欧洲法律顾问",
    message: "关于这个问题，我建议您可以...",
    time: "15:45",
  },
  {
    id: 4,
    avatar: "/avatars/expert4.jpg",
    name: "陈美玲",
    title: "外贸顾问",
    message: "您好，我们可以继续探讨这个话题...",
    time: "1月15日",
  },
];

function Messages() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { data } = useSWR(`/Conversation/2`, getFetcher);

  const handleAddExpert = () => {
    navigate("/expert-add");
  };

  const handleMessageClick = (assistantId, conversationId) => {
    setSelectedMessage(conversationId);
    // 导航到聊天页面，使用消息ID作为助手ID
    navigate(`/chat/${assistantId}?conversationId=${conversationId}`);
  };

  return (
    <PageContainer>
      <TopSection>
        <SearchField
          placeholder="搜索消息记录"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#999999" }} />
              </InputAdornment>
            ),
          }}
        />
        <AddExpertButton />
      </TopSection>

      <MessageList>
        {data?.map((message) => (
          <MessageItem
            key={message.id}
            selected={selectedMessage === message.id}
            onClick={() =>
              handleMessageClick(message.AssistantId, message.ConversationId)
            }
          >
            <Avatar src={message.avatar} alt={message.name} />
            <MessageContent>
              <MessageHeader>
                <UserName>
                  {message.name}
                  <UserTitle>{message.title}</UserTitle>
                </UserName>
                <MessageTime>{message.CreatedAt}</MessageTime>
              </MessageHeader>
              <MessageText>{message.Title}</MessageText>
            </MessageContent>
          </MessageItem>
        ))}
      </MessageList>
    </PageContainer>
  );
}

export default Messages;
