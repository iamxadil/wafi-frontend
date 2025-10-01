import React, { useState } from "react";
import { RiMailLine as MailIcon } from "react-icons/ri";
import { Link } from "react-router-dom";
import "../../../styles/signin.css"; 
import useAuthStore from "../../stores/useAuthStore.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const loading = useAuthStore((state) => state.loading);
  const forgotPassword = useAuthStore((state) => state.forgotPassword); // make sure you have this action in your store

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword(email);
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <p style={{ textAlign: "center", marginBottom: "1rem" }}>
          Enter your email.
        </p>

        <div className="input-group">
          <MailIcon className="input-icon" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="signin-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Remembered your password? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
