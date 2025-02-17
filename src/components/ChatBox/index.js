import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, CircularProgress } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

const ChatContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
  maxWidth: '600px',
  minHeight: '200px',
  maxHeight: '400px',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1),
}));

const Message = styled(Typography)(({ theme, isUser }) => ({
  maxWidth: '80%',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.secondary.main,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  gap: '8px',
});

const RetryMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

function ChatBox({ messages, loading, retrying }) {
  const renderMessageContent = (content) => {
    if (typeof content === 'string') {
      return content;
    }
    if (content && typeof content === 'object') {
      return JSON.stringify(content);
    }
    return '消息格式错误';
  };

  return (
    <ChatContainer>
      {messages.map((message, index) => (
        <MessageBubble key={index} isUser={message.isUser}>
          <Message isUser={message.isUser} variant="body2">
            {renderMessageContent(message.content)}
          </Message>
        </MessageBubble>
      ))}
      {(loading || retrying) && (
        <LoadingContainer>
          <CircularProgress size={24} color="primary" />
          {retrying && (
            <RetryMessage>
              <ReplayIcon fontSize="small" />
              正在重试连接...
            </RetryMessage>
          )}
        </LoadingContainer>
      )}
    </ChatContainer>
  );
}

export default ChatBox; 