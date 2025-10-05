import { Layout, Row, Col, Typography, Space } from "antd";
import { FaFacebookF as Facebook, FaInstagram as Instagram, FaWhatsapp as Whatsapp } from "react-icons/fa";
import '../../styles/appfooter.css';
const { Footer } = Layout;
const { Title, Text, Link } = Typography;


const LogoTitle = () => {


  return (
    <Space align="center" size={10} style={{ display: "flex", flexDirection: "row" }}>
      {/* Logo as a div */}
      <div className="logo-div"/> <span style={{color: "var(--text)"}}>|</span>
      <Title level={4} style={{ color: "var(--text)", margin: 0, marginLeft: "6px" }}>
        AL-WAFI
      </Title>
    </Space>
  );
};

const AppFooter = () => {
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
            <Title level={5} style={{ color: "var(--text)", marginBottom: 10 }}>
              Quick Links
            </Title>
            <Link href="/" style={{ color: "var(--text)" }}>Home</Link>
            <Link href="/about" style={{ color: "var(--text)" }}>About Us</Link>
            <Link href="/services" style={{ color: "var(--text)" }}>Services</Link>
            <Link href="/faq" style={{ color: "var(--text)" }}>FAQ</Link>
          </Space>
        </Col>

        {/* Contact Info */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size={10}>
            <Title level={5} style={{ color: "var(--text)", marginBottom: 10 }}>
              Contact Info
            </Title>
            <Text style={{ color: "var(--text)" }}>Al Senaha St. - Baghdad - Iraq</Text>
            <Link href="mailto:support@alwafi.net" style={{ color: "var(--text)" }}>support@alwafi.net</Link>
            <Link href="tel:+9647844970384" style={{ color: "var(--text)" }}>+964 784 497 0384</Link>
          </Space>
        </Col>

        {/* Social Media */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size={15}>
            <Title level={5} style={{ color: "var(--text)", marginBottom: 10 }}>
              Get In Touch
            </Title>
            <Space size="middle">
              <Link href="https://www.facebook.com/alwafi.co1" target="_blank" rel="noopener noreferrer">
                <Facebook size={25} color="var(--text)" />
              </Link>
              <Link href="https://www.instagram.com/alwafi.co1/" target="_blank" rel="noopener noreferrer">
                <Instagram size={25} color="var(--text)" />
              </Link>
              <Link href="https://wa.me/9647844970384" target="_blank" rel="noopener noreferrer">
                <Whatsapp size={25} color="var(--text)" />
              </Link>
            </Space>
            <Text style={{ color: "var(--text)", marginTop: 20, display: "block" }}>
              © 2025 AL-WAFI. All rights reserved.
            </Text>
          </Space>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;
