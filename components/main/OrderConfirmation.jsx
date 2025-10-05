// src/pages/OrderConfirmation.jsx
import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../styles/orderconfirmation.css";
import useOrderStore from "../stores/useOrderStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '../../assets/img/wafi-logo-outline.png';
import QRCode from "qrcode";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { selectedOrder, fetchOrderById, setSelectedOrder, loading } = useOrderStore();

  const initialOrder = location.state?.order;

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
        <h1>🎉 Thank you for your order!</h1>
        <p>Your order number is <strong>#{selectedOrder.orderNumber}</strong></p>

        <h2>Order Summary</h2>
        <ul className="order-items">
          {orderItems.map((item, index) => (
            <li key={index}>
              {item.quantity} x {item.name} — {item.price.toLocaleString()} IQD
            </li>
          ))}
        </ul>

        <h3>Total: {selectedOrder.totalPrice.toLocaleString()} IQD</h3>

        <h2>Shipping Info</h2>
        <p>{selectedOrder.shippingInfo.fullName}</p>
        <p>{selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}</p>
        <p>Phone: {selectedOrder.shippingInfo.phone}</p>
        <p>Email: {selectedOrder.shippingInfo.email}</p>

        <div className="confirmation-actions">
          <button onClick={handleGoHome}>Go to Home</button>
          {/**<button onClick={handleViewOrders}>View My Orders</button>**/}
          <button onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      </section>
    </main>
  );
};

export default OrderConfirmation;
