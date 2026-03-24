import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./assets/css/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    {/* BrowserRouter must wrap App here! */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>,
);
