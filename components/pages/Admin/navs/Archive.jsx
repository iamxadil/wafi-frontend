import React, { useState } from "react";
import AdminHeader from "../AdminHeader.jsx";
import {
  MoreHorizontal,
  ArchiveRestore,
  Eye,
  PackageOpen
} from "lucide-react";
import {
  Table,
  Loader,
  Text,
  Badge,
  ScrollArea,
  Paper,
  ActionIcon,
  Menu,
  Card,
  Group,
  SimpleGrid,
  Button,
} from "@mantine/core";

import OrdersModal from "../modals/OrdersModal.jsx";
import {
  useArchiveQuery,
  useUnarchiveOrder,
} from "../../../hooks/useArchiveQuery.jsx";
import useArchiveStore from "../../../stores/useArchiveStore.jsx";
import { useManageOrdersStore } from "../../../stores/useManageOrdersStore.jsx";
import useWindowWidth from "../../../hooks/useWindowWidth.jsx";

const Archive = () => {
  // Zustand
  const { archiveParams, setArchiveParams } = useArchiveStore();
  const { activeOrder, setActiveOrder, clearActiveOrder } =
    useManageOrdersStore();

  // Queries
  const { data, isLoading, isError } = useArchiveQuery(archiveParams);
  const unarchiveOrder = useUnarchiveOrder();

  const orders = data?.orders || [];
  const width = useWindowWidth();

  // Modal state
  const [detailsOpened, setDetailsOpened] = useState(false);

  const handleOpenModal = (order) => {
    setActiveOrder(order);
    setDetailsOpened(true);
  };

  const handleCloseModal = () => {
    clearActiveOrder();
    setDetailsOpened(false);
  };

  const handleRestore = (order) => {
    if (!window.confirm(`Restore order #${order.orderNumber}?`)) return;
    unarchiveOrder.mutate(order._id);
  };

  const statusColors = {
    Waiting: "gray",
    Packaging: "yellow",
    "On the way": "blue",
    Delivered: "green",
    Canceled: "red",
  };

  /* ==========================================================
     RENDER TABLE (Desktop)
  ========================================================== */
  const renderTable = () => (
    <ScrollArea>
      <Table
        highlightOnHover
        verticalSpacing="sm"
        horizontalSpacing="md"
        withColumnBorders={false}
        style={{
          borderCollapse: "separate",
          borderSpacing: "0 8px",
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <Table.Tr key={order._id}>
                <Table.Td>
                  <Text fw={500} size="sm">
                    #{order.orderNumber || order._id?.slice(-6)}
                  </Text>
                </Table.Td>

                <Table.Td>
                  <Text size="sm" fw={500}>
                    {order.user?.name ||
                      order.shippingInfo?.fullName ||
                      "Guest"}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {order.user?.email || order.shippingInfo?.email || "—"}
                  </Text>
                </Table.Td>

                <Table.Td>
                  <Text fw={600} style={{ color: "var(--accent-clr)" }}>
                    {order.totalPrice?.toLocaleString()} IQD
                  </Text>
                </Table.Td>

                <Table.Td>
                  <Badge
                    color={statusColors[order.status] || "gray"}
                    variant="light"
                  >
                    {order.status || "Waiting"}
                  </Badge>
                </Table.Td>

                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </Table.Td>

                <Table.Td style={{ textAlign: "center" }}>
                  <Menu shadow="md" width={180}>
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        radius="xl"
                        aria-label="Actions"
                      >
                        <MoreHorizontal size={18} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<Eye size={14} />}
                        onClick={() => handleOpenModal(order)}
                      >
                        View Details
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<ArchiveRestore size={14} />}
                        onClick={() => handleRestore(order)}
                      >
                        Restore
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={6} align="center">
                <Text c="dimmed">No archived orders found.</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );

  /* ==========================================================
     RENDER CARDS (Mobile)
  ========================================================== */
  const renderCards = () =>
    orders.length > 0 ? (
      <SimpleGrid cols={1} spacing="md">
        {orders.map((order) => (
          <Card
            key={order._id}
            shadow="sm"
            padding="lg"
            radius="lg"
            withBorder
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.25s ease",
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="sm">
                #{order.orderNumber || order._id?.slice(-6)}
              </Text>
              <Badge
                color={statusColors[order.status] || "gray"}
                variant="light"
              >
                {order.status || "Waiting"}
              </Badge>
            </Group>

            <Text size="sm" fw={500}>
              {order.user?.name || order.shippingInfo?.fullName || "Guest"}
            </Text>
            <Text size="xs" c="dimmed">
              {order.user?.email || order.shippingInfo?.email || "—"}
            </Text>

            <Text mt="sm" fw={600} style={{ color: "var(--accent-clr)" }}>
              {order.totalPrice?.toLocaleString()} IQD
            </Text>

            <Text size="xs" c="dimmed" mt={4}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>

            <Group mt="md" grow>
              <Button
                variant="light"
                color="blue"
                size="xs"
                leftSection={<Eye size={14} />}
                onClick={() => handleOpenModal(order)}
              >
                View
              </Button>
              <Button
                variant="light"
                color="green"
                size="xs"
                leftSection={<ArchiveRestore size={14} />}
                onClick={() => handleRestore(order)}
              >
                Restore
              </Button>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    ) : (
      <Text align="center" c="dimmed" mt="xl">
        No archived orders found.
      </Text>
    );

  /* ==========================================================
     MAIN RENDER
  ========================================================== */
  return (
    <main className="adm-ct">
      <AdminHeader
        title="Archived Orders"
        Icon={PackageOpen}
        breadcrumb={["Dashboard", "Archive"]}
        onSearch={(val) => setArchiveParams({ search: val })}
        onFilterChange={(val) => setArchiveParams({ status: val })}
        onSortChange={(val) => setArchiveParams({ sort: val })}
        filterOptions={[
          "All",
          "Waiting",
          "Packaging",
          "On the way",
          "Delivered",
          "Canceled",
        ]}
        sortOptions={["Default", "Newest", "Oldest", "Total"]}
      />

      <Paper
        shadow="sm"
        radius="md"
        p="xl"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "3rem",
            }}
          >
            <Loader color="blue" />
          </div>
        ) : isError ? (
          <Text color="red" align="center">
            Failed to load archived orders.
          </Text>
        ) : width > 950 ? (
          renderTable()
        ) : (
          renderCards()
        )}
      </Paper>

      {/* 🧊 Order Details Modal */}
      <OrdersModal
        opened={detailsOpened}
        onClose={handleCloseModal}
        order={activeOrder}
      />
    </main>
  );
};

export default Archive;
