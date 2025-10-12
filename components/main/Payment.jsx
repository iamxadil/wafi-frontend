import React, { useState, useRef } from "react";
import "../../styles/payment.css";
import useCartStore from "../stores/useCartStore.jsx";
import useOrderStore from "../stores/useOrderStore.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const Payment = () => {
  const navigate = useNavigate();

  // Cart
  const cartItems = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const delivery = 0;

  // Use finalPrice for subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.finalPrice) * item.qty,
    0
  );
  const total = subtotal + delivery;

  const cities = ["Al-Anbar", 
    "Erbil", "Babil", 
    "Baghdad", "Basra",
    "Dhi-Qar", "Duhok",
    "Diyala", "Halabja",
    "Karbala", "Kirkuk",
    "Muthanna", "Maysan",
    "Nineveh", "Najaf", "Qadisya", "Salahu-Din", "Sulaymaniyah", "Wasit"];

  const [phoneValid, setPhoneValid] = useState(true);

  // Form
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  // Loading / OTP
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState(""); // initially no error

  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");

  // Store actions
  const sendOrderOTP = useOrderStore((state) => state.sendOrderOTP);
  const verifyOrderOTP = useOrderStore((state) => state.verifyOrderOTP);
  const createOrder = useOrderStore((state) => state.createOrder);

  // -----------------------------
  // Step 1: Send OTP
  // -----------------------------
  const handleSendOTP = async () => {
    const { email, fullName, address, city, postalCode, phone } = shippingInfo;

    // Validate all fields
    if (!email || !fullName || !address || !city || !postalCode || !phone) {
      toast.warning("Please fill in all fields");
      return;
    }

    // Email / phone validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone must be 10 digits");
      return;
    }

    // Execute reCAPTCHA
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
      await sendOrderOTP(email); // only email now
      toast.success("OTP sent to your email!");
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // -----------------------------
  // Step 2: Verify OTP & Place Order
  // -----------------------------
  const handleVerifyOTP = async () => {
    const { email, fullName, address, city, postalCode, phone } = shippingInfo;

    if (!otp) {
      setOtpError("Please enter the OTP");
      toast.warning("Please enter the OTP");
      return;
    } else {
      setOtpError(""); // clear error if input is fine
    }

    setOtpLoading(true);

    try {
      // 1️⃣ Verify OTP
      await verifyOrderOTP(email, otp);
      setOtpError("");

      // 2️⃣ Create order
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.qty,
          price: item.finalPrice || item.price,
        })),
        shippingInfo: { fullName, address, city, postalCode, phone: `+964${phone}`, email },
        itemsPrice: subtotal,
        shippingPrice: delivery,
        totalPrice: total,
        paymentMethod: "Cash",
        captchaToken,
      };

      const createdOrder = await createOrder(orderData);
      toast.success("Order placed successfully!");
      clearCart();
      setCaptchaToken("");
      navigate(`/order-confirmation/${createdOrder._id}`, { state: { order: createdOrder } });
    } catch (err) {
      setOtpError("Invalid OTP. Try again.");
      toast.error(err.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <main id="payment-page">
      <section className="info-form">
        <form>
          {/* Shipping Info */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={shippingInfo.fullName}
                onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={shippingInfo.email}
                onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <select
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                value={shippingInfo.postalCode}
                onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
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
                }}
              />
            </div>
            {!phoneValid && <small className="error-text">Phone number must be 10 digits</small>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Delivery</label>
              <input type="text" value={`${delivery.toLocaleString()} IQD`} readOnly />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <input type="text" value="Cash" readOnly />
            </div>
          </div>

          <ReCAPTCHA
            sitekey="6Lfk68wrAAAAAI-CXEppIpnN86Ss-wgBiBAbEdzv"
            size="invisible"
            ref={recaptchaRef}
          />

          <button
            type="button"
            className="place-order-btn"
            onClick={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={loading || otpLoading}
          >
            {otpSent ? (otpLoading ? "Verifying..." : "Verify OTP") : loading || otpLoading ? "Sending OTP..." : "Place Order"}
          </button>

          {otpSent && (
            <div className="otp-section">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
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
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => {
                const priceToShow = item.finalPrice || item.price;
                return (
                  <div key={item._id} className="cart-item">
                    <img src={item?.images?.[0] || "https://placehold.co/80"} alt={item.name} />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p>
                        {item.qty} x {priceToShow.toLocaleString()} IQD
                      </p>
                    </div>
                    <span className="cart-item-price">{(priceToShow * item.qty).toLocaleString()} IQD</span>
                  </div>
                );
              })}
            </div>

            <div className="cart-totals">
              <h2>Cart Totals</h2>
              <div className="totals-row">
                <span>Delivery</span>
                <span>{delivery.toLocaleString()} IQD</span>
              </div>
              <div className="totals-row">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} IQD</span>
              </div>
              <div className="totals-row total">
                <strong>Total</strong>
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
