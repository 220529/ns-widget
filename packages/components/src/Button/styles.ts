import styled from "styled-components";

const BaseButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
`;

export const PrimaryButton = styled(BaseButton)`
  background-color: #00b38a;
  color: white;

  &:hover {
    background-color: #00c8a0;
  }
`;

export const SecondaryButton = styled(BaseButton)`
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;

  &:hover {
    background-color: #e2e6ea;
  }
`;
