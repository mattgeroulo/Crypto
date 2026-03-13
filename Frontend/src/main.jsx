import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Login from "./Login";
import Blockchain from "./Blockchain"
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/app" element={<App />} />
      <Route path="/" element={<Login/>}/>
      <Route path="/blockchain" element ={<Blockchain/>}/>
    </Routes>
  </BrowserRouter>,
);
