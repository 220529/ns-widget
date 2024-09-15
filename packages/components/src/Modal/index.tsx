import React, { FC } from "react";
import "./index.less"; // 引入 LESS 文件

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ visible, onClose, children }) => {
  if (!visible) return null; // 如果 modal 不可见，返回 null 不渲染任何内容

  return (
    <div className="ns-widget-modal" onClick={onClose}>
      <div
        className="ns-widget-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="ns-widget-modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
