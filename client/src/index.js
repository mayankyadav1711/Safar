import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./components/signin.module.css";
import "./components/home.module.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
