import React, { useState } from "react";
import AdminHeader from "../AdminHeader.jsx";
import Pagination from "../../../main/Pagination.jsx";
import {
  BringToFront,
  MoreHorizontal,
  Archive,
  RefreshCcw,
  Eye,
  Store,
  Truck,
  Box,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Handshake,
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
  Checkbox,
  Group,
  Divider,
} from "@mantine/core";
import useWindowWidth from "../../../hooks/useWindowWidth.jsx";
import OrdersModal from "../modals/OrdersModal.jsx";
import StatusModal from "../modals/StatusModal.jsx";
import {
  useOrdersQuery,
  useUpdateOrderStatus,
  useArchiveOrder,
} from "../../../hooks/useManageOrders.jsx";
import { useManageOrdersStore } from "../../../stores/useManageOrdersStore.jsx";

/* ============================================================
   🎨 STATUS COLORS
============================================================ */
const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
    case "Picked-Up":
      return "green";
    case "Packaging":
      return "yellow";
    case "On the way":
      return "blue";
    case "Canceled":
      return "red";
    case "Refunded":
      return "orange";
    default:
      return "gray";
  }
};

/* ============================================================
   MAIN COMPONENT
============================================================ */
const Orders = () => {
  const width = useWindowWidth();
  const isMobile = width < 750;

  // Zustand store
  const {
    params,
    setParams,
    selectedOrders,
    selectOrder,
    selectAllOrders,
    deselectAllOrders,
    activeOrder,
    setActiveOrder,
    clearActiveOrder,
  } = useManageOrdersStore();

  // React Query hooks
  const { data, isLoading, isError } = useOrdersQuery(params);
  const updateStatus = useUpdateOrderStatus();
  const archiveOrder = useArchiveOrder();

  const orders = data?.orders || [];
  const pagination = data?.pagination || {};

  // Modals
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [statusOpened, setStatusOpened] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Handlers
  const handleOpenModal = (order) => {
    setActiveOrder(order);
    setDetailsOpened(true);
  };

  const handleCloseModal = () => {
    clearActiveOrder();
    setDetailsOpened(false);
  };

  const handleStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusOpened(true);
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedOrder?._id) return;
    updateStatus.mutate({ id: selectedOrder._id, status: newStatus });
    setStatusOpened(false);
  };

  const handleArchive = (order) => {
    if (!window.confirm(`Archive order ${order.orderNumber}?`)) return;
    archiveOrder.mutate(order._id);
  };

const handleSort = (label) => {
  const map = {
    Default: "default",
    "Newest Orders": "newest",
    "Oldest Orders": "oldest",
    "Highest Value": "highValue",
    "Lowest Value": "lowValue",
    "Recently Updated": "recentlyUpdated",
    "Pending First": "pendingFirst",
    "Delivered First": "deliveredFirst",
  };

  const sort = map[label] || "default";
  setParams({ sort, page: 1 });
};



  const allSelected = orders.length > 0 && selectedOrders.length === orders.length;

  /* ============================================================
     🧱 DESKTOP TABLE
  ============================================================= */
  const renderTable = () => (
    <ScrollArea>
      <Table
        highlightOnHover
        verticalSpacing="sm"
        horizontalSpacing="md"
        style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: "40px" }}>
              <Checkbox
                checked={allSelected}
                onChange={(e) =>
                  e.currentTarget.checked
                    ? selectAllOrders(orders.map((o) => o._id))
                    : deselectAllOrders()
                }
              />
            </Table.Th>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {orders.map((order) => {
            const isSelected = selectedOrders.includes(order._id);
            const color = getStatusColor(order.status);
            return (
              <Table.Tr
                key={order._id}
                style={{
                  background: isSelected
                    ? "rgba(59,130,246,0.08)"
                    : "transparent",
                  transition: "background 0.25s ease",
                }}
              >
                <Table.Td>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => selectOrder(order._id)}
                  />
                </Table.Td>

                <Table.Td>
                  <Text fw={500} size="sm">
                    #{order.orderNumber || order._id?.slice(-6)}
                  </Text>
                  {order.pickup && (
                    <Badge color="indigo" size="xs" variant="filled">
                      Pickup
                    </Badge>
                  )}
                </Table.Td>

                <Table.Td>
                  <Text size="sm" fw={500}>
                    {order.user?.name ||
                      order.shippingInfo?.fullName ||
                      "Guest"}
                  </Text>
                  <Text size="xs" color="dimmed">
                    {order.user?.email ||
                      order.shippingInfo?.email ||
                      "—"}
                  </Text>
                </Table.Td>

                <Table.Td>
                  <Text fw={600} color="var(--accent-clr)">
                    {order.totalPrice?.toLocaleString()} IQD
                  </Text>
                </Table.Td>

                <Table.Td>
                  <Badge color={color} variant="light">
                    {order.status || "Waiting"}
                  </Badge>
                </Table.Td>

                <Table.Td>
                  <Text size="sm" color="dimmed">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </Table.Td>

                <Table.Td style={{ textAlign: "center" }}>
                  <Menu shadow="md" width={180}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" radius="xl">
                        <MoreHorizontal size={18} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        icon={<Eye size={14} />}
                        onClick={() => handleOpenModal(order)}
                      >
                        View Details
                      </Menu.Item>
                      <Menu.Item
                        icon={<RefreshCcw size={14} />}
                        onClick={() => handleStatusModal(order)}
                      >
                        Change Status
                      </Menu.Item>
                      <Menu.Item
                        icon={<Archive size={14} />}
                        color="red"
                        onClick={() => handleArchive(order)}
                      >
                        Archive
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );

  /* ============================================================
     📱 MOBILE CARDS
  ============================================================= */
  const renderMobileCards = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {orders.map((order) => {
        const color = getStatusColor(order.status);
        const statusIcon =
          order.status === "Delivered"
            ? CheckCircle2
            : order.status === "On the way"
            ? Truck
            : order.status === "Packaging"
            ? Box
            : order.status === "Picked-Up"
            ? Handshake
            : order.status === "Canceled"
            ? XCircle
            : order.status === "Refunded"
            ? RotateCcw
            : ClipboardCheck;
        const StatusIcon = statusIcon;

        return (
          <Paper
            key={order._id}
            withBorder
            radius="md"
            p="md"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="sm">
                #{order.orderNumber}
              </Text>
              <Badge color={color} variant="filled" leftSection={<StatusIcon size={13} />}>
                {order.status}
              </Badge>
            </Group>

            {order.pickup && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#6366f1",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                <Store size={14} />
                <span>Pickup order</span>
              </div>
            )}

            <Divider my="xs" />

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Text size="sm">
                <strong>Customer:</strong> {order.user?.name || order.shippingInfo?.fullName || "Guest"}
              </Text>
              <Text size="sm" color="dimmed">
                {order.shippingInfo?.email || "—"}
              </Text>
              <Text size="sm">
                <strong>Total:</strong> {order.totalPrice?.toLocaleString()} IQD
              </Text>
              <Text size="xs" color="dimmed">
                {new Date(order.createdAt).toLocaleString()}
              </Text>
            </div>

            <Group justify="flex-end" mt="sm" gap="xs">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => handleOpenModal(order)}
              >
                <Eye size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="yellow"
                onClick={() => handleStatusModal(order)}
              >
                <RefreshCcw size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handleArchive(order)}
              >
                <Archive size={16} />
              </ActionIcon>
            </Group>
          </Paper>
        );
      })}
    </div>
  );

  /* ============================================================
     RENDER MAIN
  ============================================================= */
  return (
    <main className="adm-ct">
      <AdminHeader
        title="Orders"
        breadcrumb={["Dashboard", "Orders"]}
        Icon={BringToFront}
        totalCount={orders.length}
        selectedCount={selectedOrders.length}
        onSelectAll={() => selectAllOrders(orders.map((o) => o._id))}
        onDeselectAll={deselectAllOrders}
        onSearch={(val) => setParams({ search: val })}
        onFilterChange={(val) => setParams({ status: val === "All" ? "" : val, page: 1 })
  }
        onSortChange={handleSort}
        filterOptions={[
          "All",
          "Waiting",
          "Packaging",
          "On the way",
          "Delivered",
          "Picked-Up",
          "Canceled",
          "Refunded",
        ]}
        sortOptions={[
          "Default",
          "Newest Orders",
          "Oldest Orders",
          "Highest Value",
          "Lowest Value",
          "Recently Updated",
          "Pending First",
          "Delivered First",
        ]}
      />

      <Paper
        shadow="sm"
        radius="md"
        p="lg"
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
              padding: "2rem",
            }}
          >
            <Loader color="blue" />
          </div>
        ) : isError ? (
          <Text color="red" align="center">
            Failed to load orders.
          </Text>
        ) : orders.length === 0 ? (
          <Text align="center" color="dimmed">
            No orders found.
          </Text>
        ) : isMobile ? (
          renderMobileCards()
        ) : (
          renderTable()
        )}
      </Paper>

      {/* 🧊 Order Details Modal */}
      <OrdersModal
        opened={detailsOpened}
        onClose={handleCloseModal}
        order={activeOrder}
        
      />

      {/* ⚙️ Status Change Modal */}
      <StatusModal
        opened={statusOpened}
        onClose={() => setStatusOpened(false)}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />

      {orders.length > 0 && pagination?.totalPages > 1 && (
        <div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setParams({ page })}
          />
        </div>
      )}

    <div id="spacer" style={{width: "100%", height: "40px"}}></div>
    </main>
  );
};

export default Orders;
