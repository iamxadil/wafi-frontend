import React, { useState } from "react";
import { toast } from "react-toastify";
import useAuthStore from "../../stores/useAuthStore";
import useTranslate from "../../hooks/useTranslate.jsx";
import "../../../styles/changepassword.css";

const ChangePassword = ({ onClose }) => {
  const { user, updateProfile, loading } = useAuthStore();
  const t = useTranslate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error(t("All fields are required.", "جميع الحقول مطلوبة."));
    }
    if (newPassword.length < 6) {
      return toast.error(
        t("New password must be at least 6 characters.", "يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.")
      );
    }
    if (newPassword !== confirmPassword) {
      return toast.error(
        t("New passwords do not match.", "كلمتا المرور الجديدتان غير متطابقتين.")
      );
    }

    try {
      await updateProfile({ currentPassword, newPassword });
      toast.success(t("Password changed successfully!", "تم تغيير كلمة المرور بنجاح!"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || t("An error occurred.", "حدث خطأ."));
    }
  };

  return (
    <div className="modal-overlay" dir={t.language === "ar" ? "rtl" : "ltr"}>
      <div className="modal-content">
        <h2 style={{ textAlign: t.textAlign }}>
          {t("Change Password", "تغيير كلمة المرور")}
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            {t("Current Password", "كلمة المرور الحالية")}
            <input
              type="password"
              dir={t.language === "ar" ? "rtl" : "ltr"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
          <label>
            {t("New Password", "كلمة المرور الجديدة")}
            <input
              type="password"
              dir={t.language === "ar" ? "rtl" : "ltr"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <label>
            {t("Confirm New Password", "تأكيد كلمة المرور الجديدة")}
            <input
              type="password"
              dir={t.language === "ar" ? "rtl" : "ltr"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? t("Saving...", "جاري الحفظ...") : t("Save", "حفظ")}
            </button>
            <button type="button" onClick={onClose}>
              {t("Cancel", "إلغاء")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
