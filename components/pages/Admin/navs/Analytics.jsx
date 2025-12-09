import React, { useState } from "react";
import AdminCard from "../AdminCard.jsx";
import {
  Users,
  TrendingUp,
  Search,
  ShoppingBag,
  Star,
  Clock,
  Activity,
  MousePointerClick,
} from "lucide-react";

import "../styles/analytics.css";

// Hooks
import useAnalysis, { useAnalyticsRange } from "../../../query/useAnalysis.jsx";

const Analytics = () => {
  // RANGE: today | week | month
  const [range, setRange] = useState("today");

  // TODAY (live)
  const live = useAnalysis();

  // WEEK / MONTH (aggregated)
  const { loading, data: rangeData } = useAnalyticsRange(range);

  const isToday = range === "today";

  // ---------------------------------------------
  // MERGED METRICS BASED ON RANGE
  // ---------------------------------------------
  const metrics = isToday
    ? {
        activeUsers: live.activeUsers ?? 0,
        peak: live.peakToday ?? 0,
        avgSession: live.avgSessionTimeToday ?? 0,
        returning: live.returningUsersToday ?? 0,
        newVisitors: live.newVisitorsToday ?? 0,
        totalVisits: live.totalVisitsToday ?? 0,
        devices: live.devices ?? {},
        browsers: live.browsers ?? {},
        utm: live.utm ?? {},
        liveDelta: live.liveDelta,
        liveTone: live.liveTone,
      }
    : {
        activeUsers: null, // Week & month have no real-time count
        peak: rangeData?.peakActiveUsers ?? 0,
        avgSession: rangeData?.avgSessionTime ?? 0,
        returning: rangeData?.returningVisitors ?? 0,
        newVisitors: rangeData?.newVisitors ?? 0,
        totalVisits: rangeData?.totalVisits ?? 0,
        devices: rangeData?.devices ?? {},
        browsers: rangeData?.browsers ?? {},
        utm: rangeData?.utm ?? {},
        liveDelta: "0",
        liveTone: "neutral",
      };

  // ---------------------------------------------
  // FORMATTERS
  // ---------------------------------------------
  const formatSession = (ms) => {
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? "0" + s : s}s`;
  };

  // ---------------------------------------------
  // UI: RANGE SWITCH
  // ---------------------------------------------
const IOSRangeSwitcher = ({ range, setRange }) => {
  const options = [
    { key: "today", label: "Today" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
  ];

  return (
    <div className="ios-switcher">
      {options.map((opt) => (
        <button
          key={opt.key}
          className={`ios-pill ${range === opt.key ? "active" : ""}`}
          onClick={() => setRange(opt.key)}
        >
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

  return (
    <main id="analytics-root">
      
      <header className="analytics-header">
        <h1>Site Analytics Overview</h1>
        <p className="analytics-subtitle">
          {isToday
            ? "Live real-time insights powered by adaptive liquid-glass intelligence."
            : `Analytics for the last ${range === "week" ? "7 days" : "30 days"}.`}
        </p>
      </header>

      {/* Range Switcher */}
      <IOSRangeSwitcher range={range} setRange={setRange} />


      {/* ----------------------------------------- */}
      {/*              ANALYTICS CARDS              */}
      {/* ----------------------------------------- */}
      <div className="analytics-gallery">
        {/* ============================================================
            ACTIVE USERS / VISITORS
        ============================================================ */}
        <div className="lgc-card-wrapper">
          <AdminCard
            title={
              isToday ? "Active Users Online" : "Visitors Overview"
            }
            subtitle={
              isToday
                ? "Current live traffic"
                : `Total visitor summary (${range})`
            }
            value={
              isToday
                ? metrics.activeUsers
                : metrics.totalVisits
            }
            valuePrefix={isToday ? "" : ""}
            icon={<Users size={20} />}
            accent="green"
            status="good"
            pill={isToday ? "Live" : range === "week" ? "7d" : "30d"}
            enableCopy
            sparklineLabel="Live connections trend"
            expandable
            size="sm"
            hint={isToday ? "Auto-updating" : "Aggregated data"}
            delta={metrics.liveDelta}
            deltaLabel={isToday ? "live change" : ""}
            deltaTone={metrics.liveTone}
          >
            <p>
              Peak {isToday ? "Today" : "Period"}:{" "}
              <strong>{metrics.peak}</strong>
            </p>

            <p>
              Avg Session: <strong>{formatSession(metrics.avgSession)}</strong>
            </p>

            <p>
              Returning Visitors:{" "}
              <strong>
                {metrics.returning} •{" "}
                {metrics.totalVisits
                  ? Math.round((metrics.returning / metrics.totalVisits) * 100)
                  : 0}
                %
              </strong>
            </p>

            <p>
              New Visitors: <strong>{metrics.newVisitors}</strong>
            </p>

            <p>
              Total Visits: <strong>{metrics.totalVisits}</strong>
            </p>
          </AdminCard>
        </div>

        {/* ============================================================
            TRAFFIC INSIGHTS (UTM / DEVICE / BROWSER)
        ============================================================ */}
        <div className="lgc-card-wrapper">
          <AdminCard
            title="Traffic Insights"
            subtitle={
              isToday
                ? "Live user source channels"
                : `Aggregated traffic distribution (${range})`
            }
            value="Overview"
            icon={<Activity size={20} />}
            accent="blue"
            status="good"
            expandable
            size="auto"
            hint={isToday ? "Live updates" : "Historical aggregation"}
            badges={[{ text: isToday ? "Live" : range, color: "blue" }]}
          >
            {/* UTM */}
            <div className="ti-section">
              <h4 className="ti-heading">UTM Sources</h4>
              {Object.keys(metrics.utm).length === 0 ? (
                <p className="ti-empty">No UTM data available</p>
              ) : (
                Object.entries(metrics.utm).map(([source, count]) => (
                  <div className="ti-row" key={source}>
                    <span className="ti-key">{source}</span>
                    <span className="ti-value">{count}</span>
                  </div>
                ))
              )}
            </div>

            <div className="ti-divider"></div>

            {/* DEVICES */}
            <div className="ti-section">
              <h4 className="ti-heading">Devices</h4>
              {Object.keys(metrics.devices).length === 0 ? (
                <p className="ti-empty">No device data</p>
              ) : (
                Object.entries(metrics.devices).map(([dev, count]) => (
                  <div className="ti-row" key={dev}>
                    <span className="ti-key">
                      {dev.charAt(0).toUpperCase() + dev.slice(1)}
                    </span>
                    <span className="ti-value">{count}</span>
                  </div>
                ))
              )}
            </div>

            <div className="ti-divider"></div>

            {/* BROWSERS */}
            <div className="ti-section">
              <h4 className="ti-heading">Browsers</h4>
              {Object.keys(metrics.browsers).length === 0 ? (
                <p className="ti-empty">No browser data</p>
              ) : (
                Object.entries(metrics.browsers).map(([browser, count]) => (
                  <div className="ti-row" key={browser}>
                    <span className="ti-key">
                      {browser.charAt(0).toUpperCase() + browser.slice(1)}
                    </span>
                    <span className="ti-value">{count}</span>
                  </div>
                ))
              )}
            </div>
          </AdminCard>
        </div>

        {/* ============================================================
            PLACEHOLDER CARDS (optional: connect later)
        ============================================================ */}

        <div className="lgc-card-wrapper">
          <AdminCard
            title="Top Searched Product"
            subtitle="Future data source"
            value="Coming Soon"
            delta=""
            deltaTone="neutral"
            icon={<Search size={20} />}
            accent="purple"
            expandable
          >
            <p>Integrate with /search analytics endpoint.</p>
          </AdminCard>
        </div>

        <div className="lgc-card-wrapper">
          <AdminCard
            title="Top Brand Interest"
            subtitle="Future data source"
            value="Coming Soon"
            icon={<Star size={20} />}
            accent="blue"
            expandable
          >
            <p>Connect brand tracking next.</p>
          </AdminCard>
        </div>

        <div className="lgc-card-wrapper">
          <AdminCard
            title="Total Sales (Real Data Soon)"
            subtitle="Will sync with orders API"
            value="—"
            icon={<TrendingUp size={20} />}
            accent="green"
            expandable
          >
            <p>Hook to /admin/sales weekly reports later.</p>
          </AdminCard>
        </div>

        <div className="lgc-card-wrapper">
          <AdminCard
            title="Engagement Metrics"
            subtitle="Avg page time, bounce rate"
            value="—"
            icon={<Clock size={20} />}
            accent="amber"
            expandable
          >
            <p>Integrate after session-page tracking.</p>
          </AdminCard>
        </div>

        <div className="lgc-card-wrapper">
          <AdminCard
            title="Click-Through Rate"
            subtitle="Future CTR tracking endpoint"
            value="—"
            icon={<MousePointerClick size={20} />}
            accent="purple"
            expandable
          >
            <p>Enable CTR tracking from product cards.</p>
          </AdminCard>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
