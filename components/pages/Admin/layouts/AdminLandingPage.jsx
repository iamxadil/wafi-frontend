import React from "react";
import {
  Card,
  Group,
  Text,
  Loader,
  Center,
  SimpleGrid,
  Stack,
  ThemeIcon,
  Badge,
  Divider,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  Users,
  ShoppingBag,
  Coins,
  Star,
  Truck,
  BarChart3,
  Sparkles,
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardStats } from "../../../hooks/useDashboardQuery.jsx";
import "../styles/adminlandingpage.css";

const MotionCard = motion(Card);

const AdminLandingPage = () => {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading)
    return (
      <Center h="80vh">
        <Loader size="lg" color="violet" />
      </Center>
    );

  if (isError)
    return (
      <Center h="80vh">
        <Text c="red" fw={600}>
          Failed to load dashboard data
        </Text>
      </Center>
    );

  const {
    usersCount = 0,
    ordersCount = 0,
    totalRevenue = 0,
    avgOrderValue = 0,
    growth = {},
    topSellingBrand = "N/A",
    revenueLast7Days = [],
    newUsersThisWeek = 4,
    newOrdersThisWeek = 7,
    newRevenueThisWeek = 3,
  } = data || {};

  const growthData = {
    users: growth.users ?? 0,
    orders: growth.orders ?? 0,
    revenue: growth.revenue ?? 0,
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const metrics = [
    {
      label: "Users",
      value: usersCount.toLocaleString(),
      delta: `+${newUsersThisWeek} this week`,
      growth: growthData.users,
      icon: Users,
      color: "#7c4dff",
    },
    {
      label: "Orders",
      value: ordersCount.toLocaleString(),
      delta: `+${newOrdersThisWeek} this week`,
      growth: growthData.orders,
      icon: ShoppingBag,
      color: "#f7971e",
    },
    {
      label: "Revenue",
      value: `${totalRevenue.toLocaleString()} IQD`,
      delta: `+${newRevenueThisWeek}% growth`,
      growth: growthData.revenue,
      icon: Coins,
      color: "#26a69a",
    },
  ];

  return (
    <>
    <section className="admin-landing refined">
      {/* HEADER */}
      <motion.header
        className="dashboard-header polished"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-left">
          <Group gap="xs" align="center" mb={4}>
            <Sparkles size={20} color="var(--accent-clr)" />
            <Text fw={800} size="1.8rem" style={{ color: "var(--text)" }}>
              Dashboard Overview
            </Text>
          </Group>
          <Text size="sm" style={{ color: "var(--text)", opacity: 0.7 }}>
            Platform insights and performance at a glance
          </Text>
        </div>

        <div className="header-right">
          <Badge
            size="sm"
            radius="xl"
            variant="light"
            color="violet"
            style={{
              background: "var(--accent-clr)",
              color: "#fff",
              boxShadow: "0 0 10px rgba(var(--accent-rgb), 0.35)",
              padding: "0.5rem 1rem",
            }}
          >
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Badge>
        </div>
      </motion.header>

      {/* MAIN METRIC CARDS */}
      <motion.div
        className="dashboard-section"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {metrics.map(({ label, value, delta, growth, icon: Icon, color }, i) => {
            const isPositive = growth >= 0;
            return (
              <MotionCard
                key={label}
                radius="lg"
                shadow="md"
                withBorder
                className="metric-card horizontal"
                style={{
                  border: `1px solid ${color}40`,
                  background: "var(--background)",
                }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3 }}
              >
                <Group align="center" justify="space-between" wrap="nowrap">
                  {/* ICON */}
                  <ThemeIcon
                    radius="lg"
                    size={42}
                    style={{
                      background: color,
                      color: "#fff",
                      boxShadow: `0 0 10px ${color}55`,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </ThemeIcon>

                  {/* INFO */}
                  <Stack gap={2} style={{ flex: 1 }}>
                    <Group align="center" gap={6}>
                      <Text fw={700} size="lg" style={{ color: "var(--text)" }}>
                        {value}
                      </Text>
                     <Badge
                        size="sm"
                        radius="sm"
                        className="metric-badge"
                        style={{
                          background: isPositive
                            ? "rgba(46, 204, 113, 0.12)"
                            : "rgba(231, 76, 60, 0.12)",
                          color: isPositive ? "#2ecc71" : "#e74c3c",
                        }}
                      >
                        {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {Math.abs(growth)}%
                      </Badge>

                    </Group>
                    <Group align="center" gap={6}>
                      <Text size="sm" style={{ color: "var(--text)", opacity: 0.75 }}>
                        {label}
                      </Text>
                      <Text size="xs" style={{ color: "var(--accent-clr)", fontWeight: 500, marginTop: "2px" }}>
                        {delta}
                      </Text>
                    </Group>
                  </Stack>
                </Group>
              </MotionCard>
            );
          })}
        </SimpleGrid>
      </motion.div>

      {/* HIGHLIGHTS SECTION */}
      <motion.div
        className="dashboard-section alt"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <Divider
          my="xl"
          label="Highlights"
          labelPosition="center"
          styles={{ label: { color: "var(--text)", fontWeight: 600 } }}
        />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          <Card radius="md" shadow="md" withBorder className="fact-card">
            <Group>
              <ThemeIcon color="yellow" radius="xl" size="lg">
                <Star size={18} />
              </ThemeIcon>
              <Stack gap={2}>
                <Text size="sm" fw={600} style={{ color: "var(--text)", opacity: 0.8 }}>
                  Top Brand
                </Text>
                <Text fw={700} style={{ color: "var(--text)" }}>
                  {topSellingBrand}
                </Text>
              </Stack>
            </Group>
          </Card>

          <Card radius="md" shadow="md" withBorder className="fact-card">
            <Group>
              <ThemeIcon color="teal" radius="xl" size="lg">
                <Activity size={18} />
              </ThemeIcon>
              <Stack gap={2}>
                <Text size="sm" fw={600} style={{ color: "var(--text)", opacity: 0.8 }}>
                  Avg Order Value
                </Text>
                <Text fw={700} style={{ color: "var(--text)" }}>
                  {avgOrderValue.toLocaleString()} IQD
                </Text>
              </Stack>
            </Group>
          </Card>

          <Card radius="md" shadow="md" withBorder className="fact-card">
            <Group>
              <ThemeIcon color="violet" radius="xl" size="lg">
                <Truck size={18} />
              </ThemeIcon>
              <Stack gap={2}>
                <Text size="sm" fw={600} style={{ color: "var(--text)", opacity: 0.8 }}>
                  Active Deliveries
                </Text>
                <Text fw={700} style={{ color: "var(--text)" }}>
                  42
                </Text>
              </Stack>
            </Group>
          </Card>
        </SimpleGrid>
      </motion.div>

      {/* REVENUE CHART */}
      <motion.div
        className="dashboard-section chart-section"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <Divider
          my="xl"
          label="Revenue Trend"
          labelPosition="center"
          styles={{ label: { color: "var(--text)", fontWeight: 600 } }}
        />

        <Card
          radius="lg"
          withBorder
          shadow="xl"
          p="lg"
          style={{
            background: "var(--background)",
            border: "1px solid rgba(var(--accent-rgb),0.2)",
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueLast7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
              <XAxis dataKey="day" stroke="var(--text)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text)",
                }}
                formatter={(v) => `${v.toLocaleString()} IQD`}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--accent-clr)"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive
                animationBegin={200}
                animationDuration={1300}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
      <div id="spacer" style={{width: "100%", height: "70px"}}></div>
    </section>
    </>
  );
};

export default AdminLandingPage;
