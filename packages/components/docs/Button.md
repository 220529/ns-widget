## 使用示例

```tsx
import React, { useState } from "react";
import { Button } from "@ns-widget/components";

const App = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>count: {count}</p>
      <Button onClick={handleClick} type="primary">
        Primary
      </Button>
      &nbsp;
      <Button>default</Button>
    </div>
  );
};

export default App;
```
