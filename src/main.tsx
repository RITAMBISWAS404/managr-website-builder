import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import { BuilderProvider } from "./store/BuilderProvider";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <BuilderProvider>
        <TooltipProvider delayDuration={200}>
          <App />
          <Toaster />
        </TooltipProvider>
      </BuilderProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
