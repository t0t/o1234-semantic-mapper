import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Check for OpenAI API key in localStorage and set it to env
const storedApiKey = localStorage.getItem("OPENAI_API_KEY");
if (storedApiKey) {
  // Set it to a global variable that can be accessed by the app
  window.OPENAI_API_KEY = storedApiKey;
}

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
