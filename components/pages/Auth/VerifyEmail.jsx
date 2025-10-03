import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/users/verify-email/${token}`);
        setMessage(data.message || "Your email has been verified!");
        setIsSuccess(true);

        // Redirect to sign in page after 3 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 3000);

      } catch (error) {
        setMessage(
          error.response?.data?.message || "Verification link is invalid or expired."
        );
        setIsSuccess(false);
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>{message}</h2>
      {!isSuccess && (
        <Link to="/" style={{ color: "blue", textDecoration: "underline" }}>
          Back to Home
        </Link>
      )}
    </div>
  );
};

export default VerifyEmail;
