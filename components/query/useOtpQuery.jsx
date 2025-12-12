import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ===========================================================
   🟢 Send OTP (Email OR WhatsApp)
=========================================================== */
const sendOtpFn = async ({ otpMethod, email, phone }) => {
  const { data } = await axios.post(`${API_URL}/api/orders/send-otp`, {
    otpMethod,
    email,
    phone,
  });
  return data;
};

/* ===========================================================
   🔍 Verify OTP
=========================================================== */
const verifyOtpFn = async ({ otpMethod, email, phone, otp }) => {
  const { data } = await axios.post(`${API_URL}/api/orders/verify-otp`, {
    otpMethod,
    email,
    phone,
    otp,
  });
  return data;
};

/* ===========================================================
   🔁 Resend OTP
=========================================================== */
const resendOtpFn = async ({ otpMethod, email, phone }) => {
  const { data } = await axios.post(`${API_URL}/api/orders/resend-otp`, {
    otpMethod,
    email,
    phone,
  });
  return data;
};


/* ===========================================================
   🧩 Custom Hook
=========================================================== */
export function useOtpQuery() {

  // 1️⃣ Send OTP mutation
  const sendOTPMutation = useMutation({
    mutationFn: sendOtpFn,
  });

  // 2️⃣ Verify OTP mutation
  const verifyOTPMutation = useMutation({
    mutationFn: verifyOtpFn,
  });

  // 3️⃣ Resend OTP mutation
  const resendOTPMutation = useMutation({
    mutationFn: resendOtpFn,
  });

  return {
    // 🔹 Send OTP
    sendOTP: sendOTPMutation.mutate,
    sendOTPAsync: sendOTPMutation.mutateAsync,
    sendingOTP: sendOTPMutation.isPending,
    sendOTPError: sendOTPMutation.error,

    // 🔹 Verify OTP
    verifyOTP: verifyOTPMutation.mutate,
    verifyOTPAsync: verifyOTPMutation.mutateAsync,
    verifyingOTP: verifyOTPMutation.isPending,
    verifyOTPError: verifyOTPMutation.error,

    // 🔹 Resend OTP
    resendOTP: resendOTPMutation.mutate,
    resendOTPAsync: resendOTPMutation.mutateAsync,
    resendingOTP: resendOTPMutation.isPending,
    resendOTPError: resendOTPMutation.error,
  };
}
