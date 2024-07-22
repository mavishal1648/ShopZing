import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ProductProvider } from "./Context/productContext";
import { UserProvider } from "./Context/userContext";
import "react-toastify/dist/ReactToastify.css"; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <ProductProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ProductProvider>
  </UserProvider>
);
