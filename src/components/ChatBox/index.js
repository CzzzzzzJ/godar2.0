import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import ReactMarkdown from 'react-markdown';

const ChatContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
  maxWidth: '800px',
  minHeight: '200px',
  maxHeight: '600px',
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

const QuestionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  width: '100%',
}));

const MessageBubble = styled(Box)(({ theme, isUser, isFirstMessage }) => ({
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
  display: isFirstMessage ? 'none' : 'flex',
}));

const Message = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '100%',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[50],
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontSize: '0.95rem',
  lineHeight: 1.6,
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  width: '100%',
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    margin: '16px 0 8px 0',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  '& p': {
    margin: '8px 0',
  },
  '& ul, & ol': {
    marginLeft: theme.spacing(2),
  },
  '& code': {
    backgroundColor: theme.palette.grey[100],
    padding: '2px 4px',
    borderRadius: 4,
    fontSize: '0.9em',
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    margin: '16px 0',
    padding: '4px 16px',
    color: theme.palette.text.secondary,
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

const ThinkingStep = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  animation: 'fadeIn 0.3s ease-in-out',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    animation: 'shine 1.5s infinite',
  },
  '@keyframes shine': {
    '0%': {
      transform: 'translateX(-100%)',
    },
    '100%': {
      transform: 'translateX(100%)',
    },
  },
  '& .MuiTypography-root': {
    color: 'inherit',
    fontSize: '1rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '100%',
  },
  '& .thinking-dots': {
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: 'auto',
    '&::after': {
      content: '"..."',
      animation: 'thinking 1.4s infinite',
      width: '1.5em',
      textAlign: 'left',
    },
  },
  '@keyframes thinking': {
    '0%, 20%': {
      content: '"."',
    },
    '40%': {
      content: '".."',
    },
    '60%, 100%': {
      content: '"..."',
    },
  },
}));

function ChatBox({ messages, loading, retrying, thinkingStep }) {
  const renderMessageContent = (content, isUser) => {
    if (typeof content !== 'string') {
      return JSON.stringify(content);
    }

    if (!isUser && (content.includes('#') || content.includes('```') || content.includes('*'))) {
      return <ReactMarkdown>{content}</ReactMarkdown>;
    }

    return content;
  };

  if (messages.length === 0 && !loading) {
    return null;
  }

  const title = messages.find(m => m.isUser)?.content || '';

  return (
    <Fade in={messages.length > 0 || loading} timeout={300}>
      <ChatContainer>
        {title && <QuestionTitle variant="h6">{title}</QuestionTitle>}
        {messages.map((message, index) => (
          <MessageBubble 
            key={index} 
            isUser={message.isUser}
            isFirstMessage={index === 0 && message.isUser}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Message isUser={message.isUser}>
              {renderMessageContent(message.content, message.isUser)}
            </Message>
          </MessageBubble>
        ))}
        {loading && (
          <>
            {thinkingStep && (
              <ThinkingStep>
                <Typography>
                  {thinkingStep}
                  <span className="thinking-dots" />
                </Typography>
              </ThinkingStep>
            )}
            <LoadingContainer>
              <CircularProgress size={24} color="primary" />
              {retrying && (
                <RetryMessage>
                  <ReplayIcon fontSize="small" />
                  正在重试连接...
                </RetryMessage>
              )}
            </LoadingContainer>
          </>
        )}
      </ChatContainer>
    </Fade>
  );
}

export default ChatBox; 