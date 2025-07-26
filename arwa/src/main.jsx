import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LandPage from "./components/LandPage.jsx";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <LandPage />
    </StrictMode>
  );
}
