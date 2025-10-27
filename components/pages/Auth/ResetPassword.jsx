import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useTranslate from "../../hooks/useTranslate.jsx";
import "../../../styles/signin.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const t = useTranslate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error(t("Please fill in all fields", "يرجى ملء جميع الحقول"));
    }

    if (password !== confirmPassword) {
      return toast.error(t("Passwords do not match", "كلمتا المرور غير متطابقتين"));
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${API_URL}/api/users/reset-password/${token}`,
        { password }
      );

      toast.success(t(data.message || "Password reset successful", "تمت إعادة تعيين كلمة المرور بنجاح"));
      navigate("/signin");
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("Something went wrong", "حدث خطأ ما")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="signin-container"
      dir={t.language === "ar" ? "rtl" : "ltr"}
      style={{ textAlign: t.textAlign }}
    >
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>{t("Reset Password", "إعادة تعيين كلمة المرور")}</h2>

        <input
          type="password"
          className="signin-input"
          placeholder={t("New password", "كلمة المرور الجديدة")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          dir={t.language === "ar" ? "rtl" : "ltr"}
        />

        <input
          type="password"
          className="signin-input"
          placeholder={t("Confirm new password", "تأكيد كلمة المرور الجديدة")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          dir={t.language === "ar" ? "rtl" : "ltr"}
        />

        <button type="submit" className="signin-btn" disabled={loading}>
          {loading
            ? t("Resetting...", "جاري إعادة التعيين...")
            : t("Reset Password", "إعادة تعيين كلمة المرور")}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
