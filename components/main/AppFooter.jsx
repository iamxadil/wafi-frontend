import React, { useState, lazy, Suspense } from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  FaFacebookF as Facebook,
  FaInstagram as Instagram,
  FaWhatsapp as Whatsapp,
} from "react-icons/fa";
import useTranslate from "../hooks/useTranslate.jsx";
import "../../styles/appfooter.css";
import { useNavigate } from "react-router-dom";

const { Footer } = Layout;
const { Title, Text } = Typography;

// Lazy-loaded modal bundle
const FooterModals = lazy(() => import("../utils/footerModals.jsx"));

const LogoTitle = ({ t }) => (
  <Space align="center" size={10} style={{ display: "flex", flexDirection: "row" }}>
    <div className="logo-div" />
    <span style={{ color: "var(--text)" }}>|</span>
    <Title level={4} style={{ color: "var(--text)", margin: 0, marginLeft: "6px" }}>
      {t("Al-Wafi For Computers", "الوافي للحاسبات")}
    </Title>
  </Space>
);

export default function AppFooter() {
  const [modalType, setModalType] = useState(null);
  const t = useTranslate();
  const navigate = useNavigate();

  // === ORIGINAL STATIC CONTENT (must remain unchanged) ===
  const ABOUT_US_CONTENT = {
    title: t("About Us", "من نحن"),
    paragraphs: [
      {
        text: t("Al-Wafi was founded with a rich legacy of technological expertise to save you time and effort of decision-making. We don’t just sell products; we build technological partnerships that guides your way to the best solution. We also offer our clients original products supported by certified Guarantees.",
          "نحن لسنا مجرد بائعين للحواسيب بل شريكك في اختيار الحل التقني الامثل . تأسس الوافي على قاعدة من الخبرة الطويلة في قطاع التكنولوجيا لتوفر عليك عناء البحث و التفكير.  كما  نقدم لك منتجات اصلية مدعومة بضمانات معتمدة ")
      },
    ],
  };

  const SERVICES_CONTENT = {
    title: t("Our Services", "خدماتنا"),
    paragraphs: [
      {
        heading: t("Laptops Store", "متجر اللابتوبات"),
        text: t(`We offer wide range of laptops to suit all needs of personal use, professional tasks, engineering applications, and video gaming.
              Each device is handpicked to guarantee outstanding quality, powerful performance and sleek design, meeting the expectations of all technology lovers`, 
            `نقدم مجموعة واسعة من اللابتوبات لتلبية الاحتياجات الشخصية والمهنية  و الهندسية وألعاب الفيديو. يتم اختيار كل جهاز بعناية لضمان الجودة والأداء والأناقة، ليناسب  جميع محبي التكنولوجيا على حد سواء`),
      },
      {
        heading: t("Packaging & Delivery", "خدمة التغليف والتوصيل"),
        text: t(`	Since product quality is our commitment, we offer fast and secured delivery complemented by distinctive and unique packaging that will guarantees your order’s safe arrival.
                Moreover you are fully protected from any additional coasts if anything unlikely happened during shipping.`
              , `نحن مسؤولون عن جودة منتجاتنا لذلك نقدم لك خدمة توصيل آمنة و سريعة، مصحوبة بتغليفنا المميز و الفريد الذي يضمن وصول طلبك بسلامة، و نتحمل اي تكاليف في حال حدوث اي ضرر أثناء عملية الشحن `)
      },
    ],
  };

  const FAQ_CONTENT = {
    title: t("Frequently Asked Questions", "الأسئلة الشائعة"),
    items: [
      {
        question: t(`What is your address?`, "اين موقعكم؟"),
        answer: t(`Iraq- Baghdad- Al-Senaha St., Near the University of Technology roundabout`, "العراق - بغداد - شارع الصناعة، قرب فلكة الجامعة التكنولوجية"),
        answer2: t(`support@alwafi.net`, "support@alwafi.net"),
        answer3: t(`Number: +964 784 497 0384`, "+964 784 497 0384"),
      },
      {
        question: t("Do you offer guarantees on products?", "هل تقدمون ضماناً على المنتجات؟"),
        answer: t(`Yes! All products come with manufacturer warranties,
                  and as Al-Wafi team we also offer our own after-sales service and advice to all our clients.`
                , `نعم! جميع المنتجات تأتي مع ضمان من الوكالة، و كذلك يوفر فريق الوافي الدعم و الحلول و خدمات ما بعد البيع  لجميع عملائنا `),
      },
      {
        question: t("What are your business hours?", "ماهي اوقات الدوام داخل المتجر؟"),
        answer: t(`The Store is open daily except for Friday Our business hours are from 9:00 am to 4:00 pm`
                  , `يفتح المتجر كل يوم عدا يوم الجمعة،  و اوقات الدوام تبدأ من الساعة التاسعة صباحا حتى الرابعة عصرا`
        ),
      },
      {
        question: t("How can I track my order?", "كيف يمكنني تتبع طلبي؟ "),
        answer: t(
          `You can track your order by clicking on orders inside the website to check the order status, or you can check your email and we will be very responsive for anything our customers need. `,
          `تستطيع تتبع الطلب عن طريق الذهاب الى صفحة الطلبات داخل الموقع لمعرفة حالة الطلب او تستطيع الذهاب الى اشعارات الايميل الخاص بك و سنكون على تواصل معك خطوة بخطوة لمعرفة حالة طلبك.`
        ),
      },
    ],
  };

  // === RETURN FOOTER LAYOUT (NO CLS VERSION) ===
  return (
    <>
      <Footer
        style={{
          width: "100%",
          background: "none",
          color: "var(--text)",
          padding: "50px 50px 30px",
        }}
      >
        <Row gutter={[40, 40]} justify="space-between">
          {/* Logo & info */}
          <Col xs={24} sm={12} md={6} style={{ textAlign: t.textAlign }}>
            <Space direction="vertical" size={15} style={{ alignItems: t.flexAlign }}>
              <LogoTitle t={t} />
              <Text style={{ color: "var(--text)" }}>
                {t(
                  "Three decades of experience in your hands, since 1993.",
                  "مُنذ عام 1993، خبرة ثلاثة عقود بين يديك"
                )}
              </Text>
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={6} style={{ textAlign: t.textAlign }}>
            <Space direction="vertical" size={10}>
              <Title level={5} style={{ color: "var(--text)", marginBottom: 10 }}>
                {t("Quick Links", "روابط سريعة")}
              </Title>
              <Text onClick={() => navigate("/")} style={{ cursor: "pointer", color: "var(--text)" }}>
                {t("Home", "الرئيسية")}
              </Text>
              <Text onClick={() => setModalType("about")} style={{ cursor: "pointer", color: "var(--text)" }}>
                {t("About Us", "من نحن")}
              </Text>
              <Text onClick={() => setModalType("services")} style={{ cursor: "pointer", color: "var(--text)" }}>
                {t("Services", "الخدمات")}
              </Text>
              <Text onClick={() => setModalType("faq")} style={{ cursor: "pointer", color: "var(--text)" }}>
                {t("FAQ", "الأسئلة الشائعة")}
              </Text>
            </Space>
          </Col>

          {/* Contact */}
          <Col xs={24} sm={12} md={6} style={{ textAlign: t.textAlign }}>
            <Space direction="vertical" size={10}>
              <Title level={5} style={{ color: "var(--text)", marginBottom: 10 }}>
                {t("Contact Info", "معلومات التواصل")}
              </Title>
              <Text style={{ color: "var(--text)" }}>
                {t("Al Senaha St. - Baghdad - Iraq", "شارع الصناعة - بغداد - العراق")}
              </Text>
              <Text style={{ color: "var(--text)" }}>support@alwafi.net</Text>
              <Text style={{ color: "var(--text)" }}>+964 784 497 0384</Text>
            </Space>
          </Col>

          {/* Social */}
          <Col xs={24} sm={12} md={6} style={{ textAlign: t.textAlign }}>
            <Space direction="vertical" size={15}>
              <Title level={5} style={{ color: "var(--text)" }}>
                {t("Social Links", "مواقع التواصل الاجتماعي")}
              </Title>

              <Space size="middle">
                <a href="https://www.facebook.com/alwafi.co1" target="_blank">
                  <Facebook size={25} color="var(--text)" />
                </a>
                <a href="https://www.instagram.com/alwafi.co1/" target="_blank">
                  <Instagram size={25} color="var(--text)" />
                </a>
                <a href="https://wa.me/9647844970384" target="_blank">
                  <Whatsapp size={25} color="var(--text)" />
                </a>
              </Space>

              <Text style={{ color: "var(--text)", marginTop: 20 }}>
                © 2025 {t("AL-WAFI. All rights reserved.", "الوافي. جميع الحقوق محفوظة.")}
              </Text>
            </Space>
          </Col>
        </Row>
      </Footer>

      {/* === Lazy-loaded Modals (Zero CLS) === */}
      <Suspense fallback={null}>
        <FooterModals
          modalType={modalType}
          ABOUT_US_CONTENT={ABOUT_US_CONTENT}
          SERVICES_CONTENT={SERVICES_CONTENT}
          FAQ_CONTENT={FAQ_CONTENT}
          onClose={() => setModalType(null)}
          t={t}
        />
      </Suspense>
    </>
  );
}
