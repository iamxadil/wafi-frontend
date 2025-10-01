import React, { useEffect, useState } from "react";
import { RiMailLine as MailIcon, RiLockLine as LockIcon } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/signin.css";
import useAuthStore from "../../stores/useAuthStore.jsx";


const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);  
  const loading = useAuthStore((state) => state.loading);
  const signin = useAuthStore((state) => state.signin);
  const profile = useAuthStore((state) => state.profile);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signin(email, password, navigate, rememberMe);
  };


  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>

        <div className="input-group">
          <MailIcon className="input-icon" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <LockIcon className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="signin-options">
          <label>
            <input type="checkbox"  disabled={loading} checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}/> Remember Me
          </label>
          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link> 
        </div>

        <button type="submit" className="signin-btn" disabled={loading} >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signin;
