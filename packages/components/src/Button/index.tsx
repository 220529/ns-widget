import React, { FC, MouseEventHandler } from "react";
import { PrimaryButton, SecondaryButton } from "./styles";

console.log("React", React);

// 定义 Button 组件的 Props 类型
interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "primary"; // 仅支持 'primary' 或不传
  children: React.ReactNode;
}

// Button 组件
const Button: FC<ButtonProps> = ({ onClick, type, children }) => {
  const ButtonComponent = type === "primary" ? PrimaryButton : SecondaryButton;

  return <ButtonComponent onClick={onClick}>{children}</ButtonComponent>;
};

export default Button;
