import React, { useMemo, useState } from "react";
import {
  Table,
  ScrollArea,
  Text,
  Loader,
  Badge,
  Paper,
  Menu,
  ActionIcon,
  Group,
  Image,
  Card,
  Modal,
} from "@mantine/core";
import {
  CheckCircle2,
  MoreHorizontal,
  Trash2,
  Eye,
  BookCheck,
} from "lucide-react";
import Pagination from "../../../main/Pagination.jsx";
import AdminHeader from "../AdminHeader.jsx";
import useWindowWidth from "../../../hooks/useWindowWidth.jsx";
import { useDisclosure } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";

import {
  useApprovalsQuery,
  useSetApprove,
} from "../../../hooks/useApprovalsQuery.jsx";

import useApprovalsStore from "../../../stores/useApprovalsStore.jsx";

/* ==========================================================
   ✅ MAIN COMPONENT
========================================================== */
const Approvals = () => {
  const width = useWindowWidth();
  const isMobile = width < 800;

  // ⛔ Removed: selected, setSelected, clearSelected
  const { params, setParams } = useApprovalsStore();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  // ✅ Fetch unapproved products
  const {
    data: pendingProducts = [],
    isLoading,
    isError,
  } = useApprovalsQuery();

  // ✅ Single mutation for approve/delete
  const { mutate: handleProductAction, isPending } = useSetApprove();

  // ✅ Pagination logic
  const paginatedProducts = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    const end = params.page * params.limit;
    return pendingProducts.slice(start, end);
  }, [pendingProducts, params.page, params.limit]);

  const totalPages = Math.ceil(pendingProducts.length / params.limit);

  /* ==========================================================
     🧠 ACTION HANDLERS
  ========================================================== */
  const handleApprove = (id) =>
    handleProductAction({ id, action: "approve" });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      handleProductAction({ id, action: "delete" });
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    open();
  };

  /* ==========================================================
     🖥️ TABLE VIEW
  ========================================================== */
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
            {/* ❌ Removed checkbox column */}
            <Table.Th>Image</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Brand</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {paginatedProducts.map((p) => (
            <Table.Tr
              key={p._id}
              style={{
                background: "transparent", // cleaned
                transition: "background 0.25s ease",
              }}
            >
              {/* ❌ Removed checkbox cell */}

              <Table.Td>
                {p.images?.[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    width={50}
                    height={50}
                    radius="sm"
                    fit="contain"
                  />
                ) : (
                  <Text size="xs" c="dimmed">
                    No Image
                  </Text>
                )}
              </Table.Td>

              <Table.Td>
                <Text fw={500}>{p.name}</Text>
              </Table.Td>

              <Table.Td>
                <Badge color="blue" variant="light">
                  {p.category}
                </Badge>
              </Table.Td>

              <Table.Td>
                <Badge color="violet" variant="light">
                  {p.brand}
                </Badge>
              </Table.Td>

              <Table.Td>
                <Text fw={600} c="var(--accent-clr)">
                  {p.price?.toLocaleString()} IQD
                </Text>
              </Table.Td>

              <Table.Td style={{ textAlign: "center" }}>
                <Menu shadow="md" width={160}>
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray" radius="xl">
                      <MoreHorizontal size={18} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      icon={<CheckCircle2 size={14} />}
                      onClick={() => handleApprove(p._id)}
                      disabled={isPending}
                    >
                      Approve
                    </Menu.Item>

                    <Menu.Item
                      icon={<Eye size={14} />}
                      onClick={() => handleOpenModal(p)}
                    >
                      View
                    </Menu.Item>

                    <Menu.Item
                      icon={<Trash2 size={14} />}
                      color="red"
                      onClick={() => handleDelete(p._id)}
                      disabled={isPending}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );

  /* ==========================================================
     📱 MOBILE CARDS
  ========================================================== */
  const renderMobileCards = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {paginatedProducts.map((p) => (
        <Card
          key={p._id}
          withBorder
          shadow="sm"
          radius="md"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Group justify="space-between" mb="xs">
            <Text fw={600}>{p.name}</Text>
            <Badge color="blue" variant="filled">
              {p.category}
            </Badge>
          </Group>

          <Image src={p.images?.[0]} alt={p.name} height={180} fit="contain" />

          <Group mt="sm" justify="space-between">
            <Text fw={600} c="var(--accent-clr)">
              {p.price?.toLocaleString()} IQD
            </Text>
            <Badge color="violet">{p.brand}</Badge>
          </Group>

          <Group justify="flex-end" mt="sm" gap="xs">
            <ActionIcon
              color="blue"
              variant="subtle"
              onClick={() => handleApprove(p._id)}
              loading={isPending}
            >
              <CheckCircle2 size={16} />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => handleOpenModal(p)}
            >
              <Eye size={16} />
            </ActionIcon>

            <ActionIcon
              color="red"
              variant="subtle"
              onClick={() => handleDelete(p._id)}
              loading={isPending}
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Group>
        </Card>
      ))}
    </div>
  );

  /* ==========================================================
     🔧 RENDER MAIN
  ========================================================== */
  return (
    <main className="adm-ct">
      <AdminHeader
        title="Pending Approvals"
        breadcrumb={["Dashboard", "Approvals"]}
        Icon={BookCheck}
        totalCount={pendingProducts.length}
        onSearch={(val) => console.log("search", val)}
        sortOptions={["Default", "Newest", "Oldest", "Price High", "Price Low"]}
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
          <CenterLoader />
        ) : isError ? (
          <ErrorMessage />
        ) : pendingProducts.length === 0 ? (
          <Text align="center" c="dimmed">
            No pending approvals 🎉
          </Text>
        ) : isMobile ? (
          renderMobileCards()
        ) : (
          renderTable()
        )}
      </Paper>

      {pendingProducts.length > 0 && totalPages > 1 && (
        <div style={{ paddingBottom: "5rem" }}>
          <Pagination
            currentPage={params.page}
            totalPages={totalPages}
            onPageChange={(page) => setParams({ page })}
          />
        </div>
      )}

      {/* 🔍 Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedProduct?.name}
        size="lg"
        centered
        styles={{
          content: {
            backgroundColor: "var(--background)",
            color: "var(--text)",
          },
          header: { backgroundColor: "var(--background)" },
          title: { color: "var(--text)" },
        }}
      >
        {selectedProduct && (
          <>
            {selectedProduct.images?.length > 0 && (
              <Carousel withIndicators height={300} loop>
                {selectedProduct.images.map((img, idx) => (
                  <Carousel.Slide key={idx}>
                    <Image
                      src={img}
                      alt={`${selectedProduct.name} ${idx + 1}`}
                      height={300}
                      fit="contain"
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            )}

            <Text mt="md">
              <strong>Description:</strong> {selectedProduct.description}
            </Text>

            <Group mt="sm">
              <Text fw={500}>Stock:</Text>
              <Badge color="pink">{selectedProduct.countInStock}</Badge>
            </Group>

            <Group mt="sm">
              <Text fw={500}>Brand:</Text>
              <Badge color="violet">{selectedProduct.brand}</Badge>
            </Group>

            <Group mt="sm">
              <Text fw={500}>SKU:</Text>
              <Badge color="blue">{selectedProduct.sku}</Badge>
            </Group>
          </>
        )}
      </Modal>
    </main>
  );
};

/* Small helper components */
const CenterLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
    <Loader color="blue" />
  </div>
);

const ErrorMessage = () => (
  <Text align="center" color="red">
    Failed to load pending approvals ❌
  </Text>
);

export default Approvals;
