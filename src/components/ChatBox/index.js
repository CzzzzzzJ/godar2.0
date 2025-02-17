import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

const ChatContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
  maxWidth: '600px',
  minHeight: '200px',
  maxHeight: '400px',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.paper,
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.light,
    borderRadius: '3px',
  },
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(2),
  width: '100%',
  opacity: 0,
  animation: 'fadeIn 0.3s ease-in-out forwards',
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const Message = styled(Typography)(({ theme, isUser }) => ({
  maxWidth: '85%',
  padding: theme.spacing(1.5, 2),
  borderRadius: isUser 
    ? `${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0 ${theme.shape.borderRadius * 2}px`
    : `${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0`,
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[50],
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontSize: '0.95rem',
  lineHeight: 1.6,
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    [isUser ? 'right' : 'left']: -8,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: isUser ? '0 0 8px 8px' : '0 8px 8px 0',
    borderColor: 'transparent',
    borderBottomColor: isUser ? theme.palette.primary.main : theme.palette.grey[50],
  },
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  gap: '8px',
  width: '100%',
});

const RetryMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      opacity: 0.6,
    },
    '50%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0.6,
    },
  },
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

  // 如果没有消息且不在加载状态，则不显示聊天框
  if (messages.length === 0 && !loading) {
    return null;
  }

  return (
    <Fade in={messages.length > 0 || loading} timeout={300}>
      <ChatContainer>
        {messages.map((message, index) => (
          <MessageBubble 
            key={index} 
            isUser={message.isUser}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
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
    </Fade>
  );
}

export default ChatBox; 