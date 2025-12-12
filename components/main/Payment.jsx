import React, { useState, useRef } from "react";
import "../../styles/payment.css";
import useCartStore from "../stores/useCartStore.jsx";
import useOrderStore from "../stores/useOrderStore.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import useTranslate from "../hooks/useTranslate.jsx";
import { useOtpQuery } from "../query/useOtpQuery.jsx";
import OtpMethodModal from "../utils/OtpMethodModal.jsx";

const Payment = () => {
  const navigate = useNavigate();
  const t = useTranslate();
  const [resendTimer, setResendTimer] = useState(0);

  /* ==========================================================
     Cart & Totals
  ========================================================== */
  const cartItems = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const delivery = 0;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.finalPrice * item.qty,
    0
  );
  const total = subtotal + delivery;

  const cities = [
    "Al-Anbar","Erbil","Babil","Baghdad","Basra","Dhi-Qar","Duhok","Diyala","Halabja",
    "Karbala","Kirkuk","Muthanna","Maysan","Nineveh","Najaf","Qadisya","Salahu-Din",
    "Sulaymaniyah","Wasit",
  ];

  const [pickup, setPickup] = useState(false);

  /* ==========================================================
     Shipping + Contact
  ========================================================== */
  const [phoneValid1, setPhoneValid1] = useState(true);
  const [phoneValid2, setPhoneValid2] = useState(true);
  const [samePhoneError, setSamePhoneError] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    phone2: "",
    email: "",
  });

  /* ==========================================================
     OTP State
  ========================================================== */
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpMethod, setOtpMethod] = useState(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  /* ==========================================================
     reCAPTCHA
  ========================================================== */
  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");

  /* ==========================================================
     Stores & Queries
  ========================================================== */
  const createOrder = useOrderStore((state) => state.createOrder);

  const {
    sendOTPAsync,
    verifyOTPAsync,
    resendOTPAsync,
    sendingOTP,
    verifyingOTP,
    resendingOTP,
  } = useOtpQuery();

  /* ==========================================================
     Validation
  ========================================================== */
  const validateBaseFields = () => {
    const { email, fullName, address, city, postalCode, phone, phone2 } = shippingInfo;

    if (
      !email ||
      !fullName ||
      (!pickup && (!address || !city || !postalCode)) ||
      !phone ||
      !phone2
    ) {
      toast.warning(t("Please fill in all required fields", "يرجى ملء جميع الحقول المطلوبة"));
      return false;
    }

    if (phone === phone2) {
      toast.error(
        t("Primary and backup numbers must be different", "يجب أن يكون رقم الهاتفين مختلفين")
      );
      setSamePhoneError(true);
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error(t("Phone must be 10 digits", "يجب أن يكون 10 أرقام"));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("Invalid email address", "البريد الإلكتروني غير صالح"));
      return false;
    }

    return true;
  };

  /* ==========================================================
     Build Order Payload
  ========================================================== */
  const buildOrderData = () => {
    const { fullName, address, city, postalCode, phone, phone2, email } = shippingInfo;

    return {
      items: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.qty,
        price: item.finalPrice || item.price,
      })),
      shippingInfo: {
        fullName,
        address,
        city,
        postalCode,
        phone: `+964${phone}`,
        phone2: phone2 ? `+964${phone2}` : "",
        email,
      },
      itemsPrice: subtotal,
      shippingPrice: delivery,
      totalPrice: total,
      paymentMethod: "Cash",
      pickup,
      captchaToken,
    };
  };

  /* ==========================================================
     Send OTP After Modal Selection
  ========================================================== */
/* ==========================================================
   Send OTP After Modal Selection
========================================================== */
const handleSendOTP = async (method) => {
  const { email, phone } = shippingInfo;

  // Immediately store the method (not required for sending)
  setOtpMethod(method);

  setOtpLoading(true);

  try {
    await sendOTPAsync({
      otpMethod: method, // <-- Use the passed method directly
      email,
      phone: `+964${phone}`,
    });

    toast.success(
      method === "email"
        ? t("OTP sent to your email!", "تم إرسال رمز التحقق إلى بريدك الإلكتروني!")
        : t("OTP sent to WhatsApp!", "تم إرسال رمز التحقق إلى واتساب!")
    );

    setOtpSent(true);
    setResendTimer(30);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

  } catch (err) {
    toast.error(t("Failed to send OTP", "فشل إرسال رمز التحقق"));
  } finally {
    setOtpLoading(false);
  }
};


  /* ==========================================================
     Verify OTP + Create Order
  ========================================================== */
  const handleVerifyOTP = async () => {
    const { email, phone } = shippingInfo;

    if (!otp) {
      setOtpError(t("Please enter the OTP", "يرجى إدخال رمز التحقق"));
      return;
    }

    setOtpLoading(true);

    try {
      await verifyOTPAsync({
        otpMethod,
        email,
        phone, // raw digits only
        otp,
      });

      const createdOrder = await createOrder(buildOrderData());

      toast.success(t("Order placed successfully!", "تم تقديم الطلب بنجاح!"));
      clearCart();

      navigate(`/order-confirmation/${createdOrder._id}`, {
        state: { order: createdOrder },
      });

    } catch {
      setOtpError(t("Invalid OTP. Try again.", "رمز التحقق غير صالح."));
    } finally {
      setOtpLoading(false);
    }
  };

  /* ==========================================================
     Resend OTP
  ========================================================== */
  const handleResendOTP = async () => {
    const { email, phone } = shippingInfo;
    setOtpLoading(true);

    try {
      await resendOTPAsync({
        otpMethod,
        email,
        phone, // raw number
      });
      

    setOtpSent(true);
    setResendTimer(30);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

      toast.success(
        otpMethod === "email"
          ? t("OTP resent to your email", "تم إعادة إرسال الرمز إلى بريدك")
          : t("OTP resent to WhatsApp", "تم إعادة إرسال الرمز إلى واتساب")
      );

     

    } catch {
      toast.error(t("Failed to resend OTP", "فشل إعادة إرسال رمز التحقق"));
    } finally {
      setOtpLoading(false);
    }
  };

  /* ==========================================================
     HANDLE Place Order Button
  ========================================================== */
  const onPlaceOrderClick = async () => {
    if (otpSent) return handleVerifyOTP();

    if (!validateBaseFields()) return;

    try {
      const token = await recaptchaRef.current.executeAsync();
      setCaptchaToken(token);
      recaptchaRef.current.reset();
    } catch {
      toast.error("CAPTCHA error");
      return;
    }

    setIsOtpModalOpen(true);
  };

  /* ==========================================================
     RENDER
  ========================================================== */
  return (
    <main id="payment-page">

      {/* OTP METHOD MODAL */}
          <OtpMethodModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={shippingInfo.email}
        phone={shippingInfo.phone}
        onSelect={(method) => {
          setIsOtpModalOpen(false);
          handleSendOTP(method);   // <-- FIXED: pass method directly
        }}
      />

      {/* FORM PANEL */}
      <section className="info-form glass-panel">
        <form>

          {/* FULL NAME + EMAIL */}
          <div className="form-row">
            <div className="form-group">
              <label>{t("Full Name", "الاسم الكامل")}</label>
              <input
                value={shippingInfo.fullName}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>{t("Email", "البريد الإلكتروني")}</label>
              <input
                type="email"
                value={shippingInfo.email}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* PICKUP OPTION */}
          <div className="pickup-option">
            <label className="pickup-label">
              <input
                type="checkbox"
                checked={pickup}
                onChange={(e) => setPickup(e.target.checked)}
              />
              <span className="checkmark"></span>
              {t("Pickup from store (no delivery)", "الاستلام من المتجر (بدون توصيل)")}
            </label>
          </div>

          {/* ADDRESS */}
          <div className="form-row">

            <div className="form-group">
              <label>{t("City", "المدينة")}</label>
              <select
                disabled={pickup}
                value={shippingInfo.city}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, city: e.target.value })
                }
              >
                <option value="">{t("Select City", "اختر المدينة")}</option>
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t("Address", "العنوان")}</label>
              <input
                disabled={pickup}
                value={shippingInfo.address}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, address: e.target.value })
                }
                placeholder={t("ex. Karada", "مثل: الكرادة")}
              />
            </div>

            <div className="form-group">
              <label>{t("Nearest Landmark", "اقرب نقطة دالة")}</label>
              <input
                disabled={pickup}
                value={shippingInfo.postalCode}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, postalCode: e.target.value })
                }
                placeholder={t("Near UOT", "قرب الجامعة التكنولوجية")}
              />
            </div>

          </div>

          {/* PHONES */}
          <div className="form-row">

            {/* MAIN PHONE */}
            <div className="form-group">
              <label>{t("Phone Number", "الهاتف الرئيسي")}</label>

              <div className={`phone-input ${!phoneValid1 ? "invalid" : ""}`}>
                <span className="prefix">+964</span>
                <input
                  value={shippingInfo.phone}
                  onChange={(e) => {
                    let cleaned = e.target.value.replace(/\D/g, "");
                    if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
                    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);

                    setShippingInfo({ ...shippingInfo, phone: cleaned });
                    setPhoneValid1(cleaned.length === 10);
                    setSamePhoneError(
                      cleaned === shippingInfo.phone2 && cleaned.length > 0
                    );
                  }}
                />
              </div>

              {!phoneValid1 && (
                <small className="error-text">
                  {t("Phone must be 10 digits", "يجب أن يكون 10 أرقام")}
                </small>
              )}
            </div>

            {/* BACKUP PHONE */}
            <div className="form-group">
              <label>{t("Backup Number", "الهاتف البديل")}</label>

              <div
                className={`phone-input ${
                  !phoneValid2 || samePhoneError ? "invalid" : ""
                }`}
              >
                <span className="prefix">+964</span>
                <input
                  value={shippingInfo.phone2}
                  onChange={(e) => {
                    let cleaned = e.target.value.replace(/\D/g, "");
                    if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
                    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);

                    setShippingInfo({ ...shippingInfo, phone2: cleaned });
                    setPhoneValid2(cleaned.length === 10);
                    setSamePhoneError(
                      cleaned === shippingInfo.phone && cleaned.length > 0
                    );
                  }}
                />
              </div>

              {(!phoneValid2 || samePhoneError) && (
                <small className="error-text">
                  {samePhoneError
                    ? t("Numbers must be different", "الرقمان يجب أن يكونا مختلفين")
                    : t("Phone must be 10 digits", "يجب أن يكون 10 أرقام")}
                </small>
              )}
            </div>

          </div>

          {/* DELIVERY + PAY */}
          <div className="form-row">
            <div className="form-group">
              <label>{t("Delivery", "التوصيل")}</label>
              <input readOnly value={pickup ? t("Pickup", "استلام") : "0 IQD"} />
            </div>

            <div className="form-group">
              <label>{t("Payment Method", "طريقة الدفع")}</label>
              <input readOnly value={t("Cash on Delivery", "عند الاستلام")} />
            </div>
          </div>

          {/* CAPTCHA */}
          <ReCAPTCHA
            sitekey="6Lfk68wrAAAAAI-CXEppIpnN86Ss-wgBiBAbEdzv"
            size="invisible"
            ref={recaptchaRef}
          />

          {/* MAIN BUTTON */}
          <button
            type="button"
            className="place-order-btn"
            onClick={onPlaceOrderClick}
            disabled={otpLoading || sendingOTP || verifyingOTP}
          >
            {otpSent
              ? otpLoading
                ? t("Verifying...", "جاري التحقق...")
                : t("Verify OTP", "تحقق من الرمز")
              : otpLoading
              ? t("Sending OTP...", "جاري الإرسال...")
              : t("Place Order", "تقديم الطلب")}
          </button>

          {/* OTP PANEL */}
          {otpSent && (
            <div className="otp-container">

              <div className="otp-section">
                <label>{t("Enter OTP", "أدخل رمز التحقق")}</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder={t("Enter OTP", "أدخل الرمز")}
                  className={otpError ? "invalid" : ""}
                />
                {otpError && <small className="error-text">{otpError}</small>}
              </div>

              {/* RESEND OTP */}
              <div className="otp-actions" style={{ justifyContent: t.flexAlign }}>
                <button
                  type="button"
                  className="resend-btn"
                  disabled={otpLoading || resendingOTP || resendTimer > 0}
                  onClick={handleResendOTP}
                >
                  {resendTimer > 0
                    ? `${t("Resend in", "إعادة الإرسال خلال")} ${resendTimer}`
                    : t("Resend OTP", "إعادة إرسال الرمز")}
                </button>
              </div>

              <div className="otp-help-note">
                <p>
                  {t("If you face issues receiving the OTP,", "إذا واجهت مشكلة في استلام الرمز,")}{" "}
                  <a href="https://wa.me/9647844970384" target="_blank">
                    {t("click here", "اضغط هنا")}
                  </a>{" "}
                  {t("to contact us on WhatsApp.", "للتواصل معنا عبر واتساب.")}
                </p>
              </div>

            </div>
          )}
        </form>
      </section>

      {/* CART SUMMARY */}
      <section className="cart-summary glass-panel">
        {cartItems.length === 0 ? (
          <p>{t("Your cart is empty.", "سلة التسوق فارغة.")}</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <img src={item?.images?.[0] || "https://placehold.co/80"} />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>
                      {item.qty} × {item.finalPrice.toLocaleString()} IQD
                    </p>
                  </div>
                  <span className="cart-item-price">
                    {(item.qty * item.finalPrice).toLocaleString()} IQD
                  </span>
                </div>
              ))}
            </div>

            <div className="cart-totals">
              <h2>{t("Cart Totals", "مجموع السلة")}</h2>

              <div className="totals-row">
                <span>{t("Delivery", "التوصيل")}</span>
                <span>{pickup ? t("Pickup", "استلام") : "0 IQD"}</span>
              </div>

              <div className="totals-row">
                <span>{t("Subtotal", "المجموع")}</span>
                <span>{subtotal.toLocaleString()} IQD</span>
              </div>

              <div className="totals-row total">
                <strong>{t("Total", "الإجمالي")}</strong>
                <strong>{total.toLocaleString()} IQD</strong>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Payment;
