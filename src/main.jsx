import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { HotelProvider } from "./context/HotelContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HotelProvider>
      <App />
    </HotelProvider>
  </BrowserRouter>,
);
