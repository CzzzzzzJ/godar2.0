import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderTop: '1px solid #E5E5E5',
  width: '100%',
}));

const FooterContent = styled(Box)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
  padding: theme.spacing(6, 3, 3),
}));

const Logo = styled('img')({
  height: '28px',
  marginBottom: '16px',
});

const Description = styled(Typography)({
  fontSize: '14px',
  color: '#666666',
  lineHeight: 1.6,
  marginBottom: '24px',
  maxWidth: '360px',
});

const FooterSection = styled(Box)({
  marginBottom: '24px',
});

const SectionTitle = styled(Typography)({
  fontSize: '16px',
  fontWeight: 500,
  color: '#333333',
  marginBottom: '16px',
});

const LinkList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

const LinkItem = styled('li')({
  marginBottom: '12px',
  '& a': {
    color: '#666666',
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#4B6455',
    },
  },
});

const Copyright = styled(Typography)({
  fontSize: '14px',
  color: '#999999',
  textAlign: 'center',
  borderTop: '1px solid #E5E5E5',
  paddingTop: '24px',
  marginTop: '24px',
});

const footerLinks = {
  about: [
    { title: '公司介绍', link: '/about' },
    { title: '团队优势', link: '/team' },
    { title: '发展历程', link: '/history' },
  ],
  products: [
    { title: 'AI 数字助理', link: '/ai-assistant' },
    { title: '知识库管理', link: '/knowledge-base' },
    { title: '客户关系维护', link: '/crm' },
  ],
  contact: [
    { title: '商务合作', link: '/cooperation' },
    { title: '加入我们', link: '/join-us' },
    { title: '技术支持', link: '/support' },
  ],
};

function Footer() {
  return (
    <FooterWrapper>
      <FooterContent>
        <Grid container spacing={4}>
          {/* Logo和描述 */}
          <Grid item xs={12} md={4}>
            <FooterSection>
              <Logo src="/logo.jpg" alt="Godar" />
              <Description>
                为跨境专家提供专业的 AI 数字解决方案，助力业务发展
              </Description>
            </FooterSection>
          </Grid>

          {/* 关于我们 */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterSection>
              <SectionTitle>关于我们</SectionTitle>
              <LinkList>
                {footerLinks.about.map((item) => (
                  <LinkItem key={item.title}>
                    <a href={item.link}>{item.title}</a>
                  </LinkItem>
                ))}
              </LinkList>
            </FooterSection>
          </Grid>

          {/* 产品服务 */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <SectionTitle>产品服务</SectionTitle>
              <LinkList>
                {footerLinks.products.map((item) => (
                  <LinkItem key={item.title}>
                    <a href={item.link}>{item.title}</a>
                  </LinkItem>
                ))}
              </LinkList>
            </FooterSection>
          </Grid>

          {/* 联系我们 */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <SectionTitle>联系我们</SectionTitle>
              <LinkList>
                {footerLinks.contact.map((item) => (
                  <LinkItem key={item.title}>
                    <a href={item.link}>{item.title}</a>
                  </LinkItem>
                ))}
              </LinkList>
            </FooterSection>
          </Grid>
        </Grid>

        {/* 版权信息 */}
        <Copyright>
          © 2025 All Rights Reserved
        </Copyright>
      </FooterContent>
    </FooterWrapper>
  );
}

export default Footer; 