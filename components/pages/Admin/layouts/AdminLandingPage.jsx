import React from "react";
import {useNavigate} from "react-router-dom";
import "../styles/adminlandingpage.css"; // make sure this path/name matches your file

const AdminLandingPage = () => {

  const navigate = useNavigate();
  const stats = [
    {
      label: "Today’s Orders",
      value: "128",
      trend: "+12.4%",
      hint: "vs yesterday",
      tone: "up",
    },
    {
      label: "Revenue (IQD)",
      value: "4,320,000",
      trend: "+8.1%",
      hint: "last 24 hours",
      tone: "up",
    },
    {
      label: "Pending Approvals",
      value: "7",
      trend: "Review now",
      hint: "products & updates",
      tone: "neutral",
    },
  ];

  const quickActions = [
    {
      label: "Add New Product",
      navigate : ""
    },
    {
      label: "Review Approvals",
      navigate : "approvals"
    },
    {
      label: "View Orders",
      navigate : "orders"
    },
    {
      label: "Manage Users",
      navigate : "users"
    },
  ];

  const activities = [
    {
      time: "2 min ago",
      title: "New Order #1200",
      detail: "3 items · Pickup at store",
    },
    {
      time: "18 min ago",
      title: "Updated Product",
      detail: "Lenovo Legion 5 · price adjusted",
    },
    {
      time: "1 hr ago",
      title: "New User",
      detail: "adil.tahseen@example.com",
    },
    {
      time: "Yesterday",
      title: "StockAlert",
      detail: "Logitech G Pro X · low stock",
    },
  ];

  const health = [
    { label: "API", status: "OK", code: 99 },
    { label: "Database", status: "OK", code: 98 },
    { label: "Payments", status: "Stable", code: 96 },
    { label: "Email", status: "OK", code: 94 },
  ];

  return (
    <div id="admin-landing">
      <header className="al-header">
        <div className="al-header-main">
          <h1 className="al-title">Admin Overview</h1>
          <p className="al-subtitle">
            A calm snapshot of AL-WAFI — orders, revenue, and activity at a
            glance.
          </p>
        </div>

        <div className="al-header-status">
          <span className="al-status-pill">
            <span className="al-status-dot al-status-ok" />
            System stable
          </span>
          <span className="al-status-meta">Last sync: just now</span>
        </div>
      </header>

      {/* Top stats row */}
      <section className="al-grid al-grid-3">
        {stats.map((item) => (
          <article key={item.label} className="al-card al-card-stat">
            <div className="al-card-body">
              <div className="al-card-label">{item.label}</div>
              <div className="al-card-value">{item.value}</div>

              <div className="al-card-meta">
                <span
                  className={`al-trend-pill ${
                    item.tone === "up"
                      ? "al-trend-up"
                      : item.tone === "down"
                      ? "al-trend-down"
                      : "al-trend-neutral"
                  }`}
                >
                  {item.trend}
                </span>
                <span className="al-card-hint">{item.hint}</span>
              </div>
            </div>

            {/* Soft little inline “sparkline” bars */}
            <div className="al-mini-bars">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="al-mini-bar" />
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* Bottom layout */}
      <section className="al-layout">
        <div className="al-column-large">
          {/* Quick actions */}
          <article className="al-card al-card-quick">
            <div className="al-card-head">
              <h2>Quick actions</h2>
              <span className="al-chip-soft">Most used</span>
            </div>

            <div className="al-quick-grid">
              {quickActions.map((item) => (
                <button key={item.label} className="al-quick-btn" type="button" onClick={() => navigate(`${item.navigate}`)}>
                  <span className="al-quick-dot" />
                  <span className="al-quick-label">{item.label}</span>
                  <span className="al-quick-chevron">↗</span>
                </button>
              ))}
            </div>
          </article>

          {/* Recent activity */}
          <article className="al-card al-card-activity">
            <div className="al-card-head">
              <h2>Recent activity</h2>
              <button className="al-link-ghost" type="button">
                View all
              </button>
            </div>

            <ul className="al-timeline">
              {activities.map((a, idx) => (
                <li key={idx} className="al-timeline-item">
                  <div className="al-timeline-icon" />
                  <div className="al-timeline-content">
                    <div className="al-timeline-main">
                      <span className="al-timeline-title">{a.title}</span>
                      <span className="al-timeline-time">{a.time}</span>
                    </div>
                    <p className="al-timeline-detail">{a.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Right side mini widgets */}
        <div className="al-column-small">
          {/* Health widget */}
          <article className="al-card al-card-health">
            <div className="al-card-head">
              <h2>System health</h2>
              <span className="al-chip-soft">Live</span>
            </div>

            <div className="al-health-grid">
              {health.map((h) => (
                <div key={h.label} className="al-health-row">
                  <div className="al-health-main">
                    <span className="al-health-label">{h.label}</span>
                    <span className="al-health-status">{h.status}</span>
                  </div>
                  <div className="al-health-meter">
                    <div
                      className="al-health-fill"
                      style={{ "--health": `${h.code}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Tiny notes / reminders */}
          <article className="al-card al-card-notes">
            <div className="al-card-head">
              <h2>Admin notes</h2>
            </div>

            <ul className="al-notes-list">
              <li>
                <span className="al-note-dot" />
                <span className="al-note-text">
                  Review Black Friday offers and mark top products.
                </span>
              </li>
              <li>
                <span className="al-note-dot" />
                <span className="al-note-text">
                  Check stock levels on gaming mice & keyboards.
                </span>
              </li>
              <li>
                <span className="al-note-dot" />
                <span className="al-note-text">
                  Verify new laptop specs and images before publishing.
                </span>
              </li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AdminLandingPage;
