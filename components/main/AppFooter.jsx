import React, { useState } from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import { FaFacebookF as Facebook, FaInstagram as Instagram, FaWhatsapp as Whatsapp } from "react-icons/fa";
import ReModal from "../main/ReModal.jsx";
import useTranslate from "../hooks/useTranslate.jsx";
import "../../styles/appfooter.css";
import { useNavigate } from "react-router-dom";

const { Footer } = Layout;
const { Title, Text } = Typography;

const LogoTitle = ({ t }) => (
  <Space align="center" size={10} style={{ display: "flex", flexDirection: "row" }}>
    <div className="logo-div" />
    <span style={{ color: "var(--text)" }}>|</span>
    <Title level={4} style={{ color: "var(--text)", margin: 0, marginLeft: "6px" }}>
      {t("Al-Wafi For Computers", "الوافي للحاسبات")}
    </Title>
  </Space>
);

const AppFooter = () => {
  const [modalType, setModalType] = useState(null);
  const t = useTranslate();
  const navigate = useNavigate();

  // === Multilingual Static Content ===
  const ABOUT_US_CONTENT = {
    title: t("About Us", "من نحن"),
    paragraphs: [
      {
        heading: t("Our Story", "قصتنا"),
        text: t(
          `Founded in 1993, AL-WAFI began as a small vision to deliver innovative and elegant tech solutions to a growing digital world. 
          Over the decades, we have evolved with technology, adapting to every new challenge while staying true to our core values: quality, integrity, and creativity.`,
          `تأسست شركة الوافي عام 1993 برؤية صغيرة لتقديم حلول تقنية مبتكرة وأنيقة للعالم الرقمي المتنامي. 
          وعلى مر العقود، تطورنا مع التكنولوجيا وتكيفنا مع كل تحدٍ جديد مع الحفاظ على قيمنا الأساسية: الجودة، النزاهة، والإبداع.`
        ),
      },
      {
        heading: t("Our Mission", "مهمتنا"),
        text: t(
          `We aim to empower businesses and individuals through reliable and cutting-edge technology. 
          Our mission is to make digital experiences seamless, intuitive, and meaningful, bridging the gap between innovation and accessibility.`,
          `نهدف إلى تمكين الأفراد والشركات من خلال التكنولوجيا الموثوقة والمتطورة. 
          تتمثل مهمتنا في جعل التجارب الرقمية سلسة وبديهية وذات معنى، لنجسر الفجوة بين الابتكار وسهولة الوصول.`
        ),
      },
      {
        heading: t("Our Vision", "رؤيتنا"),
        text: t(
          `To become a recognized leader in providing elegant, high-quality tech solutions that transform how people interact with technology. 
          We aspire to set the standard in every sector we touch, combining design, efficiency, and reliability.`,
          `أن نكون رائدين في تقديم حلول تقنية أنيقة وعالية الجودة تُحدث تحولاً في طريقة تفاعل الناس مع التكنولوجيا. 
          نطمح إلى وضع المعايير في كل مجال نعمل فيه، من خلال الجمع بين التصميم والكفاءة والموثوقية.`
        ),
      },
      {
        heading: t("Our Values", "قيمنا"),
        text: t(
          `Innovation, commitment, and trust are the pillars of AL-WAFI. 
          Every solution we deliver reflects our dedication to excellence and our promise to our customers.`,
          `الابتكار، الالتزام، والثقة هي ركائز الوافي. 
          كل حل نقدمه يعكس التزامنا بالتميز ووعدنا لعملائنا.`
        ),
      },
    ],
  };

  const SERVICES_CONTENT = {
    title: t("Our Services", "خدماتنا"),
    paragraphs: [
      {
        heading: t("Laptops Store", "متجر اللابتوبات"),
        text: t(
          `We offer a wide range of laptops for personal, professional, and gaming needs. 
          Each device is carefully selected to ensure quality, performance, and style, catering to beginners and tech enthusiasts alike.`,
          `نقدم مجموعة واسعة من اللابتوبات لتلبية الاحتياجات الشخصية والمهنية وألعاب الفيديو. 
          يتم اختيار كل جهاز بعناية لضمان الجودة والأداء والأناقة، ليناسب المبتدئين ومحبي التكنولوجيا على حد سواء.`
        ),
      },
      {
        heading: t("Computer Components", "مكونات الكمبيوتر"),
        text: t(
          `From high-performance CPUs to graphics cards, motherboards, and memory, we provide all the components needed to build, upgrade, or repair your PC. 
          Our selection ensures compatibility, reliability, and future-proofing for your setups.`,
          `من المعالجات عالية الأداء إلى بطاقات الرسوميات، اللوحات الأم، والذواكر، نقدم جميع المكونات اللازمة لبناء أو ترقية أو صيانة جهازك الشخصي. 
          مجموعتنا تضمن التوافق والموثوقية والاستعداد لمستقبل التكنولوجيا.`
        ),
      },
      {
        heading: t("Delivery & Packaging", "خدمة التوصيل والتغليف"),
        text: t(
          `Safe and secure delivery system and service with warranty in case any customer encounters a bad packaging provided from the deilvery companies.`, "خدمة توصيل آمنة وسريعة مع تأمين كامل على الطلبات وتغليف مُميز وآمن وعدم تحمُل الزبون اي ضرر او تكاليف في حال حدث خطأ من شركات التوصيل" ),
      },
    ],
  };

  const FAQ_CONTENT = {
    title: t("Frequently Asked Questions", "الأسئلة الشائعة"),
    items: [
      {
        question: t("What is AL-WAFI?", "ما هي شركة الوافي؟"),
        answer: t(
          `AL-WAFI is a technology solutions company established in 1993, specializing in laptops, computer components, networking equipment, and expert tech support.`,
          `الوافي هي شركة حلول تقنية تأسست عام 1993، متخصصة في اللابتوبات، مكونات الكمبيوتر، معدات الشبكات، والدعم الفني المتخصص.`
        ),
      },
      {
        question: t("Do you provide warranties on products?", "هل تقدمون ضماناً على المنتجات؟"),
        answer: t(
          `Yes! All products come with manufacturer warranties, and we also offer our own support and service guarantees to ensure satisfaction.`,
          `نعم! جميع المنتجات تأتي مع ضمان من الشركة المصنعة، كما نقدم ضمانات دعم وخدمة خاصة بنا لضمان رضا العملاء.`
        ),
      },
      {
        question: t("Can I request a custom PC build?", "هل يمكنني طلب تجميع كمبيوتر مخصص؟"),
        answer: t(
          `Absolutely. We help customers design and assemble custom PCs tailored to their specific performance, aesthetic, and budget requirements.`,
          `بكل تأكيد. نساعد عملاءنا في تصميم وتجميع أجهزة كمبيوتر مخصصة تلبي متطلباتهم من حيث الأداء والمظهر والميزانية.`
        ),
      },
      {
        question: t("How do I contact support?", "كيف يمكنني التواصل مع الدعم الفني؟"),
        answer: t(
          `You can reach our support team via email, phone, or live chat on our website.`,
          `يمكنك التواصل مع فريق الدعم الفني عبر البريد الإلكتروني أو الهاتف أو الدردشة المباشرة على موقعنا الإلكتروني.`
        ),
      },
      {
        question: t("Is the deilvery service secure?", "هل خدمة التوصيل آمنة؟"),
        answer: t(
          `Yes, we provide a secure delivery service with speical subscriptions with the delivery companies for proper packaging of the orders.`,
          `نعم آمنة، مع توصيل سريع واشتراكات خاصة للتوصيل مع شركات التوصيل للحفاظ على الطلبات `
        ),
      },
    ],
  };

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
        <Col xs={24} sm={12} md={6} style={{ textAlign: t.textAlign }}>
          <Space direction="vertical" size={15} style={{ alignItems: t.flexAlign }}>
            <LogoTitle t={t} />
            <Text style={{ color: "var(--text)" }}>
              {t(
                "A pioneer in Baghdad’s computer industry since 1993.",
                "من اقدم مكاتب الحاسِبات في بغداد، تأسسَ في عام 1993"
              )}
            </Text>
          </Space>
        </Col>

        {/* Quick Links */}
        <Col xs={24} sm={12} md={6} style={{ textAlign: t.textAlign }}>
          <Space direction="vertical" size={10} style={{ textAlign: t.textAlign }}>
            <Title level={5} style={{ color: "var(--text)", marginBottom: 10 }}>
              {t("Quick Links", "روابط سريعة")}
            </Title>
            <Text style={{ color: "var(--text)", cursor: "pointer" }} onClick={() => navigate("/")}>
              {t("Home", "الرئيسية")}
            </Text>
            <Text style={{ color: "var(--text)", cursor: "pointer" }} onClick={() => setModalType("about")}>
              {t("About Us", "من نحن")}
            </Text>
            <Text style={{ color: "var(--text)", cursor: "pointer" }} onClick={() => setModalType("services")}>
              {t("Services", "الخدمات")}
            </Text>
            <Text style={{ color: "var(--text)", cursor: "pointer" }} onClick={() => setModalType("faq")}>
              {t("FAQ", "الأسئلة الشائعة")}
            </Text>
          </Space>
        </Col>

        {/* Contact Info */}
        <Col xs={24} sm={12} md={6} style={{ textAlign: t.textAlign }}>
          <Space direction="vertical" size={10}>
            <Title level={5} style={{ color: "var(--text)", marginBottom: 10 }}>
              {t("Contact Info", "معلومات التواصل")}
            </Title>
            <Text style={{ color: "var(--text)" }}>{t("Al Senaha St. - Baghdad - Iraq", "شارع الصناعة - بغداد - العراق")}</Text>
            <Text style={{ color: "var(--text)" }}>support@alwafi.net</Text>
            <Text style={{ color: "var(--text)" }}>+964 784 497 0384</Text>
          </Space>
        </Col>

        {/* Social Media */}
        <Col xs={24} sm={12} md={6} style={{ textAlign: t.textAlign }}>
          <Space direction="vertical" size={15} style={{ textAlign: t.textAlign }}>
            <Title level={5} style={{ color: "var(--text)", marginBottom: 10 }}>
              {t("Get In Touch", "تواصل معنا")}
            </Title>
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
              © 2025 {t("AL-WAFI. All rights reserved.", "الوافي. جميع الحقوق محفوظة.")}
            </Text>
          </Space>
        </Col>
      </Row>

      {/* === Modals === */}
      <ReModal isOpen={modalType === "about"} onClose={() => setModalType(null)} title={ABOUT_US_CONTENT.title}>
        {ABOUT_US_CONTENT.paragraphs.map((p, i) => (
          <div key={i} style={{ marginBottom: "1rem", textAlign: t.textAlign }}>
            {p.heading && <h3 style={{ color: "#6ee7b7", marginBottom: "0.5rem" }}>{p.heading}</h3>}
            <p style={{ lineHeight: 1.6 }}>{p.text}</p>
          </div>
        ))}
      </ReModal>

      <ReModal isOpen={modalType === "services"} onClose={() => setModalType(null)} title={SERVICES_CONTENT.title}>
        {SERVICES_CONTENT.paragraphs.map((p, i) => (
          <div key={i} style={{ marginBottom: "1rem", textAlign: t.textAlign }}>
            {p.heading && <h3 style={{ color: "#6ee7b7", marginBottom: "0.5rem" }}>{p.heading}</h3>}
            <p style={{ lineHeight: 1.6 }}>{p.text}</p>
          </div>
        ))}
      </ReModal>

      <ReModal isOpen={modalType === "faq"} onClose={() => setModalType(null)} title={FAQ_CONTENT.title}>
        {FAQ_CONTENT.items.map((item, i) => (
          <div key={i} style={{ marginBottom: "1rem", textAlign: t.textAlign }}>
            <h3 style={{ color: "#6ee7b7", marginBottom: "0.3rem" }}>{item.question}</h3>
            <p style={{ lineHeight: 1.6 }}>{item.answer}</p>
          </div>
        ))}
      </ReModal>
    </Footer>
  );
};

export default AppFooter;
