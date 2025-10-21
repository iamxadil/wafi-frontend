import React from "react";
import {useArchiveQuery, useRestoreOrder } from "../components/hooks/useArchiveQuery.jsx";
import useArchiveStore from "../components/stores/useArchiveStore.jsx";
import { Table, Button, Group } from "@mantine/core";
import Pagination from '../components/main/Pagination.jsx';

const Static = () => {


  //Zustand
  const params = useArchiveStore((state) => state.archiveParams);
  const setParams = useArchiveStore((state) => state.setArchiveParams);

  //Queries 
  const restoreOrder = useRestoreOrder();
  const { data, isLoading } = useArchiveQuery(params);


  //Normaliziation
  const orders = data?.orders || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };
  
  //Functions
   const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setParams({ page });
  };

  // ✅ Build all table rows here
  const rows = orders.length
    ? orders.map((order) => (
        <Table.Tr key={order._id}>
          <Table.Td><input  type="checkbox"/></Table.Td>
          <Table.Td>{order.orderNumber}</Table.Td>
          <Table.Td>{order.user?.name}</Table.Td>
          <Table.Td>{order.status}</Table.Td>
          <Table.Td color="red">{order.totalPrice.toLocaleString()} IQD</Table.Td>
          <Table.Td>
            <Group gap="sm">
            <Button variant="outline" color="green">Details</Button>
            <Button 
              variant="gradient"
              
              onClick={() => {console.log("Restoring order", order._id); restoreOrder.mutate(order._id)}}>
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

  // ✅ Handle loading before table
  if (isLoading) return <p>Loading...</p>;

  return (
    <>
    <Table
      striped
      horizontalSpacing="lg"
      verticalSpacing="sm"
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Select</Table.Th>
          <Table.Th>Order</Table.Th>
          <Table.Th>Customer</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Total</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>{rows}</Table.Tbody>
    </Table>

      {orders.length > 0 && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
    
  );
};

export default Static;
