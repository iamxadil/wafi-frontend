import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ===========================================================
   Utils
=========================================================== */
const normalizePhone = (phone) =>
  phone?.replace(/\D/g, "").replace(/^0/, "");

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "";


/* ===========================================================
   API Calls
=========================================================== */
const sendOtpFn = async ({ otpMethod, email, phone }) => {
  const payload = {
    otpMethod,
    email,
    phone:
      otpMethod === "whatsapp" || otpMethod === "telegram"
        ? normalizePhone(phone)
        : phone,
  };

  const { data } = await axios.post(
    `${API_URL}/api/orders/send-otp`,
    payload
  );

  return data;
};

const verifyOtpFn = async ({ otpMethod, email, phone, otp }) => {
  const payload = {
    otpMethod,
    email,
    otp,
    phone:
      otpMethod === "whatsapp" || otpMethod === "telegram"
        ? normalizePhone(phone)
        : phone,
  };

  const { data } = await axios.post(
    `${API_URL}/api/orders/verify-otp`,
    payload
  );

  return data;
};

const resendOtpFn = async ({ otpMethod, email, phone }) => {
  const payload = {
    otpMethod,
    email,
    phone:
      otpMethod === "whatsapp" || otpMethod === "telegram"
        ? normalizePhone(phone)
        : phone,
  };

  const { data } = await axios.post(
    `${API_URL}/api/orders/resend-otp`,
    payload
  );

  return data;
};

/* ===========================================================
   🧩 Custom Hook
=========================================================== */
export function useOtpQuery() {
  const sendOTPMutation = useMutation({
    mutationFn: sendOtpFn,
  });

  const verifyOTPMutation = useMutation({
    mutationFn: verifyOtpFn,
  });

  const resendOTPMutation = useMutation({
    mutationFn: resendOtpFn,
  });

  return {
    /* ---------------- Send OTP ---------------- */
    sendOTP: sendOTPMutation.mutate,
    sendOTPAsync: sendOTPMutation.mutateAsync,
    sendingOTP: sendOTPMutation.isPending,
    sendOTPSuccess: sendOTPMutation.isSuccess,
    sendOTPError: getErrorMessage(sendOTPMutation.error),

    /* ---------------- Verify OTP ---------------- */
    verifyOTP: verifyOTPMutation.mutate,
    verifyOTPAsync: verifyOTPMutation.mutateAsync,
    verifyingOTP: verifyOTPMutation.isPending,
    verifyOTPSuccess: verifyOTPMutation.isSuccess,
    verifyOTPError: getErrorMessage(verifyOTPMutation.error),

    /* ---------------- Resend OTP ---------------- */
    resendOTP: resendOTPMutation.mutate,
    resendOTPAsync: resendOTPMutation.mutateAsync,
    resendingOTP: resendOTPMutation.isPending,
    resendOTPSuccess: resendOTPMutation.isSuccess,
    resendOTPError: getErrorMessage(resendOTPMutation.error),
  };
}
