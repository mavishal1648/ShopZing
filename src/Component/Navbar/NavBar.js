import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useUser } from "../../Context/userContext";
import { toast } from "react-toastify";
import { useProduct } from "../../Context/productContext";
const Navbar = () => {
  const { user,handleSignOut} = useUser();
  const {searchProducts} = useProduct();
  const searchQueryRef = useRef();
  const handleSearch = (e)=>{
    e.preventDefault();
    const search = searchQueryRef.current.value;
    if(search){
      searchProducts(search);
    }
    else{
      return;
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-4">
      <div className="container-fluid">
        <div className="navbar-brand">SHOP._.ZING</div>
        <div className="navbar-brand">
          <Link to="/" className={styles.link}>
            Home
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <form className="d-flex me-auto">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              ref={searchQueryRef}
            />
            <button className="btn btn-outline-success" onClick={handleSearch}>
              Search
            </button>
          </form>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle fs-5"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user ? user : "User"}
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                <li>
                  <div className="dropdown-item fs-5">
                    <Link
                      to={user ? "/cart" : "/login"}
                      className={styles.link}
                    >
                      {user ? "My-Cart" : "Login"}
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="dropdown-item fs-5">
                    <Link
                      to={user ? "/orders" : "/register"}
                      className={styles.link}
                    >
                      {user ? "My-Orders" : "Register"}
                    </Link>
                  </div>
                </li>
                {user && (
                  <li>
                    <div className="dropdown-item fs-5" onClick={handleSignOut}
                     style={{ cursor: "pointer" }}>
                      Logout
                    </div>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
