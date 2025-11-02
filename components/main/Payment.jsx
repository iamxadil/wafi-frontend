import React, { useState, useRef } from "react";
import "../../styles/payment.css";
import useCartStore from "../stores/useCartStore.jsx";
import useOrderStore from "../stores/useOrderStore.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import useTranslate from "../hooks/useTranslate.jsx";

const Payment = () => {
  const navigate = useNavigate();
  const t = useTranslate();

  // Cart
  const cartItems = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const delivery = 0;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.finalPrice * item.qty,
    0
  );
  const total = subtotal + delivery;

  const cities = [
    "Al-Anbar", "Erbil", "Babil", "Baghdad", "Basra", "Dhi-Qar", "Duhok",
    "Diyala", "Halabja", "Karbala", "Kirkuk", "Muthanna", "Maysan",
    "Nineveh", "Najaf", "Qadisya", "Salahu-Din", "Sulaymaniyah", "Wasit"
  ];

  const [pickup, setPickup] = useState(false); // ✅ Pickup state
  const [phoneValid, setPhoneValid] = useState(true);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    phone2: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [samePhoneError, setSamePhoneError] = useState(false);

  const sendOrderOTP = useOrderStore((state) => state.sendOrderOTP);
  const verifyOrderOTP = useOrderStore((state) => state.verifyOrderOTP);
  const createOrder = useOrderStore((state) => state.createOrder);

  /* ==========================================================
     📨 Send OTP
  ========================================================== */
  const handleSendOTP = async () => {
    const { email, fullName, address, city, postalCode, phone, phone2 } = shippingInfo;

    if (!email || !fullName || (!pickup && (!address || !city || !postalCode)) || !phone || !phone2) {
      toast.warning(t("Please fill in all required fields", "يرجى ملء جميع الحقول المطلوبة"));
      return;
    }

    if (shippingInfo.phone && shippingInfo.phone === shippingInfo.phone2) {
      toast.error(t("Primary and backup numbers must be different", "يجب أن يكون رقم الهاتفين مختلفين"));
      setSamePhoneError(true);
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("Invalid email address", "عنوان البريد الإلكتروني غير صالح"));
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error(t("Phone must be 10 digits", "يجب أن يتكون رقم الهاتف من 10 أرقام"));
      return;
    }

    try {
      const token = await recaptchaRef.current.executeAsync();
      if (!token) throw new Error("Captcha token missing");
      recaptchaRef.current.reset();
      setCaptchaToken(token);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Captcha failed");
      return;
    }

    setOtpLoading(true);
    try {
      await sendOrderOTP(email);
      toast.success(t("OTP sent to your email!", "تم إرسال رمز التحقق إلى بريدك الإلكتروني!"));
      setOtpSent(true);
    } catch (err) {
      toast.error(t("Failed to send OTP", "فشل في إرسال رمز التحقق"));
    } finally {
      setOtpLoading(false);
    }
  };

  /* ==========================================================
     🔐 Verify OTP & Create Order
  ========================================================== */
  const handleVerifyOTP = async () => {
    const { email, fullName, address, city, postalCode, phone, phone2 } = shippingInfo;

    if (!otp) {
      setOtpError(t("Please enter the OTP", "يرجى إدخال رمز التحقق"));
      toast.warning(t("Please enter the OTP", "يرجى إدخال رمز التحقق"));
      return;
    } else setOtpError("");

   if (shippingInfo.phone && shippingInfo.phone === shippingInfo.phone2) {
      toast.error(t("Primary and backup numbers must be different", "يجب أن يكون رقم الهاتفين مختلفين"));
      setSamePhoneError(true);
      return;
    }
    
    setOtpLoading(true);
    try {
      await verifyOrderOTP(email, otp);
      setOtpError("");

      const orderData = {
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
        pickup, // ✅ send pickup flag
        captchaToken,
      };

      const createdOrder = await createOrder(orderData);
      toast.success(t("Order placed successfully!", "تم تقديم الطلب بنجاح!"));
      clearCart();
      navigate(`/order-confirmation/${createdOrder._id}`, { state: { order: createdOrder } });
    } catch (err) {
      setOtpError(t("Invalid OTP. Try again.", "رمز التحقق غير صالح، حاول مرة أخرى."));
      toast.error(t("Invalid OTP. Try again.", "رمز التحقق غير صالح، حاول مرة أخرى."));
    } finally {
      setOtpLoading(false);
    }
  };

  /* ==========================================================
     RENDER
  ========================================================== */
  return (
    <main id="payment-page">
      {/* Form Section */}
      <section className="info-form">
        <form>
          {/* Basic Info */}
          <div className="form-row">
            <div className="form-group">
              <label>{t("Full Name", "الاسم الكامل")}</label>
              <input
                type="text"
                value={shippingInfo.fullName}
                onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{t("Email", "البريد الإلكتروني")}</label>
              <input
                type="email"
                value={shippingInfo.email}
                onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
              />
            </div>
          </div>

          {/* Pickup Option */}
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

          {/* Address Section (disabled if pickup) */}
          <div className="form-row">
            <div className="form-group">
              <label>{t("City", "المدينة")}</label>
              <select
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                disabled={pickup}
              >
                <option value="">{t("Select City", "اختر المدينة")}</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t("Address", "العنوان")}</label>
              <input
                type="text"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                placeholder={t("ex. Karada", "مثل: الكرادة")}
                disabled={pickup}
              />
            </div>

            <div className="form-group">
              <label>{t("Nearest Landmark", "اقرب نقطة دالة")}</label>
              <input
                type="text"
                value={shippingInfo.postalCode}
                onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                placeholder={t("ex. Near University of Technology", "مثل: قرب الجامعة التكنولوجية")}
                disabled={pickup}
              />
            </div>
          </div>

          {/* Phones */}
          <div className="form-row">
              {/* Primary phone */}
              <div className="form-group">
                <label>{t("Phone Number", "الهاتف الرئيسي")}</label>
                <div className={`phone-input ${!phoneValid ? "invalid" : ""}`}>
                  <span className="prefix">+964</span>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => {
                      let cleaned = e.target.value.replace(/\D/g, "");
                      if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);
                      setShippingInfo({ ...shippingInfo, phone: cleaned });
                      setPhoneValid(cleaned.length === 10);
                      setSamePhoneError(cleaned === shippingInfo.phone2 && cleaned.length > 0);
                    }}
                    required
                  />
                </div>
                {!phoneValid && (
                  <small className="error-text">
                    {t("Phone number must be 10 digits", "يجب أن يتكون رقم الهاتف من 10 أرقام")}
                  </small>
                )}
              </div>

              {/* Alternate phone */}
              <div className="form-group">
                <label>{t("Backup Number", "الهاتف البديل")}</label>
                <div className={`phone-input ${samePhoneError ? "invalid" : ""}`}>
                  <span className="prefix">+964</span>
                  <input
                    type="tel"
                    value={shippingInfo.phone2}
                    onChange={(e) => {
                      let cleaned = e.target.value.replace(/\D/g, "");
                      if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);
                      setShippingInfo({ ...shippingInfo, phone2: cleaned });
                      setSamePhoneError(cleaned === shippingInfo.phone && cleaned.length > 0);
                    }}
                    required
                  />
                </div>
                {samePhoneError && (
                  <small className="error-text">
                    {t("Primary and backup numbers must be different", "يجب أن يكون رقم الهاتفين مختلفين")}
                  </small>
                )}
              </div>
            </div>

          {/* Delivery & Payment */}
          <div className="form-row">
            <div className="form-group">
              <label>{t("Delivery", "التوصيل")}</label>
              <input type="text" value={pickup ? t("Pickup", "استلام ذاتي") : `${delivery.toLocaleString()} IQD`} readOnly />
            </div>
            <div className="form-group">
              <label>{t("Payment Method", "طريقة الدفع")}</label>
              <input type="text" value={t("Cash on Delivery", "الدفع عند الاستلام")} readOnly />
            </div>
          </div>

          <ReCAPTCHA
            sitekey="6Lfk68wrAAAAAI-CXEppIpnN86Ss-wgBiBAbEdzv"
            size="invisible"
            ref={recaptchaRef}
          />

          {/* OTP Button */}
          <button
            type="button"
            className="place-order-btn"
            onClick={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={loading || otpLoading}
          >
            {otpSent
              ? otpLoading
                ? t("Verifying...", "جاري التحقق...")
                : t("Verify OTP", "تحقق من الرمز")
              : loading || otpLoading
              ? t("Sending OTP...", "جاري إرسال الرمز...")
              : t("Place Order", "تقديم الطلب")}
          </button>

          {otpSent && (
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
          )}
        </form>
      </section>

      {/* Cart Summary */}
      <section className="cart-summary">
        {cartItems.length === 0 ? (
          <p>{t("Your cart is empty.", "سلة التسوق فارغة.")}</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => {
                const priceToShow = item.finalPrice || item.price;
                return (
                  <div key={item._id} className="cart-item">
                    <img
                      src={item?.images?.[0] || "https://placehold.co/80"}
                      alt={item.name}
                    />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p>
                        {item.qty} × {priceToShow.toLocaleString()} IQD
                      </p>
                    </div>
                    <span className="cart-item-price">
                      {(priceToShow * item.qty).toLocaleString()} IQD
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="cart-totals">
              <h2 style={{ display: "flex" }}>{t("Cart Totals", "مجموع السلة")}</h2>
              <div className="totals-row">
                <span>{t("Delivery", "التوصيل")}</span>
                <span>{pickup ? t("Pickup", "استلام ذاتي") : `${delivery.toLocaleString()} IQD`}</span>
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
