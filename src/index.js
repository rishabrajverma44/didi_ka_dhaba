import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import swDev from "./swDev";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
swDev();
