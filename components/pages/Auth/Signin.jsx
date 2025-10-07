import React, { useState, useEffect } from "react";
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
  const resendVerificationEmail = useAuthStore((state) => state.resendVerificationEmail);
  const resendCooldown = useAuthStore((state) => state.resendCooldown);
  const unverifiedEmail = useAuthStore((state) => state.unverifiedEmail);
  const setResendCooldown = useAuthStore((state) => state.setResendCooldown);

  const navigate = useNavigate();
  const [localCooldown, setLocalCooldown] = useState(resendCooldown || 0);

  // Countdown effect for resend button
  useEffect(() => {
    if (localCooldown <= 0) return;
    const interval = setInterval(() => {
      setLocalCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [localCooldown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    signin(email, password, navigate, rememberMe);
  };

  const handleResend = async () => {
    if (!unverifiedEmail) return;
    const remaining = await resendVerificationEmail(unverifiedEmail);
    setLocalCooldown(remaining);
    setResendCooldown(remaining); // persist in store
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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="signin-options">
          <label>
            <input
              type="checkbox"
              disabled={loading}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />{" "}
            Remember Me
          </label>
          <Link to="/forgot-password" className="forgot-link">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="signin-btn" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {unverifiedEmail && (
          <button
            type="button"
            className="signin-btn resend-btn"
            disabled={localCooldown > 0 || loading}
            onClick={handleResend}
            style={{ marginTop: "1rem" }}
          >
            {localCooldown > 0
              ? `Resend available in ${localCooldown}s`
              : "Resend Verification Email"}
          </button>
        )}

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signin;
