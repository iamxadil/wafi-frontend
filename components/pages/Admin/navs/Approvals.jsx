import React, { useState, useEffect } from "react";
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
} from "@mantine/core";
import {
  CheckCircle2,
  MoreHorizontal,
  Trash2,
  Eye,
  PackageOpen,
  Tag,
  Layers,
  BookCheck
} from "lucide-react";
import Pagination from "../../../main/Pagination.jsx";
import AdminHeader from "../AdminHeader.jsx";
import useWindowWidth from "../../../hooks/useWindowWidth.jsx";
import useProductStore from "../../../stores/useProductStore.jsx";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";

/* ==========================================================
   ✅ MAIN COMPONENT
========================================================== */
const Approvals = () => {
  const width = useWindowWidth();
  const isMobile = width < 800;

  const {
    products,
    fetchProducts,
    setProductApproval,
    deleteSingleProduct,
  } = useProductStore();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const [params, setParams] = useState({ page: 1, limit: 8 });
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const load = async () => {
    setLoading(true);
-   await fetchProducts("", "", {}, params.page, params.limit, "true");
+   await fetchProducts("", "", {}, params.page, params.limit, "false");
    setLoading(false);
  };
  load();
}, [params.page, params.limit, fetchProducts]);


  const pendingProducts = products.filter((p) => !p.approved);
  const totalPages = Math.ceil(pendingProducts.length / params.limit);

  const handleApprove = async (id) => {
    try {
      setApprovingId(id);
      await setProductApproval(id, "approve");
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteSingleProduct(id);
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    open();
  };

  const toggleSelect = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const selectAll = () =>
    setSelectedProducts(pendingProducts.map((p) => p.id));
  const deselectAll = () => setSelectedProducts([]);
  const allSelected =
    pendingProducts.length > 0 &&
    selectedProducts.length === pendingProducts.length;

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
            <Table.Th style={{ width: "40px" }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) =>
                  e.target.checked ? selectAll() : deselectAll()
                }
              />
            </Table.Th>
            <Table.Th>Image</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Brand</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {pendingProducts
            .slice(
              (params.page - 1) * params.limit,
              params.page * params.limit
            )
            .map((p) => {
              const isSelected = selectedProducts.includes(p.id);
              return (
                <Table.Tr
                  key={p.id}
                  style={{
                    background: isSelected
                      ? "rgba(var(--accent-rgb),0.08)"
                      : "transparent",
                    transition: "background 0.25s ease",
                  }}
                >
                  <Table.Td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </Table.Td>
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
                      <Text size="xs" color="dimmed">
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
                    <Text fw={600} color="var(--accent-clr)">
                      {p.price.toLocaleString()} IQD
                    </Text>
                  </Table.Td>

                  <Table.Td style={{ textAlign: "center" }}>
                    <Menu shadow="md" width={160}>
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
                          icon={<CheckCircle2 size={14} />}
                          onClick={() => handleApprove(p.id)}
                          disabled={approvingId === p.id}
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
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
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

  /* ==========================================================
     📱 MOBILE CARDS
  ========================================================== */
  const renderMobileCards = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {pendingProducts
        .slice((params.page - 1) * params.limit, params.page * params.limit)
        .map((p) => (
          <Card
            key={p.id}
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
            <Image
              src={p.images?.[0]}
              alt={p.name}
              height={180}
              fit="contain"
            />
            <Group mt="sm" justify="space-between">
              <Text fw={600} color="var(--accent-clr)">
                {p.price.toLocaleString()} IQD
              </Text>
              <Badge color="violet">{p.brand}</Badge>
            </Group>

            <Group justify="flex-end" mt="sm" gap="xs">
              <ActionIcon
                color="blue"
                variant="subtle"
                onClick={() => handleApprove(p.id)}
                loading={approvingId === p.id}
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
                onClick={() => handleDelete(p.id)}
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
        selectedCount={selectedProducts.length}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
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
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <Loader color="blue" />
          </div>
        ) : pendingProducts.length === 0 ? (
          <Text align="center" color="dimmed">
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
            onPageChange={(page) => setParams((p) => ({ ...p, page }))}
          />
        </div>
      )}

      {/* 🔍 Modal View */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedProduct?.name}
        size="lg"
        centered
        styles={{
          content: { backgroundColor: "var(--background)", color: "var(--text)" },
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

export default Approvals;
