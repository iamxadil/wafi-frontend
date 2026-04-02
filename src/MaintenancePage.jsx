import "./maintenance.css";
import logo from "../assets/svg/wafi-logo-filled-white.svg";

export default function MaintenancePage() {
  return (
    <main className="maintenance-wrap" dir="rtl" lang="ar" aria-live="polite">
      <section className="maintenance-card">
        <header className="card-header">
          <div className="brand-mark" aria-hidden="true">
            <img src={logo} alt="" className="brand-logo" />
          </div>
          <div className="brand-copy">
            <p className="brand-en">ALWAFI FOR COMPUTERS</p>
            <p className="brand-ar">الوافي للحاسبات</p>
          </div>
          <span className="status-chip">قيد الصيانة</span>
        </header>

        <div className="card-body">
          <h1>نسعى لتقديم افضل تجربة شراء</h1>
          <p className="status">جاري تحديث الموقع</p>
          <p className="note">سنعود قريباً</p>
          <p className="sub-note">
            نقوم حالياً بأعمال تحسين وتطوير لضمان سرعة افضل وتجربة استخدام اكثر احترافية.
          </p>

          <div className="progress-wrap" role="presentation" aria-hidden="true">
            <div className="progress-bar" />
          </div>
        </div>

        <footer className="card-footer">
          <p>شكراً لصبركم وتفهمكم.</p>
        </footer>
      </section>
    </main>
  );
}
