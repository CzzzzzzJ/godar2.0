import {
  Alert,
  Box,
  Button,
  Container,
  Snackbar,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import useSWRMutation from "swr/mutation";
import { post, put } from "../../../utils/request";

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#F5F7F5",
  },
}));

const KnowledgeCategoryForm = ({ toggleModal, data, onRefresh }) => {
  const isEditMode = Object.keys(data).length > 0;
  // 弹窗状态
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = React.useState({
    CategoryName: "",
    Description: "",
    AssistantId: 1,
  });

  const handleChange = (filed) => (evt) => {
    setFormData((prev) => ({ ...prev, [filed]: evt.target.value }));
  };

  console.log("render", formData);

  const handleSubmit = () => {
    console.log(formData);
    //
    if (!formData.CategoryName || !formData.Description) {
      setSnackbar({
        open: true,
        message: "请完善表单信息",
        severity: "warning",
      });
      return;
    }

    const handler = isEditMode ? put : post;
    handler({
      url: "/Knowledge/categories",
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

  return (
    <div>
      <StyledTextField
        fullWidth
        multiline
        placeholder="请输入分类名称"
        variant="outlined"
        label="分类名称"
        required
        value={formData.CategoryName}
        onChange={handleChange("CategoryName")}
      />
      <StyledTextField
        fullWidth
        multiline
        rows={4}
        placeholder="请输入分类描述"
        variant="outlined"
        label="分类描述"
        required
        value={formData.Description}
        onChange={handleChange("Description")}
      />
      <Button onClick={handleSubmit}>submit</Button>
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

export default KnowledgeCategoryForm;
