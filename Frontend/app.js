import { createRoot } from "https://esm.sh/react-dom@18/client";
import React from "https://esm.sh/react@18";

function App() {
  return React.createElement("div", null, "Hello world");
}

const container = document.getElementById("root");
const root = createRoot(container);

root.render(React.createElement(App));