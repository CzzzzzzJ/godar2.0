import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

// Logo组件，显示在消息旁边
const Logo = styled('div')({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 500,
  color: '#4A6741',
  backgroundColor: '#EBF5EC',
  borderRadius: '4px',
  marginRight: '6px',
});

const ChatContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 64px)',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#FFFFFF',
  boxShadow: 'none',
  padding: 0,
  position: 'relative',
  overflow: 'hidden',
  margin: 0,
  borderRadius: 0,
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid #E5E5E5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#FFFFFF',
  height: '72px',
  zIndex: 10,
}));

const HeaderLeft = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const HeaderRight = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const AssistantInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const AssistantName = styled(Typography)({
  fontSize: '16px',
  fontWeight: 500,
  color: '#333333',
});

const AssistantStatus = styled(Typography)({
  fontSize: '14px',
  color: '#666666',
});

const ChatMessages = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(5),
  overflowY: 'auto',
  backgroundColor: '#F5F7F5',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#DADADA',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#BBBBBB',
  },
}));

const MessageGroup = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  flexDirection: isUser ? 'row-reverse' : 'row',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(3),
  gap: theme.spacing(1.5),
  width: '100%',
  position: 'relative',
}));

const MessageContentContainer = styled(Box)(({ theme, isUser }) => ({
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: isUser ? 'flex-end' : 'flex-start',
  maxWidth: '70%',
}));

const MessageContent = styled(Box)(({ theme, isUser }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: '12px',
  backgroundColor: isUser ? '#95C675' : '#FFFFFF',
  color: isUser ? '#FFFFFF' : '#333333',
  fontSize: '14px',
  lineHeight: '1.5',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  wordWrap: 'break-word',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  display: 'inline-block',
  minWidth: '40px',
  maxWidth: '100%',
  boxSizing: 'border-box',
  '& div': {
    marginBottom: '8px',
    '&:last-child': {
      marginBottom: 0,
    }
  }
}));

const MessageTime = styled(Typography)({
  fontSize: '12px',
  color: '#999999',
  marginTop: '4px',
  textAlign: 'center',
});

const AssistantMessageHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
});

const ChatInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid #E5E5E5',
  backgroundColor: '#FFFFFF',
  position: 'sticky',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.05)',
}));

const InputWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  backgroundColor: '#F5F7F5',
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  border: '1px solid #EEEEEE',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  fontSize: '14px',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
    '&::placeholder': {
      color: '#999999',
      opacity: 1,
    },
  },
}));

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#95C675',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#7DAC5C',
  },
  '&.Mui-disabled': {
    backgroundColor: '#E0E0E0',
    color: '#9E9E9E',
  },
  width: '36px',
  height: '36px',
}));

const mockMessages = [
  {
    id: 1,
    text: '您好！我是客服李美玲，很高兴为您服务。以下是一些常见问题的解答，供您参考：\n\n如何成为会员？\n会员有哪些权益？\n如何获取和使用token？\n\n请问您需要了解哪方面的信息呢？',
    isUser: false,
    time: '10:30',
  },
  {
    id: 2,
    text: '你好，我想了解下成为会员有哪些权益？',
    isUser: true,
    time: '10:31',
  },
  {
    id: 3,
    text: '我很乐意为您介绍会员权益。作为会员，您将每月自动获得 500 token 的奖励。这些 token 是您在平台上探索跨境信息的重要资源。充足的 token 不仅能让您获取更高质量的跨境资讯，还能帮助您更好地开启跨境之旅。',
    isUser: false,
    time: '10:32',
  },
  {
    id: 4,
    text: '那请问这些 token 具体可以用来做什么呢？',
    isUser: true,
    time: '10:33',
  },
];

// 增加专门用于短消息的固定宽度处理
const getMinWidth = (text) => {
  const len = text.length;
  if (len <= 2) return '54px'; // 非常短的消息
  if (len <= 5) return '70px'; // 短消息
  return 'auto'; // 正常消息
};

// 渲染短消息组件
const renderMessageContent = (text, isUser) => {
  // 处理换行
  const lines = text.split('\n');
  
  // 判断是否是短消息（整体长度）
  const isShortMessage = text.length <= 5 && lines.length === 1;
  
  // 应用不同的样式
  const style = isShortMessage ? { 
    minWidth: getMinWidth(text),
    textAlign: 'center',
    padding: '8px 16px',
    height: lines.length === 1 && text.length <= 2 ? '36px' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } : {};
  
  if (isShortMessage) {
    return (
      <MessageContent isUser={isUser} style={style}>
        {text}
      </MessageContent>
    );
  }
  
  return (
    <MessageContent isUser={isUser}>
      {lines.map((line, i) => (
        <div key={i}>{line || ' '}</div>
      ))}
    </MessageContent>
  );
};

// 修改消息测试数据，添加短消息测试
const shortMessageTest = {
  id: 5, 
  text: '好的',
  isUser: true,
  time: '20:10'
};

// 添加一个底部间距组件
const MessageListBottomSpacer = styled(Box)(({ theme }) => ({
  height: '20px', // 底部留白
  width: '100%',
}));

function Chat() {
  const { assistantId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [assistant, setAssistant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 这里可以根据assistantId加载特定助手的信息
    // 暂时使用模拟数据
    setAssistant({
      id: assistantId,
      name: 'Co-X 001',
      title: '客服专员',
      status: '在线',
      avatar: '/avatars/assistant.jpg',
      logo: 'Gö'
    });

    // 这里可以加载与该助手的历史消息
    // 添加短消息测试样例
    const testMessages = [
      ...mockMessages,
      {
        id: 5,
        text: '好的',
        isUser: true,
        time: '20:10'
      },
      {
        id: 6,
        text: '你好',
        isUser: true,
        time: '20:11'
      }
    ];
    
    setMessages(testMessages);
  }, [assistantId]);

  // 自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        isUser: true,
        time: new Date().toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit'
        })
      };

      setMessages([...messages, newMessage]);
      setMessage('');
      setIsLoading(true);

      // 滚动到底部
      setTimeout(scrollToBottom, 100);

      // 模拟AI回复
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: '感谢您的问题。Token可以用于查询高级跨境信息、获取定制化的跨境商业报告、使用AI助手进行深度咨询等。您还可以使用token兑换专家一对一咨询服务，获取更专业的解答。',
          isUser: false,
          time: new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit'
          })
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
        
        // 确保AI回复后也滚动到底部
        setTimeout(scrollToBottom, 100);
      }, 1500);

      // 这里可以添加发送消息到服务器的逻辑
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!assistant) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: 'calc(100vh - 64px)',
        backgroundColor: '#F5F7F5'
      }}>
        <Typography>加载中...</Typography>
      </Box>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <HeaderLeft>
          <Avatar
            src={assistant.avatar}
            alt={assistant.name}
            sx={{ width: 40, height: 40 }}
          />
          <AssistantInfo>
            <AssistantName>{assistant.name}</AssistantName>
            <AssistantStatus>{assistant.title} | {assistant.status}</AssistantStatus>
          </AssistantInfo>
        </HeaderLeft>
        <HeaderRight>
          <IconButton size="small">
            <EmailOutlinedIcon />
          </IconButton>
          <IconButton size="small">
            <LocalPhoneOutlinedIcon />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </HeaderRight>
      </ChatHeader>

      <ChatMessages>
        {messages.map((msg) => (
          <MessageGroup key={msg.id} isUser={msg.isUser}>
            {!msg.isUser && (
              <Avatar
                src={assistant.avatar}
                alt={assistant.name}
                sx={{ width: 36, height: 36, flexShrink: 0 }}
              />
            )}
            <MessageContentContainer isUser={msg.isUser}>
              {!msg.isUser && (
                <AssistantMessageHeader>
                  <Logo>{assistant.logo}</Logo>
                  <Typography variant="caption" color="textSecondary">
                    {assistant.title}
                  </Typography>
                </AssistantMessageHeader>
              )}
              {renderMessageContent(msg.text, msg.isUser)}
              <MessageTime>{msg.time}</MessageTime>
            </MessageContentContainer>
            {msg.isUser && (
              <Avatar
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: '#95C675',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 500,
                  flexShrink: 0
                }}
              >
                张志
              </Avatar>
            )}
          </MessageGroup>
        ))}
        {isLoading && (
          <MessageGroup isUser={false}>
            <Avatar
              src={assistant.avatar}
              alt={assistant.name}
              sx={{ width: 36, height: 36, flexShrink: 0 }}
            />
            <MessageContentContainer isUser={false}>
              <AssistantMessageHeader>
                <Logo>{assistant.logo}</Logo>
                <Typography variant="caption" color="textSecondary">
                  {assistant.title}
                </Typography>
              </AssistantMessageHeader>
              <MessageContent isUser={false} sx={{ padding: '12px 16px' }}>
                <Typography sx={{ fontSize: '14px' }}>
                  正在输入...
                </Typography>
              </MessageContent>
            </MessageContentContainer>
          </MessageGroup>
        )}
        <MessageListBottomSpacer />
        <div ref={messagesEndRef} />
      </ChatMessages>

      <ChatInput>
        <InputWrapper elevation={0}>
          <IconButton size="small" sx={{ color: '#999999' }}>
            <InsertEmoticonIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: '#999999' }}>
            <ImageIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: '#999999' }}>
            <AttachFileIcon fontSize="small" />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: '24px' }} />
          <StyledInputBase
            placeholder="请输入消息..."
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
          />
          <SendButton
            size="small"
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
          >
            <SendIcon fontSize="small" />
          </SendButton>
        </InputWrapper>
      </ChatInput>
    </ChatContainer>
  );
}

export default Chat; 