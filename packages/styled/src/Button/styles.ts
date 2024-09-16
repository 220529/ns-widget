// Button.styles.ts
import styled from "styled-components";

// 基础按钮样式
export const BaseButton = styled.button`
  display: inline-block;
  padding: 10px 20px; /* 使用 px 单位 */
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

// Primary Button 样式
export const PrimaryButton = styled(BaseButton)`
  background-color: #00b38a;
  color: white;

  &:hover {
    background-color: #00c8a0;
  }
`;

// Secondary Button 样式
export const SecondaryButton = styled(BaseButton)`
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;

  &:hover {
    background-color: #e2e6ea;
  }
`;
