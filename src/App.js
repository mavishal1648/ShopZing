import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Component/Navbar/NavBar";
import Home from "./Pages/Homepage";
import Cart from "./Pages/Cartpage";

import Notfound from "./Pages/Notfound";
import Register from "./Pages/Registerpage";
import Login from "./Pages/Loginpage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./Context/userContext";
import Order from "./Pages/OrderPage";

function App() {
  const { user } = useUser();
  return (
    <Router>
      <header>
        <Navbar/>
        <div className="container mt-4"></div>
      </header>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {user ? (
          <Route path="/cart" element={<Cart />} />
        ) : (
          <Route path="/login" element={<Login />} />
        )}
        {user ? (
          <Route path="/orders" element={<Order/>} />
        ) : (
          <Route path="/login" element={<Login />} />
        )}

        <Route path="*" element={<Notfound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
