import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../../../styles/signin.css"; 



function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${API_URL}/api/users/reset-password/${token}`,
        { password }
      );

      toast.success(data.message || "Password reset successful");
      navigate("/signin");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
  <form className="signin-form" onSubmit={handleSubmit}>
    <h2>Reset Password</h2>
    <input
      type="password"
      className="signin-input"
      placeholder="New password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <input
      type="password"
      className="signin-input"
      placeholder="Confirm new password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
    <button type="submit" className="signin-btn" disabled={loading}>
      {loading ? "Resetting..." : "Reset Password"}
    </button>
  </form>
  </div>
  );
}

export default ResetPassword;
