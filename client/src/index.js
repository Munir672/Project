import React from "react";
import { createRoot } from "react-dom/client"; 
import App from "./App";

const root = createRoot(document.getElementById("react-container"));
root.render(<App />);
