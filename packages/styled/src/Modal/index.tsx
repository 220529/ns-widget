import React, { FC } from "react";
import { ModalOverlay, ModalContent, ModalCloseButton } from "./styles";

// 定义 Modal 组件的 Props 类型
interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Modal 组件
const Modal: FC<ModalProps> = ({ visible, onClose, children }) => {
  if (!visible) return null;

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
