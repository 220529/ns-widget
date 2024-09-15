import React, { FC, MouseEventHandler } from "react";
import "./index.less"; // 引入 LESS 文件

// 定义 Button 组件的 Props 类型
interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "primary"; // 仅支持 'primary' 或不传
  children: React.ReactNode;
}

// Button 组件
const Button: FC<ButtonProps> = ({ onClick, type, children }) => {
  const buttonClassName =
    type === "primary"
      ? "ns-widget-primary-button"
      : "ns-widget-secondary-button";

  return (
    <button className={`ns-widget-button ${buttonClassName}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
