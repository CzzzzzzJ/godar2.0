import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Chip,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import ChatIcon from '@mui/icons-material/Chat';
import PublicIcon from '@mui/icons-material/Public';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  backgroundColor: '#F5F7F5',
  minHeight: 'calc(100vh - 64px)',
}));

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
  padding: theme.spacing(0, 2),
}));

const FormSection = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: '#FFFFFF',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  border: '1px solid #E5E5E5',
  marginBottom: theme.spacing(2),
}));

const InfoSection = styled(Box)(({ theme }) => ({
  width: '300px',
  backgroundColor: '#FFFFFF',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  border: '1px solid #E5E5E5',
  height: 'fit-content',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 500,
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.primary.main,
}));

const FormGroup = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const FormLabel = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#333333',
  marginBottom: theme.spacing(0.5),
  fontWeight: 500,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#FFFFFF',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '& fieldset': {
      borderColor: '#E5E5E5',
    },
    '& input': {
      padding: '10px 14px',
    },
  },
}));

const LocationGroup = styled(Grid)(({ theme }) => ({
  gap: theme.spacing(2),
}));

const SocialGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const SocialIcon = styled(Box)(({ theme }) => ({
  width: '24px',
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.primary.main,
  opacity: 0.8,
}));

const InfoText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#666666',
  marginBottom: theme.spacing(2),
  lineHeight: 1.6,
}));

const WarningText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: '#ff4d4f',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: '#fff1f0',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid #ffccc7',
}));

const InfoList = styled('ul')(({ theme }) => ({
  padding: 0,
  margin: 0,
  listStyle: 'none',
  '& li': {
    fontSize: '14px',
    color: '#666666',
    marginBottom: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'flex-start',
    '&:before': {
      content: '"•"',
      color: theme.palette.primary.main,
      marginRight: theme.spacing(1),
      fontSize: '16px',
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: '1px dashed #E5E5E5',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: '#FAFAFA',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: '#F5F7F5',
  },
}));

const UploadIcon = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  margin: '0 auto',
  marginBottom: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: '50%',
  border: '1px dashed #E5E5E5',
  '& svg': {
    fontSize: '20px',
    color: theme.palette.primary.main,
  },
}));

const TagGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
}));

const Tag = styled(Box)(({ theme, selected }) => ({
  padding: '4px 12px',
  borderRadius: '14px',
  border: '1px solid #E5E5E5',
  backgroundColor: selected ? theme.palette.primary.main : '#FFFFFF',
  color: selected ? '#FFFFFF' : '#666666',
  cursor: 'pointer',
  fontSize: '13px',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    color: selected ? '#FFFFFF' : theme.palette.primary.main,
  },
}));

const RadioGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

const RadioOption = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
}));

const RadioButton = styled('input')(({ theme }) => ({
  margin: theme.spacing(0.5, 0, 0, 0),
}));

const TextArea = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
  },
  marginTop: theme.spacing(2),
}));

function ExpertAdd() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    phoneCode: '',
    verifyCode: '',
    country: '',
    province: '',
    city: '',
    linkedin: '',
    twitter: '',
    wechat: '',
    weibo: '',
    address: '',
    password: '',
    workExperience: '',
    selectedTags: [],
    workYears: '',
    companyType: 'noCompany',
    certificateType: 'noCertificate',
    companyDescription: '',
    certificateDescription: '',
  });

  const [certificates, setCertificates] = useState([]);

  const expertiseTags = [
    '跨境电商', '外贸', '物流', '供应链', '市场营销',
    '品牌策划', '法律', '财税', '战略咨询'
  ];

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = () => {
    console.log('提交的表单数据:', formData);
  };

  const handleGetCode = () => {
    console.log('获取验证码');
  };

  const handleTagClick = (tag) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setCertificates(prev => [...prev, ...files]);
  };

  const handleRadioChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <FormContainer>
          <Box sx={{ flex: 1 }}>
            <FormSection>
              <SectionTitle>基本信息</SectionTitle>
              
              <FormGroup>
                <FormLabel>姓名</FormLabel>
                <StyledTextField
                  fullWidth
                  placeholder="请输入真实姓名"
                  value={formData.name}
                  onChange={handleChange('name')}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>职位</FormLabel>
                <StyledTextField
                  fullWidth
                  placeholder="请输入公开职位"
                  value={formData.title}
                  onChange={handleChange('title')}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>电子邮箱</FormLabel>
                <StyledTextField
                  fullWidth
                  placeholder="请输入常用邮箱"
                  value={formData.email}
                  onChange={handleChange('email')}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>联系电话</FormLabel>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <StyledTextField
                      fullWidth
                      placeholder="+86"
                      value={formData.phoneCode}
                      onChange={handleChange('phoneCode')}
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <StyledTextField
                      fullWidth
                      placeholder="请输入手机号码"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleGetCode}
                      sx={{ 
                        height: '40px',
                        fontSize: '14px'
                      }}
                    >
                      获取验证码
                    </Button>
                  </Grid>
                </Grid>
              </FormGroup>

              <FormGroup>
                <FormLabel>所在地区</FormLabel>
                <LocationGroup container>
                  <Grid item xs={4}>
                    <StyledTextField
                      fullWidth
                      placeholder="国家/地区"
                      value={formData.country}
                      onChange={handleChange('country')}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <StyledTextField
                      fullWidth
                      placeholder="省/州"
                      value={formData.province}
                      onChange={handleChange('province')}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <StyledTextField
                      fullWidth
                      placeholder="城市"
                      value={formData.city}
                      onChange={handleChange('city')}
                    />
                  </Grid>
                </LocationGroup>
              </FormGroup>

              <FormGroup>
                <FormLabel>详细地址</FormLabel>
                <StyledTextField
                  fullWidth
                  placeholder="请输入详细地址"
                  value={formData.address}
                  onChange={handleChange('address')}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>其他公开方式（选填）</FormLabel>
                <SocialGroup>
                  <SocialIcon>
                    <LinkedInIcon />
                  </SocialIcon>
                  <StyledTextField
                    fullWidth
                    placeholder="LinkedIn"
                    value={formData.linkedin}
                    onChange={handleChange('linkedin')}
                  />
                </SocialGroup>
                <SocialGroup>
                  <SocialIcon>
                    <TwitterIcon />
                  </SocialIcon>
                  <StyledTextField
                    fullWidth
                    placeholder="Twitter"
                    value={formData.twitter}
                    onChange={handleChange('twitter')}
                  />
                </SocialGroup>
                <SocialGroup>
                  <SocialIcon>
                    <ChatIcon />
                  </SocialIcon>
                  <StyledTextField
                    fullWidth
                    placeholder="微信公众号"
                    value={formData.wechat}
                    onChange={handleChange('wechat')}
                  />
                </SocialGroup>
                <SocialGroup>
                  <SocialIcon>
                    <PublicIcon />
                  </SocialIcon>
                  <StyledTextField
                    fullWidth
                    placeholder="微博"
                    value={formData.weibo}
                    onChange={handleChange('weibo')}
                  />
                </SocialGroup>
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>专业资质</SectionTitle>
              
              <FormGroup>
                <FormLabel>工作经验</FormLabel>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <StyledTextField
                      fullWidth
                      placeholder="0"
                      value={formData.workYears}
                      onChange={handleChange('workYears')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" sx={{ color: '#666666' }}>
                            年工作经验
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </FormGroup>

              <FormGroup>
                <FormLabel>专业领域（可多选）</FormLabel>
                <TagGroup>
                  {expertiseTags.map((tag) => (
                    <Tag
                      key={tag}
                      selected={formData.selectedTags.includes(tag)}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                </TagGroup>
              </FormGroup>

              <FormGroup>
                <FormLabel>所属企业</FormLabel>
                <RadioGroup>
                  <RadioOption>
                    <RadioButton
                      type="radio"
                      name="companyType"
                      value="noCompany"
                      checked={formData.companyType === 'noCompany'}
                      onChange={handleRadioChange('companyType')}
                    />
                    <Typography>无从业企业</Typography>
                  </RadioOption>
                  <RadioOption>
                    <RadioButton
                      type="radio"
                      name="companyType"
                      value="hasCompany"
                      checked={formData.companyType === 'hasCompany'}
                      onChange={handleRadioChange('companyType')}
                    />
                    <Typography>有从业企业</Typography>
                  </RadioOption>
                </RadioGroup>
                {formData.companyType === 'noCompany' && (
                  <Box sx={{ pl: 3, mt: 2 }}>
                    <TextArea
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="请说明目前无从业企业的原因"
                      value={formData.companyDescription}
                      onChange={handleChange('companyDescription')}
                    />
                  </Box>
                )}
                {formData.companyType === 'hasCompany' && (
                  <Box sx={{ pl: 3, mt: 2 }}>
                    <UploadBox>
                      <UploadIcon>
                        <CloudUploadIcon />
                      </UploadIcon>
                      <Typography variant="body1" color="textSecondary" gutterBottom>
                        上传在职证明（含企业公章）
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        支持 PDF、JPG、PNG 格式，单个文件不超过10MB
                      </Typography>
                    </UploadBox>
                  </Box>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel>资质证书</FormLabel>
                <RadioGroup>
                  <RadioOption>
                    <RadioButton
                      type="radio"
                      name="certificateType"
                      value="noCertificate"
                      checked={formData.certificateType === 'noCertificate'}
                      onChange={handleRadioChange('certificateType')}
                    />
                    <Typography>无资质证书</Typography>
                  </RadioOption>
                  <RadioOption>
                    <RadioButton
                      type="radio"
                      name="certificateType"
                      value="hasCertificate"
                      checked={formData.certificateType === 'hasCertificate'}
                      onChange={handleRadioChange('certificateType')}
                    />
                    <Typography>有资质证书</Typography>
                  </RadioOption>
                </RadioGroup>
                {formData.certificateType === 'noCertificate' && (
                  <Box sx={{ pl: 3, mt: 2 }}>
                    <TextArea
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="请说明目前无资质证书的原因"
                      value={formData.certificateDescription}
                      onChange={handleChange('certificateDescription')}
                    />
                  </Box>
                )}
                {formData.certificateType === 'hasCertificate' && (
                  <Box sx={{ pl: 3, mt: 2 }}>
                    <UploadBox>
                      <UploadIcon>
                        <CloudUploadIcon />
                      </UploadIcon>
                      <Typography variant="body1" color="textSecondary" gutterBottom>
                        点击或拖拽上传资质证书
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        支持 PDF、JPG、PNG 格式，单个文件不超过10MB
                      </Typography>
                    </UploadBox>
                  </Box>
                )}
              </FormGroup>
            </FormSection>
          </Box>

          <InfoSection>
            <SectionTitle>申请说明</SectionTitle>
            <InfoText>感谢您选择成为平台的跨境专家！</InfoText>
            <InfoText>我们提供 AI 配套解决方案，帮助您：</InfoText>
            <InfoList>
              <li>拓展业务客户</li>
              <li>维护客户关系</li>
              <li>提升工作效率</li>
            </InfoList>
            <InfoText>审核周期：1-5个工作日</InfoText>
            <WarningText>请正确填写信息，如有法律问题，我们将保留法律追究权。</WarningText>
            <InfoText>信息安全承诺：</InfoText>
            <InfoList>
              <li>严格保密您提供的所有资料</li>
              <li>遵循单独授权的原则</li>
              <li>如何妥善使用您的专业AI助理</li>
              <li>确保您的知识产权不受侵害</li>
            </InfoList>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{ 
                mt: 2,
                height: '44px',
                fontSize: '15px',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                },
              }}
            >
              提交申请
            </Button>
          </InfoSection>
        </FormContainer>
      </Container>
    </PageContainer>
  );
}

export default ExpertAdd; 