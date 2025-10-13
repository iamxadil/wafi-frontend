import React, { useState } from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import { FaFacebookF as Facebook, FaInstagram as Instagram, FaWhatsapp as Whatsapp } from "react-icons/fa";
import ReModal from "../main/ReModal.jsx"; // your reusable modal
import "../../styles/appfooter.css";

const { Footer } = Layout;
const { Title, Text } = Typography;

const LogoTitle = () => (
  <Space align="center" size={10} style={{ display: "flex", flexDirection: "row" }}>
    <div className="logo-div" />
    <span style={{ color: "var(--text)" }}>|</span>
    <Title level={4} style={{ color: "var(--text)", margin: 0, marginLeft: "6px" }}>
      AL-WAFI
    </Title>
  </Space>
);


// Example content for ReModal

export const ABOUT_US_CONTENT = {
  title: "About Us",
  paragraphs: [
    {
      heading: "Our Story",
      text: `Founded in 1993, AL-WAFI began as a small vision to deliver innovative and elegant tech solutions to a growing digital world. 
      Over the decades, we have evolved with technology, adapting to every new challenge while staying true to our core values: quality, integrity, and creativity.`
    },
    {
      heading: "Our Mission",
      text: `We aim to empower businesses and individuals through reliable and cutting-edge technology. 
      Our mission is to make digital experiences seamless, intuitive, and meaningful, bridging the gap between innovation and accessibility.`
    },
    {
      heading: "Our Vision",
      text: `To become a recognized leader in providing elegant, high-quality tech solutions that transform how people interact with technology. 
      We aspire to set the standard in every sector we touch, combining design, efficiency, and reliability.`
    },
    {
      heading: "Our Values",
      text: `Innovation, commitment, and trust are the pillars of AL-WAFI. 
      Every solution we deliver reflects our dedication to excellence and our promise to our customers.`
    },
  ]
};

export const SERVICES_CONTENT = {
  title: "Our Services",
  paragraphs: [
    {
      heading: "Laptops Store",
      text: `We offer a wide range of laptops for personal, professional, and gaming needs. 
      Each device is carefully selected to ensure quality, performance, and style, catering to beginners and tech enthusiasts alike.`
    },
    {
      heading: "Computer Components",
      text: `From high-performance CPUs to graphics cards, motherboards, and memory, we provide all the components needed to build, upgrade, or repair your PC. 
      Our selection ensures compatibility, reliability, and future-proofing for your setups.`
    },
    {
      heading: "Networking & Support",
      text: `We provide comprehensive networking solutions, including routers, switches, cabling, and wireless setups, 
      along with expert support to ensure your systems run smoothly. Our team assists with troubleshooting, setup, and optimization for both home and business environments.`
    }
  ]
};

export const FAQ_CONTENT = {
  title: "Frequently Asked Questions",
  items: [
    {
      question: "What is AL-WAFI?",
      answer: `AL-WAFI is a technology solutions company established in 1993, specializing in laptops, computer components, networking equipment, and expert tech support.`
    },
    {
      question: "Do you provide warranties on products?",
      answer: `Yes! All products come with manufacturer warranties, and we also offer our own support and service guarantees to ensure satisfaction.`
    },
    {
      question: "Can I request a custom PC build?",
      answer: `Absolutely. We help customers design and assemble custom PCs tailored to their specific performance, aesthetic, and budget requirements.`
    },
    {
      question: "How do I contact support?",
      answer: `You can reach our support team via email, phone, or live chat on our website. Our experts are ready to assist with any technical questions or service requests.`
    },
    {
      question: "Do you offer business solutions?",
      answer: `Yes, we provide comprehensive solutions for businesses including bulk device procurement, networking setup, system optimization, and ongoing support services.`
    },
  ]
};


const AppFooter = () => {
  const [modalType, setModalType] = useState(null); // 'about', 'services', 'faq'
  
  return (
    <Footer
      style={{
        background: "none",
        color: "var(--text)",
        padding: "0px 50px",
        paddingTop: "100px",
        paddingBottom: "40px",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <Row gutter={[40, 40]} justify="space-between">
        {/* Logo & About */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size={15}>
            <LogoTitle />
            <Text style={{ color: "var(--text)" }}>
              Elegant solutions for modern businesses. Our mission is to create meaningful experiences and beautiful digital products.
            </Text>
          </Space>
        </Col>

        {/* Quick Links */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size={10}>
            <Title level={5} style={{ color: "var(--text)", marginBottom: 10 }}>Quick Links</Title>
            <Text
              style={{ color: "var(--text)", cursor: "pointer" }}
              onClick={() => setModalType("home")}
            >
              Home
            </Text>
            <Text
              style={{ color: "var(--text)", cursor: "pointer" }}
              onClick={() => setModalType("about")}
            >
              About Us
            </Text>
            <Text
              style={{ color: "var(--text)", cursor: "pointer" }}
              onClick={() => setModalType("services")}
            >
              Services
            </Text>
            <Text
              style={{ color: "var(--text)", cursor: "pointer" }}
              onClick={() => setModalType("faq")}
            >
              FAQ
            </Text>
          </Space>
        </Col>

        {/* Contact Info */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size={10}>
            <Title level={5} style={{ color: "var(--text)", marginBottom: 10 }}>Contact Info</Title>
            <Text style={{ color: "var(--text)" }}>Al Senaha St. - Baghdad - Iraq</Text>
            <Text style={{ color: "var(--text)" }}>support@alwafi.net</Text>
            <Text style={{ color: "var(--text)" }}>+964 784 497 0384</Text>
          </Space>
        </Col>

        {/* Social Media */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size={15}>
            <Title level={5} style={{ color: "var(--text)", marginBottom: 10 }}>Get In Touch</Title>
            <Space size="middle">
              <a href="https://www.facebook.com/alwafi.co1" target="_blank" rel="noopener noreferrer">
                <Facebook size={25} color="var(--text)" />
              </a>
              <a href="https://www.instagram.com/alwafi.co1/" target="_blank" rel="noopener noreferrer">
                <Instagram size={25} color="var(--text)" />
              </a>
              <a href="https://wa.me/9647844970384" target="_blank" rel="noopener noreferrer">
                <Whatsapp size={25} color="var(--text)" />
              </a>
            </Space>
            <Text style={{ color: "var(--text)", marginTop: 20, display: "block" }}>
              © 2025 AL-WAFI. All rights reserved.
            </Text>
          </Space>
        </Col>
      </Row>

      {/* Modals */}
     <ReModal
            isOpen={modalType === "about"}
            onClose={() => setModalType(null)}
            title={ABOUT_US_CONTENT.title}
          >
            {ABOUT_US_CONTENT.paragraphs.map((p, i) => (
              <div key={i} style={{ marginBottom: "1rem" }}>
                {p.heading && <h3 style={{ color: "#6ee7b7", marginBottom: "0.5rem" }}>{p.heading}</h3>}
                <p style={{ lineHeight: 1.6 }}>{p.text}</p>
              </div>
            ))}
          </ReModal>

          <ReModal
            isOpen={modalType === "services"}
            onClose={() => setModalType(null)}
            title={SERVICES_CONTENT.title}
          >
            {SERVICES_CONTENT.paragraphs.map((p, i) => (
              <div key={i} style={{ marginBottom: "1rem" }}>
                {p.heading && <h3 style={{ color: "#6ee7b7", marginBottom: "0.5rem" }}>{p.heading}</h3>}
                <p style={{ lineHeight: 1.6 }}>{p.text}</p>
              </div>
            ))}
          </ReModal>

          <ReModal
            isOpen={modalType === "faq"}
            onClose={() => setModalType(null)}
            title={FAQ_CONTENT.title}
          >
            {FAQ_CONTENT.items.map((item, i) => (
              <div key={i} style={{ marginBottom: "1rem" }}>
                <h3 style={{ color: "#6ee7b7", marginBottom: "0.3rem" }}>{item.question}</h3>
                <p style={{ lineHeight: 1.6 }}>{item.answer}</p>
              </div>
            ))}
          </ReModal>
    </Footer>
  );
};

export default AppFooter;
