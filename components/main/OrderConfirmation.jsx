// src/pages/OrderConfirmation.jsx
import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../styles/orderconfirmation.css";
import useOrderStore from "../stores/useOrderStore";
import useAuthStore from "../stores/useAuthStore";
import useTranslate from "../hooks/useTranslate";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '../../assets/img/wafi-logo-outline.png';
import QRCode from "qrcode";
import { AlertTriangle, PackageSearch } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { selectedOrder, fetchOrderById, setSelectedOrder, loading } = useOrderStore();
  const initialOrder = location.state?.order;
  const { user } = useAuthStore();
  const t = useTranslate();

  useEffect(() => {
    if (initialOrder) {
      setSelectedOrder(initialOrder);
    } else if (id) {
      fetchOrderById(id).catch(() => navigate("/"));
    } else {
      navigate("/");
    }
  }, [id, initialOrder]);

  if (loading) return <p>Loading order...</p>;
  if (!selectedOrder) return <p>Order not found. Redirecting...</p>;

  const orderItems = selectedOrder.items || [];

  const handleGoHome = () => navigate("/");
  const handleViewOrders = () => navigate("/my-orders");

  const handleDownloadPDF = async () => {
    if (!selectedOrder) return;

    const doc = new jsPDF("p", "pt", "a4");
    const margin = 40;

    const img = new Image();
    img.src = logo;
    img.onload = async () => {
      const logoWidth = 100;
      const logoHeight = (img.height / img.width) * logoWidth;
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoX = (pageWidth - logoWidth) / 2;
      const logoY = 20;
      doc.addImage(img, "PNG", logoX, logoY, logoWidth, logoHeight);

      doc.setFontSize(22);
      doc.setTextColor("#4CAF50");
      doc.text("Order Invoice", pageWidth / 2, logoY + logoHeight + 30, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor("#000");
      doc.text(`Order #: ${selectedOrder.orderNumber}`, margin, logoY + logoHeight + 60);
      doc.text(`Date: ${new Date(selectedOrder.createdAt).toLocaleDateString()}`, margin, logoY + logoHeight + 75);
      doc.text(`Payment: ${selectedOrder.paymentMethod}`, margin, logoY + logoHeight + 90);

      const shippingY = logoY + logoHeight + 110;
      doc.setDrawColor(200);
      doc.setFillColor(245);
      doc.rect(margin, shippingY, pageWidth - margin * 2, 60, "FD");

      const { fullName, address, city, postalCode, phone, email } = selectedOrder.shippingInfo;
      doc.setTextColor("#333");
      doc.text("Shipping Info:", margin + 5, shippingY + 15);
      doc.text(`${fullName}`, margin + 5, shippingY + 30);
      doc.text(`${address}, ${city} ${postalCode || ""}`, margin + 5, shippingY + 45);
      doc.text(`Phone: ${phone}`, pageWidth / 2 + 10, shippingY + 30);
      doc.text(`Email: ${email}`, pageWidth / 2 + 10, shippingY + 45);

      const tableColumn = ["Product", "Qty", "Price"];
      const tableRows = orderItems.map(item => [
        item.name,
        item.quantity.toString(),
        item.price.toLocaleString() + " IQD"
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: shippingY + 80,
        theme: "striped",
        headStyles: { fillColor: "#4CAF50", textColor: "#fff", fontSize: 12 },
        bodyStyles: { fontSize: 12 },
        columnStyles: { 1: { halign: "center" }, 2: { halign: "right" } },
      });

      const finalY = doc.lastAutoTable.finalY || shippingY + 80;

      doc.setFontSize(14);
      doc.setTextColor("#4CAF50");
      doc.text(`Total: ${selectedOrder.totalPrice.toLocaleString()} IQD`, margin, finalY + 25);

      const qrData = `Order #${selectedOrder.orderNumber} - Alwafi`;
      const qrUrl = await QRCode.toDataURL(qrData);
      doc.addImage(qrUrl, "PNG", pageWidth - 120, finalY + 10, 80, 80);

      doc.setFontSize(10);
      doc.setTextColor("#999");
      doc.text("Authorized Signature", pageWidth - 90, finalY + 100, { align: "center" });

      doc.text("Thank you for shopping with Alwafi company!", margin, finalY + 140);
      doc.text(`© ${new Date().getFullYear()} All rights reserved.`, margin, finalY + 155);

      doc.save(`order-${selectedOrder._id}.pdf`);
    };
  };

  return (
  <main className="order-confirmation-page">
    <section className="confirmation-card">

      <h1>
        🎉 {t("Thank you for your order!", "شكراً لطلبك!")}
      </h1>

      <p>
        {t("Your order number is", "رقم طلبك هو")} 
        <strong> #{selectedOrder.orderNumber}</strong>
      </p>

      {/* ✅ Show order ID */}
      <p style={{ opacity: 0.7 }}>
        ID: <strong>{selectedOrder._id}</strong>
      </p>

      <h2>{t("Order Summary", "ملخص الطلب")}</h2>
      <ul className="order-items">
        {orderItems.map((item, index) => (
          <li key={index}>
            {item.quantity} × {item.name} — {item.price.toLocaleString()} IQD
          </li>
        ))}
      </ul>

      <h3>
        {t("Total", "المجموع")}: {selectedOrder.totalPrice.toLocaleString()} IQD
      </h3>

      <h2>{t("Shipping Info", "معلومات الشحن")}</h2>
      <p>{selectedOrder.shippingInfo.fullName}</p>
      <p>{selectedOrder.shippingInfo.address}, {selectedOrder?.shippingInfo?.city === "N/A" ? "Alwafi" : selectedOrder.shippingInfo.city}</p>
      <p>{t("Phone", "الهاتف")}: {selectedOrder.shippingInfo.phone}</p>
      <p>{t("Email", "البريد الإلكتروني")}: {selectedOrder.shippingInfo.email}</p>

      {/* 🚨 If user NOT signed in */}
      {/* ================================ */}
  {/* 🚨 If user NOT signed in — Show instructions */}
{!user && (
  <div className="signin-instructions">

    <h3 className="instruction-title">
      {t("How to access your order?", "كيفية الوصول إلى طلبك؟")}
    </h3>

    <ol className="instruction-list">
      <li>
        <strong>{t("Step 1:", "الخطوة ١:")}</strong>  
        {t("Sign in to your account.", "قم بتسجيل الدخول إلى حسابك.")}
        <button className="instruction-btn" onClick={() => navigate("/signin")}>
          {t("Sign In", "تسجيل الدخول")}
        </button>
      </li>

      <li>
        <strong>{t("Step 2:", "الخطوة ٢:")}</strong>  
        {t("Copy your Order ID:", "انسخ معرّف الطلب:")}  
        <code className="order-id-box">{selectedOrder._id}</code>
      </li>

      <li>
        <strong>{t("Step 3:", "الخطوة ٣:")}</strong>  
        {t("Go to the My Orders page:", "اذهب إلى صفحة الطلبات:")}
        <button className="instruction-btn" onClick={() => navigate("/my-orders")}>
          {t("My Orders", "صفحة الطلبات")}
        </button>
      </li>

      <li>
        <strong>{t("Step 4:", "الخطوة ٤:")}</strong>  
        {t(
          "Paste the Order ID to attach your order to your account.",
          "قم بلصق معرّف الطلب لربط الطلب بحسابك."
        )}
      </li>
    </ol>

    <p className="instruction-note">
      {t(
        "This helps you track your order, download invoices, and receive updates.",
        "يساعدك هذا في متابعة طلبك، وتحميل الفواتير، واستلام التحديثات."
      )}
    </p>

  </div>
)}



      {/* ================================ */}
      {/* ✔ If user logged in */}
      {/* ================================ */}
        {user && (
            <button className="view-orders-btn" onClick={handleViewOrders}>
              <span className="orders-icon"><PackageSearch size={20} /></span>
              {t("View My Orders", "متابعة الطلبات")}
            </button>
          )}


      <div className="confirmation-actions">
        <button onClick={handleGoHome}>
          {t("Go to Home", "الصفحة الرئيسية")}
        </button>
      </div>
    </section>
  </main>
);

};

export default OrderConfirmation;
