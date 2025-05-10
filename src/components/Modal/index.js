import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import React from "react";

const Modal = React.forwardRef(({ children, title, onConfirm }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleToggle();
  };

  React.useImperativeHandle(ref, () => ({
    onConfirm: handleConfirm,
    onToggle: handleToggle,
  }));

  return (
    <Dialog open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleToggle}>取消</Button>
        <Button onClick={handleConfirm}>确认</Button>
      </DialogActions>
    </Dialog>
  );
});

export default Modal;
