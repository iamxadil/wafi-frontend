import React, { useState } from "react";
import {
  RiUserLine as UserIcon,
  RiMailLine as MailIcon,
  RiLockLine as LockIcon,
} from "react-icons/ri";
import "../../../styles/signin.css";
import useAuthStore from "../../stores/useAuthStore.jsx";
import { useNavigate } from "react-router-dom";
import useTranslate from "../../hooks/useTranslate.jsx";

const Register = () => {
  const t = useTranslate();
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
    <div
      className="signin-container"
      dir={t.language === "ar" ? "rtl" : "ltr"}
      style={{ textAlign: t.textAlign }}
    >
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>{t("Register", "إنشاء حساب")}</h2>

        {/* Full Name */}
        <div className="input-group">
          <UserIcon className="input-icon" />
          <input
            type="text"
            placeholder={t("Full Name", "الاسم الكامل")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            dir={t.language === "ar" ? "rtl" : "ltr"}
          />
        </div>

        {/* Email */}
        <div className="input-group">
          <MailIcon className="input-icon" />
          <input
            type="email"
            placeholder={t("Email Address", "عنوان البريد الإلكتروني")}
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
            autoComplete="email"
            dir={t.language === "ar" ? "rtl" : "ltr"}
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <LockIcon className="input-icon" />
          <input
            type="password"
            placeholder={t("Password", "كلمة المرور")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            dir={t.language === "ar" ? "rtl" : "ltr"}
          />
        </div>

        {/* Confirm Password */}
        <div className="input-group">
          <LockIcon className="input-icon" />
          <input
            type="password"
            placeholder={t("Confirm Password", "تأكيد كلمة المرور")}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            dir={t.language === "ar" ? "rtl" : "ltr"}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="signin-btn" disabled={loading}>
          {loading ? t("Registering...", "جاري التسجيل...") : t("Register", "تسجيل")}
        </button>
      </form>

      {/* Hidden Honeypot Field (anti-bot) */}
      <div style={{ display: "none" }}>
        <label>{t("Leave this blank", "اترك هذا الحقل فارغًا")}</label>
        <input type="text" name="website" />
      </div>
    </div>
  );
};

export default Register;
