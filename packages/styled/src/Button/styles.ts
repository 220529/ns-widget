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
  transition:
    background-color 0.3s,
    color 0.3s;
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

// Danger Button 样式（完善后的颜色）
export const DangerButton = styled(BaseButton)`
  background-color: #dc3545; /* 红色背景，代表危险 */
  color: white; /* 白色字体，增强对比 */

  &:hover {
    background-color: #c82333; /* 更深的红色，悬停时突出警告 */
  }

  &:active {
    background-color: #bd2130; /* 按下时更深的颜色 */
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5); /* 聚焦时有红色阴影 */
  }
`;
