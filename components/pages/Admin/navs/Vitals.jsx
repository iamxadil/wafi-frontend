import React, { useEffect, useMemo } from "react";
import {
  Card,
  Group,
  Text,
  Title,
  SimpleGrid,
  Stack,
  Badge,
  RingProgress,
  Button,
  Tooltip,
  ThemeIcon,
} from "@mantine/core";
import {
  Activity,
  Wifi,
  MonitorSmartphone,
  RefreshCcw,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
import { useVitalsStore } from "../../../stores/useVitalsStore.jsx";
import "../styles/vitals.css";

const Vitals = () => {
  const {
    metrics,
    device,
    lastUpdated,
    trendData,
    setTrendData,
    resetVitals,
  } = useVitalsStore();

  const { INP, LCP, CLS, TTFB } = metrics;

  /* === Helper Functions === */
  const rate = (metric, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "N/A";
    if (metric === "INP") return num <= 200 ? "Good" : num <= 500 ? "Okay" : "Poor";
    if (metric === "LCP") return num <= 2500 ? "Good" : num <= 4000 ? "Okay" : "Poor";
    if (metric === "CLS") return num <= 0.1 ? "Good" : num <= 0.25 ? "Okay" : "Poor";
    if (metric === "TTFB") return num <= 800 ? "Good" : num <= 1800 ? "Okay" : "Poor";
    return "N/A";
  };

  const getColor = (status) =>
    status === "Good" ? "green" : status === "Okay" ? "yellow" : "red";

  /* === Calculate Score === */
  const performanceScore = useMemo(() => {
    let score = 100;
    Object.entries(metrics).forEach(([key, val]) => {
      const num = parseFloat(val);
      if (isNaN(num)) return;
      if (rate(key, num) === "Okay") score -= 10;
      if (rate(key, num) === "Poor") score -= 25;
    });
    return Math.max(0, Math.min(100, score));
  }, [metrics]);

  const healthLabel =
    performanceScore >= 90
      ? "Excellent"
      : performanceScore >= 70
      ? "Moderate"
      : "Needs Attention";

  /* === Health Trend Fix === */
 useEffect(() => {
  // Check if at least one metric has a value
  const hasData = Object.values(metrics).some(
    (v) => parseFloat(v) > 0 || !isNaN(parseFloat(v))
  );
  if (!hasData) return; // wait until vitals measured

  const now = new Date().toLocaleTimeString([], {
    minute: "2-digit",
    second: "2-digit",
  });

  setTrendData((prev = []) => {
    const last = prev[prev.length - 1];
    // Avoid duplicate timestamps
    if (last && last.time === now) return prev;

    const smoothed = prev.length
      ? (performanceScore + prev[prev.length - 1].score) / 2
      : performanceScore || 50; // default baseline

    return [...prev.slice(-19), { time: now, score: Math.round(smoothed) }];
  });
}, [performanceScore, metrics, setTrendData]);

  /* === Auto-update Trend every 15s (without reloading) === */
useEffect(() => {
  const interval = setInterval(() => {
    const hasData = Object.values(metrics).some(
      (v) => parseFloat(v) > 0 || !isNaN(parseFloat(v))
    );
    if (!hasData) return;
    const now = new Date().toLocaleTimeString([], {
      minute: "2-digit",
      second: "2-digit",
    });
    setTrendData((prev = []) => [
      ...prev.slice(-19),
      { time: now, score: performanceScore || 50 },
    ]);
  }, 15000);
  return () => clearInterval(interval);
}, [metrics, performanceScore, setTrendData]);

  /* === Refresh Button === */
  const handleRefresh = () => {
    resetVitals();
    setTimeout(() => window.location.reload(), 300);
  };

  /* === UI === */
  return (
    <section className="vitals-grid-page">
      {/* HEADER */}
      <div className="vitals-header">
        <div className="vitals-header-left">
          <ThemeIcon
            radius="xl"
            size="xl"
            style={{
              background: "var(--accent-clr)",
              boxShadow: "0 0 20px rgba(var(--accent-rgb), 0.4)",
            }}
          >
            <Activity size={20} color="#fff" />
          </ThemeIcon>

          <div className="vitals-header-texts">
            <Title order={2} style={{ color: "var(--text)" }}>
              Website Health
            </Title>
            <Text size="sm" style={{ color: "var(--text)" }}>
              Real-time user performance and stability overview.
            </Text>
          </div>
        </div>

        <div className="vitals-header-right">
          <Badge variant="light" color="violet" style={{ fontSize: "0.75rem" }}>
            Updated {lastUpdated || "—"}
          </Badge>
          <Tooltip label="Recalculate metrics" withArrow>
            <Button
              variant="filled"
              radius="xl"
              size="xs"
              leftSection={<RefreshCcw size={14} />}
              onClick={handleRefresh}
              style={{
                background: "var(--accent-clr)",
                color: "#fff",
                boxShadow: "0 0 10px rgba(var(--accent-rgb), 0.3)",
              }}
            >
              Refresh
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* GRID */}
      <div className="vitals-grid">
        {/* Health Score */}
        <Card withBorder radius="lg" shadow="sm" style={{ background: "var(--button-bg)", alignItems: "center" }}>
          <RingProgress
            size={130}
            thickness={14}
            roundCaps
            sections={[
              {
                value: performanceScore,
                color:
                  performanceScore >= 90
                    ? "green"
                    : performanceScore >= 70
                    ? "yellow"
                    : "red",
              },
            ]}
            label={
              <Stack gap={0} align="center">
                <Text fw={700} size="xl" style={{ color: "var(--text)" }}>
                  {performanceScore}
                </Text>
                <Text size="xs" c="dimmed" style={{ color: "var(--text)" }}>
                  Health
                </Text>
              </Stack>
            }
          />
          <Stack align="center" mt="md" gap={2}>
            <Text fw={700} size="sm" style={{ color: "var(--text)" }}>
              {healthLabel}
            </Text>
            <Text size="xs" ta="center" style={{ color: "var(--text)" }}>
              Based on real user interactions
            </Text>
          </Stack>
        </Card>

        {/* Health Trend */}
        <Card
          withBorder
          radius="lg"
          shadow="sm"
          style={{ background: "var(--button-bg)", minHeight: "200px" }}
        >
          <Group justify="space-between" mb="sm">
            <Text fw={700} style={{ color: "var(--text)" }}>
              Performance Trend
            </Text>
            <Badge
              size="xs"
              variant="dot"
              color={performanceScore >= 90 ? "green" : performanceScore >= 70 ? "yellow" : "red"}
              style={{background: "var(--button-bg)"}}
            >
              Live
            </Badge>
          </Group>
          {trendData.length > 1 ? (
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                <XAxis dataKey="time" stroke="var(--text)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text)" domain={[0, 100]} hide />
                <ChartTooltip
                  contentStyle={{
                    background: "var(--button-bg)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--accent-clr)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Text size="sm" c="dimmed" style={{ color: "var(--text)" }}>
                Gathering live performance data...
              </Text>
            </div>
          )}
        </Card>

        {/* Core Web Vitals */}
        <Card withBorder radius="lg" shadow="sm" style={{ background: "var(--button-bg)" }}>
          <Text fw={700} mb="sm" style={{ color: "var(--text)" }}>
            Core Web Vitals
          </Text>
          <SimpleGrid cols={2} spacing="sm">
            {Object.entries(metrics).map(([key, value]) => {
              const status = rate(key, value);
              const color = getColor(status);
              return (
                <Stack gap={0} key={key}>
                  <Group gap={4} justify="space-between">
                    <Text fw={600} size="sm" style={{ color: "var(--text)" }}>
                      {key}
                    </Text>
                    <Badge color={color} variant="light" size="xs">
                      {status}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed" style={{ color: "var(--text)" }}>
                    {value ? `${value}${key !== "CLS" ? " ms" : ""}` : "—"}
                  </Text>
                </Stack>
              );
            })}
          </SimpleGrid>
        </Card>

        {/* Device */}
        <Card withBorder radius="lg" shadow="sm" style={{ background: "var(--button-bg)" }}>
          <Group gap={8}>
            <ThemeIcon color="cyan" radius="xl">
              <MonitorSmartphone size={18} />
            </ThemeIcon>
            <Text fw={700} style={{ color: "var(--text)" }}>
              Device
            </Text>
          </Group>
          <Text size="sm" mt="xs" style={{ color: "var(--text)" }}>
            {device.platform || "Unknown"}
          </Text>
          <Text size="xs" c="dimmed" style={{ color: "var(--text)" }}>
            {device.userAgent?.slice(0, 45)}...
          </Text>
        </Card>

        {/* Network */}
        <Card withBorder radius="lg" shadow="sm" style={{ background: "var(--button-bg)" }}>
          <Group gap={8}>
            <ThemeIcon color="orange" radius="xl">
              <Wifi size={18} />
            </ThemeIcon>
            <Text fw={700} style={{ color: "var(--text)" }}>
              Network
            </Text>
          </Group>
          <Text size="sm" mt="xs" style={{ color: "var(--text)" }}>
            {device.connection?.effectiveType || "N/A"} —{" "}
            {device.connection?.downlink
              ? `${device.connection.downlink} Mbps`
              : "Unknown"}
          </Text>
          <Text size="xs" c="dimmed" style={{ color: "var(--text)" }}>
            Latency:{" "}
            {typeof device.connection?.rtt === "number" && device.connection.rtt > 0
              ? `${device.connection.rtt} ms`
              : "Not measurable"}
          </Text>
        </Card>
      </div>

      <div style={{ width: "100%", height: "80px" }} />
    </section>
  );
};

export default Vitals;
