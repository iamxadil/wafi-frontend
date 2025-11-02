import React, { useEffect, useState } from "react";
import "../../../styles/profilepage.css";
import useAuthStore from "../../stores/useAuthStore";
import { toast } from "react-toastify";
import ChangePassword from "./ChangePassword";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, CheckCircle2 } from "lucide-react";
import useTranslate from "../../hooks/useTranslate";

const Profile = () => {
  const { profile, user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const t = useTranslate();

  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Greeting
  const [greeting, setGreeting] = useState("");
  const [Icon, setIcon] = useState(Sun);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting(t("Good Morning", "صباح الخير"));
      setIcon(Sun);
    } else if (hour >= 12 && hour < 18) {
      setGreeting(t("Good Afternoon", "مساء الخير"));
      setIcon(Sun);
    } else {
      setGreeting(t("Good Evening", "مساء الخير"));
      setIcon(Moon);
    }
  }, [t.language]);

  const handleOpenModal = () => setShowModal(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    profile();
  }, [profile]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  /* ==========================================================
     📝 Handle Save (only allows name/password)
  ========================================================== */
  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        ...(formData.currentPassword && formData.newPassword
          ? {
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
            }
          : {}),
      });

      toast.success(
        t("Profile Updated Successfully", "تم تحديث الملف الشخصي بنجاح")
      );
      setIsEdit(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(
        error.response?.data?.message ||
          t("Failed to update profile", "فشل في تحديث الملف الشخصي")
      );
    }
  };

  const handleLogout = () => logout(navigate);

  /* ==========================================================
     🚫 Not signed in
  ========================================================== */
  if (!user) {
    return (
      <main id="not-signed-in-page" dir={t.language === "ar" ? "rtl" : "ltr"}>
        <motion.div
          className="not-signed-in-glass"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2>{t("Welcome!", "مرحباً!")}</h2>
          <p>
            {t(
              "You need to sign in or register to view your profile.",
              "يجب عليك تسجيل الدخول أو إنشاء حساب لعرض ملفك الشخصي."
            )}
          </p>
          <div className="auth-buttons">
            <Link to="/signin" className="btn-login">
              {t("Sign In", "تسجيل الدخول")}
            </Link>
            <Link to="/register" className="btn-register">
              {t("Register", "إنشاء حساب")}
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  /* ==========================================================
     ✅ Profile Page
  ========================================================== */
  return (
    <main id="profile-page" dir={t.language === "ar" ? "rtl" : "ltr"}>
      {showModal && <ChangePassword onClose={() => setShowModal(false)} />}

      <header id="welcome">
        <h1 style={{ textAlign: t.textAlign }}>
          <span style={{ fontWeight: "200" }}>
            {t("Hello,", "مرحباً،")}
          </span>{" "}
          {formData.name || user?.name}
        </h1>
        <p style={{ textAlign: t.textAlign }}>
          {greeting} <Icon size={18} />
        </p>
      </header>

      <section id="main-page">
        <div id="user-info">
          <div id="user-info-header">
            <h1 style={{ textAlign: t.textAlign }}>
              {t("Personal Info", "المعلومات الشخصية")}
            </h1>
            {isEdit ? (
              <button onClick={handleSave} className="save-info">
                {t("Save Profile", "حفظ الملف الشخصي")}
              </button>
            ) : (
              <button onClick={() => setIsEdit(true)}>
                {t("Edit Profile", "تعديل الملف الشخصي")}
              </button>
            )}
          </div>

          <div id="edit-info" style={{ textAlign: t.textAlign }}>
            <h2>
              {t("Name", "الاسم")}{" "}
              <span>
                {isEdit ? (
                  <input
                    dir={t.language === "ar" ? "rtl" : "ltr"}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                ) : (
                  formData.name || user.name
                )}
              </span>
            </h2>

            <h2 className="email-field">
              {t("Email", "البريد الإلكتروني")}{" "}
              <span className="locked-email">
                {formData.email || user.email}
                <span className="verify-badge verified">
                  <CheckCircle2 size={14} /> {t("Verified", "تم التحقق")}
                </span>
              </span>
            </h2>

            <button className="change-password" onClick={handleOpenModal}>
              {t("Change Password", "تغيير كلمة المرور")}
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              {t("Logout", "تسجيل الخروج")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
