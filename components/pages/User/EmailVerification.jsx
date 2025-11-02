import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../../../styles/emailverification.css";
import useTranslate from "../../hooks/useTranslate.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const t = useTranslate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/verify-email/${token}`);
        if (res.data?.message?.toLowerCase().includes("success")) {
          setStatus("success");
          toast.success(t("Email verified successfully!", "تم تأكيد البريد الإلكتروني بنجاح!"));
          setTimeout(() => navigate("/signin"), 2000);
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
        toast.error(
          t("Verification link is invalid or expired.", "رابط التحقق غير صالح أو منتهي.")
        );
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <main id="verify-page">
      <div className="verify-box">
        {status === "verifying" && (
          <>
            <div className="spinner" />
            <h2>{t("Verifying your email...", "جارٍ التحقق من بريدك الإلكتروني...")}</h2>
          </>
        )}

        {status === "success" && (
          <>
            <div className="verify-icon success">✓</div>
            <h2>{t("Your email has been verified!", "تم تأكيد بريدك الإلكتروني!")}</h2>
            <p>{t("Redirecting to sign in...", "جاري التحويل إلى تسجيل الدخول...")}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="verify-icon error">✕</div>
            <h2>{t("Verification failed", "فشل التحقق")}</h2>
            <p>
              {t(
                "Your verification link may have expired or already been used.",
                "قد يكون رابط التحقق منتهي الصلاحية أو تم استخدامه مسبقاً."
              )}
            </p>
            <button onClick={() => navigate("/signin")}>
              {t("Go to Sign In", "الانتقال إلى تسجيل الدخول")}
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default EmailVerification;
