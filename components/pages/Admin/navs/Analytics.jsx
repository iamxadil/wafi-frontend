import React from "react";
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
import useAnalysis from "../../../query/useAnalysis.jsx";

const Analytics = () => {
  const {
    activeUsers,
    peakToday,
    avgSessionTimeToday,
    returningUsersToday,
    totalVisitsToday,
    newVisitorsToday,
    liveDelta,
    liveTone,
    devices,
    browsers,
    utm,
  } = useAnalysis();

  const formatSession = (ms) => {
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? "0" + s : s}s`;
  };

  return (
    <main id="analytics-root">
      <header className="analytics-header">
        <h1>Site Analytics Overview</h1>
        <p className="analytics-subtitle">
          Real-time insights powered by adaptive liquid-glass intelligence.
        </p>
      </header>

      <div className="analytics-gallery">
        <div className="lgc-card-wrapper">
          <AdminCard
            title="Active Users Online"
            subtitle="Current live traffic"
            value={activeUsers ?? 0}
            icon={<Users size={20} />}
            accent="green"
            status="good"
            pill="Live"
            enableCopy
            sparklineLabel="Live connections trend"
            expandable
            size="sm"
            hint="Auto-updating"
            // ⭐ USE THE VALUES FROM THE HOOK
            delta={liveDelta}
            deltaLabel="live change"
            deltaTone={liveTone}
          >
            <p>
              Peak Today: <strong>{peakToday ?? 0} users</strong>
            </p>

            <p>
              {" "}
              Avg Session Time:{" "}
              <strong>{formatSession(avgSessionTimeToday)}</strong>
            </p>

            <p>
              Returning Users:{" "}
              <strong>
                {returningUsersToday ?? 0} returning •{" "}
                {totalVisitsToday
                  ? Math.round((returningUsersToday / totalVisitsToday) * 100)
                  : 0}
                %
              </strong>
            </p>

            <p>
              New Visitors Today: <strong>{newVisitorsToday ?? 0}</strong>
            </p>
            <p>
              Total Visits Today: <strong>{totalVisitsToday ?? 0}</strong>
            </p>
          </AdminCard>
        </div>

        <div className="lgc-card-wrapper">
          <AdminCard
            title="Traffic Insights"
            subtitle="Sources, devices & browser distribution"
            value="Overview"
            delta=""
            deltaLabel=""
            deltaTone="neutral"
            icon={<Activity size={20} />}
            accent="blue"
            status="good"
            expandable
            size="auto"
            hint="Updated in real time"
            badges={[{ text: "Live", color: "blue" }]}
          >
            {/* UTM SECTION */}
            <div className="ti-section">
              <h4 className="ti-heading">UTM Sources</h4>

              {Object.keys(utm).length === 0 && (
                <p className="ti-empty">No UTM data available yet</p>
              )}

              {Object.entries(utm).map(([source, count]) => (
                <div className="ti-row" key={source}>
                  <span className="ti-key">{source}</span>
                  <span className="ti-value">{count}</span>
                </div>
              ))}
            </div>

            <div className="ti-divider"></div>

            {/* DEVICES SECTION */}
            <div className="ti-section">
              <h4 className="ti-heading">Devices</h4>

              {Object.keys(devices).length === 0 && (
                <p className="ti-empty">No device data yet</p>
              )}

              {Object.entries(devices).map(([dev, count]) => (
                <div className="ti-row" key={dev}>
                  <span className="ti-key">
                    {dev.charAt(0).toUpperCase() + dev.slice(1)}
                  </span>
                  <span className="ti-value">{count}</span>
                </div>
              ))}
            </div>

            <div className="ti-divider"></div>

            {/* BROWSERS SECTION */}
            <div className="ti-section">
              <h4 className="ti-heading">Browsers</h4>

              {Object.keys(browsers).length === 0 && (
                <p className="ti-empty">No browser data yet</p>
              )}

              {Object.entries(browsers).map(([browser, count]) => (
                <div className="ti-row" key={browser}>
                  <span className="ti-key">
                    {browser.charAt(0).toUpperCase() + browser.slice(1)}
                  </span>
                  <span className="ti-value">{count}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* ============================================================
            TOP SEARCHED PRODUCT
        ============================================================ */}
        <div className="lgc-card-wrapper">
          <AdminCard
            title="Top Searched Product"
            subtitle="Organic search trends"
            value="Asus TUF A15"
            delta="+4.3%"
            deltaLabel="search interest"
            deltaTone="positive"
            icon={<Search size={20} />}
            accent="purple"
            status="good"
            badges={[{ text: "Trending", color: "purple" }]}
            hint="Search activity rising"
            expandable
            size="auto"
          >
            <p>
              Search Volume Today: <strong>143 queries</strong>
            </p>
            <p>Total Click-throughs: 512 impressions</p>
            <p>Avg Conversion: 4.3%</p>
          </AdminCard>
        </div>

        {/* ============================================================
            TOP BRAND INTEREST
        ============================================================ */}
        <div className="lgc-card-wrapper">
          <AdminCard
            title="Top Brand Interest"
            subtitle="Brand affinity ranking"
            value="Apple"
            delta="+8%"
            deltaLabel="brand growth"
            deltaTone="positive"
            icon={<Star size={20} />}
            accent="blue"
            status="good"
            badges={[{ text: "Brand Boost", color: "blue" }]}
            hint="High loyalty indicator"
            expandable
            size="auto"
          >
            <p>Brand Searches Today: 272</p>
            <p>Top Product: MacBook Air M2</p>
          </AdminCard>
        </div>

        {/* ============================================================
            TOP SOLD PRODUCT
        ============================================================ */}
        <div className="lgc-card-wrapper">
          <AdminCard
            title="Top Sold Product"
            subtitle="Based on today's purchases"
            value="Logitech G502"
            delta="+12.3%"
            deltaLabel="conversion rate"
            deltaTone="positive"
            icon={<ShoppingBag size={20} />}
            accent="red"
            status="good"
            badges={[{ text: "Today", color: "red" }]}
            hint="Strong performer"
            expandable
            size="auto"
          >
            <p>
              Units Sold Today: <strong>19</strong>
            </p>
            <p>Returning Buyers: 5</p>
          </AdminCard>
        </div>

        {/* ============================================================
            TOTAL SALES THIS WEEK
        ============================================================ */}
        <div className="lgc-card-wrapper">
          <AdminCard
            title="Total Sales This Week"
            subtitle="Gross revenue"
            value="12,740"
            valuePrefix="$"
            delta="+8.4%"
            deltaLabel="week over week"
            deltaTone="positive"
            icon={<TrendingUp size={20} />}
            accent="green"
            status="good"
            badges={[{ text: "Revenue", color: "green" }]}
            hint="Updated hourly"
            expandable
            size="auto"
          >
            <p>Transactions: 182</p>
            <p>Avg Order Value: $70.44</p>
            <p>Refunds: 3</p>
          </AdminCard>
        </div>

        {/* ============================================================
            AVERAGE PAGE TIME
        ============================================================ */}
        <div className="lgc-card-wrapper">
          <AdminCard
            title="Average Page Time"
            subtitle="Engagement quality"
            value="3:02"
            valueSuffix=" min"
            delta="-2%"
            deltaLabel="bounce reduction"
            deltaTone="positive"
            icon={<Clock size={20} />}
            accent="amber"
            status="good"
            badges={[{ text: "Engagement", color: "amber" }]}
            hint="Improving"
            expandable
            size="auto"
          >
            <p>Most Engaged Page: Laptops</p>
            <p>Overall Bounce Rate: 27%</p>
          </AdminCard>
        </div>

        {/* ============================================================
            CLICK-THROUGH RATE
        ============================================================ */}
        <div className="lgc-card-wrapper">
          <AdminCard
            title="Click-Through Rate"
            subtitle="User actions per view"
            value="4.8"
            valueSuffix="%"
            delta="+1.2%"
            deltaLabel="steady rise"
            deltaTone="positive"
            icon={<MousePointerClick size={20} />}
            accent="purple"
            status="good"
            badges={[{ text: "UX Metric", color: "purple" }]}
            hint="Healthy trend"
            expandable
            size="lg"
          >
            <p>Highest CTR: Accessories</p>
            <p>Lowest CTR: Networking</p>
          </AdminCard>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
