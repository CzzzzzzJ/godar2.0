import { CloudUpload } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React from "react";

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#F5F7F5",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  width: 550,
  marginBottom: 24,
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const KnowledgeDocumentForm = () => {
  const [file, setFile] = React.useState("");

  const handleUpload = (event) => {
    const { files } = event.target;
    const file = files[0];
    console.log(file);

    setFile(file);
  };

  console.log("render", file);

  return (
    <div>
      <StyledSelect label="分类" placeholder="请选择分类">
        <MenuItem value={10}>分类1</MenuItem>
        <MenuItem value={20}>分类2</MenuItem>
        <MenuItem value={30}>分类3</MenuItem>
      </StyledSelect>
      <StyledTextField
        fullWidth
        multiline
        placeholder="请输入文档名称"
        variant="outlined"
        label="文档名称"
        required
      />
      <StyledTextField
        fullWidth
        multiline
        rows={4}
        placeholder="请输入文档描述"
        variant="outlined"
        label="文档描述"
        required
      />
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput type="file" onChange={handleUpload} />
      </Button>
      <div>{file?.name}</div>
    </div>
  );
};

export default KnowledgeDocumentForm;
