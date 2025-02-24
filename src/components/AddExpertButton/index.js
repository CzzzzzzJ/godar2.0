import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StyledButton = styled(Button)(({ theme }) => ({
  height: '40px',
  padding: '0 16px',
  backgroundColor: '#FFFFFF',
  border: '1px dashed #CCCCCC',
  color: '#666666',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#F5F7F5',
    border: '1px dashed #999999',
  },
  '&.MuiButton-root': {
    textTransform: 'none',
    minWidth: 'auto',
  },
}));

function AddExpertButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Navigating to expert-add page');
    navigate('/expert-add');
  };

  return (
    <StyledButton 
      onClick={handleClick}
      variant="outlined"
      disableElevation
    >
      + 添加咨询专家
    </StyledButton>
  );
}

export default AddExpertButton; 