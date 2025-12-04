// components/pages/Admin/layouts/AdminLandingPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminlandingpage.css";

import useQuickStats from "../../../query/useQuickStats.jsx";
import {
  useNotesQuery,
  useAddNote,
  useUpdateNote,
  useDeleteNote,
} from "../../../query/useNotes.jsx";
import useAuthStore from "../../../stores/useAuthStore.jsx";
import ProductsModal from "../modals/ProductsModal.jsx";

import {
  ShoppingBag,
  Package,
  UserPlus,
  AlertTriangle,
  Edit,
  Save,
  Trash2,
  Plus,
} from "lucide-react";

/* -----------------------------------------------------------
   Time-ago formatter
----------------------------------------------------------- */
const timeAgo = (date) => {
  if (!date) return "Unknown";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (let i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

const AdminLandingPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  /* -----------------------------------------------------------
     QUERIES
  ----------------------------------------------------------- */
  const {
    data: quick,
    isLoading,
    error,
  } = useQuickStats();

  const {
    data: notesData,
    isLoading: notesLoading,
  } = useNotesQuery();

  const addNote = useAddNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  /* -----------------------------------------------------------
     NOTE EDITING STATE
  ----------------------------------------------------------- */
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  /* -----------------------------------------------------------
     PRODUCT MODAL STATE
  ----------------------------------------------------------- */
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  if (isLoading) return <div id="admin-landing">Loading admin overview…</div>;
  if (error) return <div id="admin-landing">Failed to load stats.</div>;

  const { stats, activities, health, lastSync } = quick;

  const maxSalesValue =
    stats.salesTrend && stats.salesTrend.length > 0
      ? Math.max(...stats.salesTrend.map((s) => s.value))
      : 1;

  const salesTrendPercent = stats.salesTrendPercent ?? 0;
  const trendTone = salesTrendPercent >= 0 ? "up" : "down";
  const trendLabel = `${salesTrendPercent >= 0 ? "+" : ""}${salesTrendPercent.toFixed(
    1
  )}%`;

  /* -----------------------------------------------------------
     QUICK ACTIONS
  ----------------------------------------------------------- */
  const quickActions = [
    {
      label: "Add New Product",
      onClick: () => setIsProductModalOpen(true),
    },
    {
      label: "Review Approvals",
      onClick: () => navigate("approvals"),
    },
    {
      label: "View Orders",
      onClick: () => navigate("orders"),
    },
    {
      label: "Manage Users",
      onClick: () => navigate("users"),
    },
  ];

  /* -----------------------------------------------------------
     HELPERS
  ----------------------------------------------------------- */
  const getTypeIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag size={18} />;
      case "user":
        return <UserPlus size={18} />;
      case "product":
        return <Package size={18} />;
      case "stock":
        return <AlertTriangle size={18} />;
      default:
        return null;
    }
  };

  const getStatClass = (type) => {
    switch (type) {
      case "order":
        return "al-pill-order";
      case "user":
        return "al-pill-user";
      case "product":
        return "al-pill-product";
      case "stock":
        return "al-pill-stock";
      default:
        return "";
    }
  };

  const notes = notesData || [];

  /* -----------------------------------------------------------
     RENDER
  ----------------------------------------------------------- */
  return (
    <div id="admin-landing">
      {/* HEADER */}
      <header className="al-header">
        <div className="al-header-main">
          <h1 className="al-title">Admin Overview</h1>
          <p className="al-subtitle">Sales, Activity & System Status</p>
        </div>

        <div className="al-header-status">
          <span className="al-status-pill">
            <span className="al-status-dot al-status-ok" />
            System stable
          </span>
          <span className="al-status-meta">
            Last sync: {new Date(lastSync).toLocaleTimeString()}
          </span>
        </div>
      </header>

      {/* TOP STATS */}
      <section className="al-grid al-grid-3">
        {/* SALES TODAY */}
        <article className="al-card al-card-stat">
          <div className="al-card-body">
            <div className="al-card-label">Sales Today</div>
            <div className="al-card-value">
              {stats.salesToday.toLocaleString()} IQD
            </div>

            <div className="al-card-meta">
              <span
                className={`al-trend-pill ${
                  trendTone === "up" ? "al-trend-up" : "al-trend-down"
                }`}
              >
                {trendLabel}
              </span>
              <span className="al-card-hint">vs yesterday</span>
            </div>
          </div>

          {/* Sparkline — interactive bars */}
          <div className="al-mini-bars">
            {stats.salesTrend?.map((d, i) => (
              <span
                key={i}
                className="al-mini-bar"
                title={`${d.value.toLocaleString()} IQD on ${d.day}`}
                style={{
                  height: `${Math.max(
                    15,
                    (d.value / maxSalesValue) * 100
                  )}%`,
                }}
              />
            ))}
          </div>
        </article>

        {/* PENDING APPROVALS */}
        <article className="al-card al-card-stat">
          <div className="al-card-body">
            <div className="al-card-label">Pending Approvals</div>
            <div className="al-card-value">{stats.pendingApprovals}</div>
            <div className="al-card-meta">
              <span className="al-card-hint">
                Products waiting for review / publish
              </span>
            </div>
          </div>
        </article>

        {/* YESTERDAY SALES */}
        <article className="al-card al-card-stat">
          <div className="al-card-body">
            <div className="al-card-label">Sales Yesterday</div>
            <div className="al-card-value">
              {stats.salesYesterday.toLocaleString()} IQD
            </div>
            <div className="al-card-meta">
              <span className="al-card-hint">Reference baseline</span>
            </div>
          </div>
        </article>
      </section>

      {/* MAIN */}
      <section className="al-layout">
        {/* LEFT COLUMN */}
        <div className="al-column-large">
          {/* QUICK ACTIONS */}
          <article className="al-card al-card-quick">
            <div className="al-card-head">
              <h2>Quick actions</h2>
              <span className="al-chip-soft">Most used</span>
            </div>

            <div className="al-quick-grid">
              {quickActions.map((item, idx) => (
                <button
                  key={idx}
                  className="al-quick-btn"
                  type="button"
                  onClick={item.onClick}
                >
                  <span className="al-quick-dot" />
                  <span className="al-quick-label">{item.label}</span>
                  <span className="al-quick-chevron">↗</span>
                </button>
              ))}
            </div>
          </article>

          {/* RECENT ACTIVITY */}
          <article className="al-card al-card-activity">
            <div className="al-card-head">
              <h2>Recent Activity</h2>
            </div>

            <ul className="al-timeline">
              {activities.map((a, idx) => (
                <li
                  key={idx}
                  className="al-timeline-item al-activity-animate-v4"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="al-timeline-icon-v4">
                    {getTypeIcon(a.type)}
                  </div>

                  <div className="al-timeline-content">
                    <div className="al-timeline-main">
                      <span className="al-timeline-title">{a.title}</span>
                      <span className="al-timeline-time">
                        {timeAgo(a.time)}
                      </span>
                    </div>

                    <p className="al-timeline-detail">{a.detail}</p>

                    {/* Extra info from backend (user name / category, etc.) */}
                    {a.name && (
                      <div className="al-timeline-sub">User: {a.name}</div>
                    )}
                    {a.category && (
                      <div className="al-timeline-sub">
                        Category: {a.category}
                      </div>
                    )}

                    <span
                      className={`al-timeline-stat-v4 ${getStatClass(a.type)}`}
                    >
                      {a.stat}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* RIGHT COLUMN */}
        <div className="al-column-small">
          {/* SYSTEM HEALTH */}
          <article className="al-card al-card-health">
            <div className="al-card-head">
              <h2>System Health</h2>
              <span className="al-chip-soft">Live</span>
            </div>

            <div className="al-health-grid">
              {health.map((h, idx) => {
                const statusClass =
                  h.code >= 90
                    ? "al-health-good"
                    : h.code >= 70
                    ? "al-health-warn"
                    : "al-health-bad";

                return (
                  <div key={idx} className="al-health-row">
                    <div className="al-health-main">
                      <span className="al-health-label">{h.label}</span>
                      <span
                        className={`al-health-status ${statusClass}`}
                        title={h.details || ""}
                      >
                        {h.status}
                      </span>
                    </div>

                    <div
                      className="al-health-meter"
                      title={
                        h.details
                          ? h.details
                          : `${h.label} health: ${h.code.toFixed?.(0) ?? h.code
                            }`
                      }
                    >
                      <div
                        className="al-health-fill"
                        style={{ "--health": `${h.code}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* ADMIN NOTES */}
          <article className="al-card al-card-notes">
            <div className="al-card-head">
              <h2>Admin Notes</h2>
            </div>

            <ul className="al-notes-list">
              {notesLoading ? (
                <p>Loading notes…</p>
              ) : notes.length === 0 ? (
                <p className="al-empty-notes">No notes yet.</p>
              ) : (
                notes.map((note) => (
                  <li key={note._id}>
                    <span className="al-note-dot" />

                    {editingNoteId === note._id ? (
                      <input
                        className="al-note-input"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                      />
                    ) : (
                      <span className="al-note-text">{note.text}</span>
                    )}

                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          className="al-note-edit-btn"
                          onClick={() => {
                            if (editingNoteId === note._id) {
                              if (editingValue.trim()) {
                                updateNote.mutate({
                                  id: note._id,
                                  text: editingValue.trim(),
                                });
                              }
                              setEditingNoteId(null);
                            } else {
                              setEditingValue(note.text);
                              setEditingNoteId(note._id);
                            }
                          }}
                        >
                          {editingNoteId === note._id ? (
                            <Save size={16} />
                          ) : (
                            <Edit size={16} />
                          )}
                        </button>

                        <button
                          type="button"
                          className="al-note-delete-btn"
                          onClick={() => deleteNote.mutate(note._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </li>
                ))
              )}

              {isAdmin && (
                <button
                  type="button"
                  className="al-add-note-btn"
                  onClick={() => addNote.mutate("New note")}
                >
                  <Plus size={14} />
                  <span> Add note</span>
                </button>
              )}
            </ul>
          </article>
        </div>
      </section>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <ProductsModal
          setIsModalOpen={setIsProductModalOpen}
          isEditing={false}
          editData={null}
          allProducts={[]} // if you have a products query, pass real list here
        />
      )}
    </div>
  );
};

export default AdminLandingPage;
