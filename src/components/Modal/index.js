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
  const dataRef = React.useRef({});

  const handleToggle = (data) => {
    if (data != null) {
      dataRef.current = data;
    }
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
      <DialogContent>
        {React.cloneElement(children, {
          toggleModal: handleToggle,
          data: dataRef.current,
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleToggle}>取消</Button>
        <Button onClick={handleConfirm}>确认</Button>
      </DialogActions>
    </Dialog>
  );
});

export default Modal;
