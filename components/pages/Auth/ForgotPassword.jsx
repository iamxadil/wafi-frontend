import React, { useState, useEffect } from "react";
import { RiMailLine as MailIcon } from "react-icons/ri";
import { Link } from "react-router-dom";
import "../../../styles/signin.css";
import useAuthStore from "../../stores/useAuthStore.jsx";
import useTranslate from "../../hooks/useTranslate.jsx";

const COOLDOWN_SECONDS = 60 * 60; // fallback 1 hour

const ForgotPassword = () => {
  const t = useTranslate();

  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const loading = useAuthStore((state) => state.loading);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  // Initialize cooldown from localStorage
  useEffect(() => {
    const storedEnd = localStorage.getItem("forgotPasswordCooldown");
    if (storedEnd) {
      const remaining = Math.floor((new Date(storedEnd) - Date.now()) / 1000);
      if (remaining > 0) setCooldown(remaining);
      else localStorage.removeItem("forgotPasswordCooldown");
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("forgotPasswordCooldown");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email || cooldown > 0) return;

    try {
      const remaining = await forgotPassword(email);
      const endTime = new Date(Date.now() + (remaining || COOLDOWN_SECONDS) * 1000);
      localStorage.setItem("forgotPasswordCooldown", endTime.toISOString());
      setCooldown(remaining || COOLDOWN_SECONDS);
    } catch (err) {
      console.error(err);
    }
  };

  const renderButtonText = () => {
    if (loading) return t("Sending...", "جاري الإرسال...");
    if (cooldown > 0) {
      const minutes = Math.ceil(cooldown / 60);
      return t(
        `Wait ${minutes} minute${minutes > 1 ? "s" : ""} before resending`,
        `يرجى الانتظار ${minutes} دقيقة قبل إعادة الإرسال`
      );
    }
    return t("Send Reset Link", "إرسال رابط إعادة التعيين");
  };

  return (
    <div
      className="signin-container"
      dir={t.language === "ar" ? "rtl" : "ltr"}
      style={{ textAlign: t.textAlign }}
    >
      <form className="signin-form" onSubmit={handleSend}>
        <h2>{t("Forgot Password", "نسيت كلمة المرور")}</h2>
        <p style={{ textAlign: "center", marginBottom: "1rem" }}>
          {t(
            "Enter your email to receive a reset link.",
            "أدخل بريدك الإلكتروني لتصلك رسالة لإعادة تعيين كلمة المرور."
          )}
        </p>

        <div className="input-group">
          <MailIcon className="input-icon" />
          <input
            type="email"
            placeholder={t("Email Address", "عنوان البريد الإلكتروني")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || cooldown > 0}
            dir={t.language === "ar" ? "rtl" : "ltr"}
          />
        </div>

        <button
          type="submit"
          className="signin-btn"
          disabled={loading || cooldown > 0}
        >
          {renderButtonText()}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          {t(
            <>
              Remembered your password? <Link to="/signin">Sign In</Link>
            </>,
            <>
              تذكّرت كلمة المرور؟ <Link to="/signin">تسجيل الدخول</Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
