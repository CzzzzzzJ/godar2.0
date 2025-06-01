import { CloudUpload } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React from "react";
import { post, put } from "../../../utils/request";
import {
  GODAR_REQUEST_BASE_URL,
  GODAR_REQUEST_FILE_URL,
  GODAR_REQUEST_URL,
} from "../../../config";
import localStorage from "../../../utils/storage";

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

const KnowledgeDocumentForm = ({
  data,
  toggleModal,
  onRefresh,
  categoryId,
}) => {
  const [file, setFile] = React.useState("");
  const isEditMode = Object.keys(data).length > 0;
  // 弹窗状态
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = React.useState({
    Title: "",
    Content: "",
    CategoryId: categoryId,
    FileType: "word",
    FilePath: "https://pub-7ad5ec7951fa4cd28e1c0a7f83def6ac.r2.dev/Test.docx",
  });

  const handleChange = (filed) => (evt) => {
    setFormData((prev) => ({ ...prev, [filed]: evt.target.value }));
  };

  console.log("render", formData);

  const handleSubmit = () => {
    console.log(formData);
    //
    if (!formData.Title || !formData.Content) {
      setSnackbar({
        open: true,
        message: "请完善表单信息",
        severity: "warning",
      });
      return;
    }

    const handler = isEditMode ? put : post;
    handler({
      url: "/Knowledge/documents",
      data: formData,
    }).then(() => {
      toggleModal();
      onRefresh();
    });
  };

  React.useEffect(() => {
    if (isEditMode) {
      setFormData({
        CategoryName: data.CategoryName,
        Description: data.Description,
        AssistantId: data.AssistantId,
      });
    }
  }, []);

  const handleUpload = (event) => {
    const userToken = localStorage.get("userToken");
    const { files } = event.target;
    const file = files[0];
    console.log(file);

    setFile(file);

    const formData = new FormData();
    formData.append("file", file);

    fetch(GODAR_REQUEST_FILE_URL + "/upload", {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${userToken}` },
    });
  };

  console.log("render", file);

  return (
    <div>
      {/* <StyledSelect label="分类" placeholder="请选择分类">
        <MenuItem value={10}>分类1</MenuItem>
        <MenuItem value={20}>分类2</MenuItem>
        <MenuItem value={30}>分类3</MenuItem>
      </StyledSelect> */}
      <StyledTextField
        fullWidth
        multiline
        placeholder="请输入文档名称"
        variant="outlined"
        label="文档名称"
        required
        onChange={handleChange("Title")}
      />
      <StyledTextField
        fullWidth
        multiline
        rows={4}
        placeholder="请输入文档描述"
        variant="outlined"
        label="文档描述"
        required
        onChange={handleChange("Content")}
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
      <button onClick={handleSubmit}>submit</button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default KnowledgeDocumentForm;
