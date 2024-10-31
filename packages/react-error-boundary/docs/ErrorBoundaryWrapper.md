## 使用示例

```tsx
import React, { useState } from "react";
import { ErrorBoundaryWrapper } from "@ns-widget/react-error-boundary";

const Child = () => {
  useEffect(() => {
    const shouldThrowError = Math.random() < 0.5; // 50% 概率抛出错误
    console.log("Checking if error should be thrown:", shouldThrowError);

    if (shouldThrowError) {
      throw new Error("UserBio component failed to load"); // 模拟错误
    }
  }, []);
  return (
    <div>
      <p>render success...</p>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <h2>User Info</h2>
      <Child>
        <UserBio />
      </Child>
    </div>
  );
};

export default App;
```
