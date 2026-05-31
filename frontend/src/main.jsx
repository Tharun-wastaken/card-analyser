import React from "react";
import ReactDOM from "react-dom/client";
import { MotionConfig } from "framer-motion";
import App from "./App.jsx";
import "./index.css";

// reducedMotion="user" makes every Framer Motion component honor the OS
// "reduce motion" setting without per-component checks (CSS loops are handled
// in index.css). Spring transitions are kept gentle so nothing reads as bounce.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>
);
