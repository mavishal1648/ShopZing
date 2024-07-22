import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/userContext";

const Login = ()=>{
    const navigate = useNavigate();
    const {handleSignIn} = useUser();
    const passwordRef = useRef();
    const emailRef = useRef();
    const handleSubmit = async(e)=>{
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const success = await handleSignIn(email,password);
        if(success){
          navigate('/');
        }
    }
    return(
        <div className="d-flex justify-content-center align-items-start min-vh-100 mt-5">
      <form className="p-2 border rounded bg-light" style={{ maxWidth: '400px', width: '100%' }} onSubmit={handleSubmit}>
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
          />
          <div id="passwordHelp" className="form-text">
            Minimum 6 characters long
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
    )
}
export default Login;