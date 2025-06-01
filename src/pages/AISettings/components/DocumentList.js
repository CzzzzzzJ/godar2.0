import React from "react";
import useSWR from "swr";
import { getFetcher } from "../../../utils/request/fetcher";
import { Box, Button, TextField } from "@mui/material";
import styled from "styled-components";
import Modal from "../../../components/Modal";
import KnowledgeDocumentForm from "./KnowledgeDocumentForm";

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#FFFFFF",
    "& fieldset": {
      borderColor: "#E5E5E5",
    },
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  //   gap: theme.spacing(1.5),
  flexShrink: 0,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  height: "40px",
  padding: "0 16px",
  minWidth: "100px",
  whiteSpace: "nowrap",
  textTransform: "none",
  boxShadow: "none",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  //   gap: theme.spacing(0.5),
  "& .icon": {
    fontSize: "18px",
    marginRight: "2px",
  },
}));

const DocumentList = ({ categoryId }) => {
  const modalRef = React.useRef();

  const { data, mutate: getDocuments } = useSWR(
    categoryId ? `/Knowledge/documents/${categoryId}` : null,
    getFetcher
  );

  const handleToggleModal = () => {
    modalRef.current?.onToggle();
  };

  console.log(categoryId, data);
  return (
    <div>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <SearchField
          fullWidth
          placeholder="搜索知识库..."
          //   value={settings.searchQuery}
          //   onChange={handleChange("searchQuery")}
          //   InputProps={{
          //     startAdornment: (
          //       <InputAdornment position="start">
          //         <SearchIcon color="action" />
          //       </InputAdornment>
          //     ),
          //   }}
        />
        <ActionButtons>
          <ActionButton
            variant="contained"
            color="primary"
            startIcon={<span className="icon">↑</span>}
            onClick={handleToggleModal}
          >
            新建文档
          </ActionButton>
          <ActionButton
            variant="contained"
            color="primary"
            startIcon={<span className="icon">⇧</span>}
          >
            上传bot
          </ActionButton>
        </ActionButtons>
      </Box>
      <Modal ref={modalRef} title="新建文档">
        <KnowledgeDocumentForm
          categoryId={categoryId}
          onRefresh={getDocuments}
          toggleModal={handleToggleModal}
        />
      </Modal>
    </div>
  );
};

export default DocumentList;
