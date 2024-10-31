// ErrorBoundaryWrapper.tsx
import React, { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryWrapper } from "./styles";

// 定义 Props 的接口
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

// 错误回退 UI 组件
const ErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => {
  return (
    <ErrorBoundaryWrapper role="alert">
      <h2>Oops, something went wrong!</h2>
      <p>Error details: {error.message}</p>
      <button onClick={resetErrorBoundary}>加载错误，请重试~</button>
    </ErrorBoundaryWrapper>
  );
};

// 错误上报函数
const reportError = (error: Error) => {
  // 这里可以集成 Sentry、LogRocket 等工具进行错误上报
  console.error("Reporting error to monitoring service:", error);
  // 例如使用 Sentry
  // Sentry.captureException(error);
  // monitor.upload({ type: "ErrorBoundary", error });
};

// 封装的 ErrorBoundary 组件
const App: React.FC<ErrorBoundaryWrapperProps> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={reportError}>
      {children}
    </ReactErrorBoundary>
  );
};

export default App;
