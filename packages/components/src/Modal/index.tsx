import React, { FC } from "react";
import { ModalOverlay, ModalContent, ModalCloseButton } from "./styles";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ visible, onClose, children }) => {
  if (!visible) return null; // 如果 modal 不可见，返回 null 不渲染任何内容

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>&times;</ModalCloseButton>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
