import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./app/AppRouter";
import "./styles/index.css";

const container = document.getElementById("root");
if (!container) throw new Error("The #root element is missing from index.html.");

createRoot(container).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
