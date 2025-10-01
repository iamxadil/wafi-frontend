import React, { useState } from "react";
import { RiUserLine as UserIcon, RiMailLine as MailIcon, RiLockLine as LockIcon } from "react-icons/ri";
import "../../../styles/signin.css";
import useAuthStore from "../../stores/useAuthStore.jsx";
import { useNavigate } from "react-router-dom";

const API_URL = "https://wafi-backend-nlp6.onrender.com";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await register(name, email, password, confirm, navigate);
  } catch (err) {
    console.error("Registration failed:", err);
  }
};


  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        

        <div className="input-group">
          <UserIcon className="input-icon" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div className="input-group">
          <MailIcon className="input-icon" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value.toLowerCase())}
            required
            autoComplete="email"
          />
        </div>

        <div className="input-group">
          <LockIcon className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="input-group">
          <LockIcon className="input-icon" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="signin-btn" disabled={loading}>
          Register
        </button>
      </form>

      <div style={{ display: "none" }}>
        <label>Leave this blank</label>
        <input type="text" name="website" />
      </div>

    </div>
  );
};

export default Register;
