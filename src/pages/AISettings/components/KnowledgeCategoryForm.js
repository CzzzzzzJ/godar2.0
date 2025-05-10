import { Box, Container, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#F5F7F5",
  },
}));

const KnowledgeCategoryForm = () => {
  return (
    <div>
      <StyledTextField
        fullWidth
        multiline
        placeholder="请输入分类名称"
        variant="outlined"
        label="分类名称"
        required
      />
      <StyledTextField
        fullWidth
        multiline
        rows={4}
        placeholder="请输入分类描述"
        variant="outlined"
        label="分类描述"
        required
      />
    </div>
  );
};

export default KnowledgeCategoryForm;
