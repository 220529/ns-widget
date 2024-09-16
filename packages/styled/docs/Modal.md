## 使用示例

```tsx
import React, { useState } from "react";
import { Button, Modal } from "@ns-widget/styled";

const App = () => {
  const [visible, setVisible] = useState(false);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);
  return (
    <div>
      <Button onClick={openModal} type="primary">
        Primary
      </Button>
      <Modal visible={visible} onClose={closeModal}>
        <h2>Modal Title</h2>
        <p>Some important content goes here.</p>
        <Button onClick={closeModal}>Close</Button>
      </Modal>
    </div>
  );
};

export default App;
```
