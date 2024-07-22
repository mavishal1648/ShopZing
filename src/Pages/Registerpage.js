import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../Context/userContext";

const Register = () => {
  const navigate = useNavigate();
  const { handleSignUp } = useUser();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (password.length < 6) {
      toast.error('Password must have at least 6 characters');
      return;
    }
    const success = await handleSignUp(name, email, password);
    if (success) {
      console.log(success);
      navigate('/login');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start min-vh-100 mt-5">
      <form className="p-2 border rounded bg-light" style={{ maxWidth: '400px', width: '100%' }} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            aria-describedby="nameHelp"
            ref={nameRef}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            ref={emailRef}
            required
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            aria-describedby="passwordHelp"
            ref={passwordRef}
            required
          />
          <div id="passwordHelp" className="form-text">
            Minimum 6 characters long
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
        <div id="checkLogin" className="form-text">
          If already registered &nbsp;&nbsp;&nbsp;
          <Link to="/login">Login Page</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
