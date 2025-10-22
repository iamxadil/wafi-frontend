import React from "react";
import { useArchiveQuery, useRestoreOrder } from "../../../hooks/useArchiveQuery.jsx";
import useArchiveStore from "../../../stores/useArchiveStore.jsx";
import { Table, Button, Group, Badge, Tooltip, Card, SimpleGrid, Text } from "@mantine/core";
import Pagination from '../../../main/Pagination.jsx';
import OrderDetailsModal from '../layouts/OrderDetailsModal.jsx';
import useOrderStore from "../../../stores/useOrderStore.jsx";
import useWindowWidth from "../../../hooks/useWindowWidth.jsx";

const ArchiveFields = () => {

  // Zustand
  const params = useArchiveStore((state) => state.archiveParams);
  const setParams = useArchiveStore((state) => state.setArchiveParams);
  const setSelectedOrder = useOrderStore((state) => state.setSelectedOrder);

  // Queries 
  const restoreOrder = useRestoreOrder();
  const { data, isLoading } = useArchiveQuery(params);

  // Normalization
  const orders = data?.orders || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };
  const width = useWindowWidth();

  const statusColors = {
    waiting: 'yellow',
    packaging: 'blue',
    'on the way': 'cyan',
    delivered: 'green',
    cancelled: 'red',
    refunded: 'gray',
  };

  // Functions
  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setParams({ page });
  };

  // Handle loading
  if (isLoading) return <p>Loading...</p>;

  // Table rows for large screens
  const tableRows = orders.length
    ? orders.map((order) => (
        <Table.Tr key={order._id}>
          <Table.Td>{order.orderNumber}</Table.Td>
          <Table.Td>{order.user?.name || "Guest"}</Table.Td>
          <Table.Td>
            <Tooltip 
              label={order.deliveredAt ? `Delivered at: ${new Date(order.deliveredAt).toLocaleString()}` : 'Not delivered yet'}
            >
              <Badge color={statusColors[order.status?.toLowerCase()] || 'gray'} variant="outline">
                {order.status || 'Unknown'}
              </Badge>
            </Tooltip>
          </Table.Td>  
          <Table.Td style={{fontWeight: "800"}}>
            {order.totalPrice.toLocaleString()} IQD
          </Table.Td>
          <Table.Td>
            <Group gap="sm">
              <Button variant="outline" color="green" onClick={() => setSelectedOrder(order)}>Details</Button>
              <Button variant="outline" onClick={() => { console.log("Restoring order", order._id); restoreOrder.mutate(order._id) }}>
                Restore
              </Button>
            </Group>
          </Table.Td>
        </Table.Tr>
      ))
    : [
        <Table.Tr key="empty">
          <Table.Td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
            No archived orders found.
          </Table.Td>
        </Table.Tr>,
      ];

  // Card layout for small screens
  const cardItems = orders.length
    ? orders.map((order) => (
        <Card key={order._id} shadow="sm" padding="md" radius="md" withBorder mb="md" style={{background: "var(--background)"}}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text weight={500} color="var(--text)">{order.orderNumber}</Text>
          <Tooltip
            label={order.deliveredAt ? `Delivered at: ${new Date(order.deliveredAt).toLocaleString()}` : 'Not delivered yet'}
          >
            <Badge variant="gradient" gradient={{ from: statusColors[order.status?.toLowerCase()] || 'gray', to: 'dark' }}>
              {order.status || 'Unknown'}
            </Badge>
          </Tooltip>
        </div>

          <Text size="sm" color="var(--line-clr)">{order.user?.name || "Guest"}</Text>
          <Text size="sm" mt="xs" style={{ fontWeight: "700", color: "var(--text)" }}>
            {order.totalPrice.toLocaleString()} IQD
          </Text>
          <Group mt="sm" spacing="xs">
            <Button variant="outline" fullWidth size="xs" onClick={() => setSelectedOrder(order)}>Details</Button>
            <Button variant="outline" fullWidth size="xs" onClick={() => { console.log("Restoring order", order._id); restoreOrder.mutate(order._id) }}>Restore</Button>
          </Group>
        </Card>
      ))
    : <Text align="center" mt="md">No archived orders found.</Text>;

  return (
    <>
      {width > 950 ? (
        <>
          <Table striped horizontalSpacing="xl" verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Order</Table.Th>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{tableRows}</Table.Tbody>
          </Table>
          {orders.length > 0 && pagination.totalPages > 1 && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
          )}
        </>
      ) : (
        <SimpleGrid cols={1} spacing="md" >
          {cardItems}
        </SimpleGrid>
      )}

      <OrderDetailsModal />
    </>
  );
};

export default ArchiveFields;
