import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useTranslate from "../../hooks/useTranslate.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const t = useTranslate();

  const [message, setMessage] = useState(t("Verifying your email...", "جارٍ التحقق من بريدك الإلكتروني..."));
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/users/verify-email/${token}`);
        setMessage(
          t(data.message || "Your email has been verified!", "تم التحقق من بريدك الإلكتروني بنجاح!")
        );
        setIsSuccess(true);

        // Redirect to sign in page after 3 seconds
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } catch (error) {
        setMessage(
          t(
            error.response?.data?.message || "Verification link is invalid or expired.",
            "رابط التحقق غير صالح أو منتهي الصلاحية."
          )
        );
        setIsSuccess(false);
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div
      style={{
        textAlign: t.textAlign,
        direction: t.language === "ar" ? "rtl" : "ltr",
        padding: "50px",
      }}
    >
      <h2>{message}</h2>

      {!isSuccess && (
        <Link
          to="/"
          style={{
            color: "var(--accent-clr, blue)",
            textDecoration: "underline",
            fontWeight: 500,
            display: "inline-block",
            marginTop: "1rem",
          }}
        >
          {t("Back to Home", "العودة إلى الصفحة الرئيسية")}
        </Link>
      )}
    </div>
  );
};

export default VerifyEmail;
