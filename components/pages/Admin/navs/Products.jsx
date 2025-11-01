import React, { useState } from "react";
import {
  Paper,
  Table,
  ScrollArea,
  Text,
  Badge,
  Loader,
  Checkbox,
  Card,
  Group,
  Stack,
  Divider,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { Package, Edit3, Trash2, MoreHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import ProductsModal from "../modals/ProductsModal";
import { useProductsQuery, useDeleteProductMutation } from "../../../hooks/useManageProducts";
import { useManageProductsStore } from "../../../stores/useManageProductsStore";
import Pagination from "../../../main/Pagination.jsx";
import useWindowWidth from "../../../hooks/useWindowWidth.jsx";

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const {
    selectedProducts,
    selectProduct,
    selectAllProducts,
    deselectAllProducts,
    params,
    setParams,
  } = useManageProductsStore();

  // ✅ Queries & Mutations
  const { data, isLoading, isError } = useProductsQuery(params);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProductMutation();

  const products = data?.products || [];
  const pagination = data?.pagination || {};

  // ✅ Select all checkbox handler
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) deselectAllProducts();
    else selectAllProducts(products.map((p) => p._id));
  };

  // ✅ Edit handler
  const handleEdit = (product = null) => {
    if (product) {
      setEditData(product);
      setIsModalOpen(true);
    } else if (selectedProducts.length === 1) {
      const selected = products.find((p) => p._id === selectedProducts[0]);
      setEditData(selected);
      setIsModalOpen(true);
    } else {
      toast.info("Please select exactly one product to edit.");
    }
  };

  // ✅ Delete handler
  const handleDelete = (ids) => {
    const idList = Array.isArray(ids) ? ids : selectedProducts;
    if (idList.length === 0) return toast.warning("No products selected.");

    if (!window.confirm(`Delete ${idList.length} product${idList.length > 1 ? "s" : ""}?`))
      return;

    deleteProduct(idList, {
      onSuccess: () => {
        toast.success(
          `${idList.length > 1 ? `${idList.length} products` : "Product"} deleted successfully!`
        );
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to delete product(s).");
      },
    });
  };

  const width = useWindowWidth();

  /* ======================================================
     🪪 CARD VIEW (for width <= 1250px)
  ====================================================== */
  const renderCards = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1.5rem",
        padding: "1rem",
      }}
    >
      {products.map((p) => (
        <Card
          key={p._id}
          shadow="md"
          radius="lg"
          withBorder
          style={{
            background: "rgba(20, 20, 25, 0.6)",
            backdropFilter: "blur(14px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 6px 30px var(--accent-clr, rgba(94,99,255,0.3))";
            e.currentTarget.style.border =
              "1px solid var(--accent-clr, rgba(94,99,255,0.4))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(0, 0, 0, 0.3)";
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
          }}
        >
          {/* Header */}
          <Group position="apart" mb="xs">
            <Checkbox
              checked={selectedProducts.includes(p._id)}
              onChange={() => selectProduct(p._id)}
            />
            <Badge
              color={p.countInStock > 0 ? "green" : "red"}
              variant="light"
              size="sm"
            >
              {p.countInStock > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
          </Group>

          {/* Image */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "0.8rem",
              overflow: "hidden",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <img
              src={p.images?.[0] || "/placeholder.png"}
              alt={p.name}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "230px",
                borderRadius: "10px",
                objectFit: "contain",
                padding: "4px",
              }}
            />
          </div>

          {/* Info */}
          <Stack spacing={6}>
            <Text fw={600} size="md" style={{ color: "var(--text)" }}>
              {p.name}
            </Text>
            <Text size="sm" color="dimmed">
              {p.brand || "Unknown"} • {p.category}
            </Text>
            <Divider my="xs" color="rgba(255,255,255,0.08)" />

            <Group spacing={8}>
              <Text fw={600} size="sm" color="var(--accent-clr)">
                {p.price?.toLocaleString()} IQD
              </Text>
              {p.discountPrice > 0 && (
                <Badge color="teal" size="sm" variant="filled">
                  -{p.discountPrice.toLocaleString()} IQD
                </Badge>
              )}
            </Group>

            <Group spacing={10} mt={6}>
              <Text size="xs" color="var(--secondary-text-clr)">
                SKU: <strong>{p.sku || "—"}</strong>
              </Text>
              <Text size="xs" color="var(--secondary-text-clr)">
                Qty: <strong>{p.countInStock}</strong>
              </Text>
            </Group>
          </Stack>

          {/* Quick Actions */}
          <Group position="right" mt="sm" spacing="xs">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => handleEdit(p)}
              title="Edit Product"
            >
              <Edit3 size={16} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => handleDelete(p._id)}
              disabled={isDeleting}
              title="Delete Product"
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Group>
        </Card>
      ))}
    </div>
  );

  /* ======================================================
     🧾 TABLE VIEW (for width > 1250px)
  ====================================================== */
  const renderTable = () => (
    <ScrollArea>
      <Table
        highlightOnHover
        verticalSpacing="sm"
        horizontalSpacing="sm"
        withColumnBorders={false}
        style={{ borderCollapse: "separate", borderSpacing: "0 6px" }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: "40px" }}>
              <Checkbox
                checked={
                  selectedProducts.length === products.length &&
                  products.length > 0
                }
                indeterminate={
                  selectedProducts.length > 0 &&
                  selectedProducts.length < products.length
                }
                onChange={handleSelectAll}
              />
            </Table.Th>
            <Table.Th style={{ width: "60px" }}>Img</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>SKU</Table.Th>
            <Table.Th>Qty</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Brand</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Discount</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th style={{ width: "60px", textAlign: "center" }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {products.map((p) => (
            <Table.Tr key={p._id}>
              <Table.Td>
                <Checkbox
                  checked={selectedProducts.includes(p._id)}
                  onChange={() => selectProduct(p._id)}
                />
              </Table.Td>
              <Table.Td>
                <img
                  src={p.images?.[0] || "/placeholder.png"}
                  alt={p.name}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "contain",
                    borderRadius: "6px",
                  }}
                />
              </Table.Td>
              <Table.Td>{p.name}</Table.Td>
              <Table.Td>{p.sku || "—"}</Table.Td>
              <Table.Td>{p.countInStock}</Table.Td>
              <Table.Td>{p.category}</Table.Td>
              <Table.Td>{p.brand}</Table.Td>
              <Table.Td>{p.price?.toLocaleString()} IQD</Table.Td>
              <Table.Td>
                {p.discountPrice > 0 ? (
                  <Text fw={500} color="teal">
                    {p.discountPrice.toLocaleString()} IQD
                  </Text>
                ) : (
                  <Text color="dimmed">—</Text>
                )}
              </Table.Td>
              <Table.Td>
                <Badge
                  color={p.countInStock > 0 ? "green" : "red"}
                  variant="light"
                >
                  {p.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </Table.Td>

              {/* Quick Actions */}
              <Table.Td style={{ textAlign: "center" }}>
                <Menu shadow="md" width={160}>
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray">
                      <MoreHorizontal size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item icon={<Edit3 size={14} />} onClick={() => handleEdit(p)}>
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      icon={<Trash2 size={14} />}
                      color="red"
                      onClick={() => handleDelete(p._id)}
                      disabled={isDeleting}
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

  /* ======================================================
     MAIN RENDER
  ====================================================== */
  return (
    <main className="adm-ct" >
      <AdminHeader
        title="Products"
        breadcrumb={["Dashboard", "Products"]}
        Icon={Package}
        totalCount={products?.length || 0}
        selectedCount={selectedProducts.length}
        onSearch={(q) => console.log("Search:", q)}
        onAdd={() => {
          setEditData(null);
          setIsModalOpen(true);
        }}
        onEdit={() => handleEdit()}
        onDelete={() => handleDelete()}
        onSelectAll={() => selectAllProducts(products.map((p) => p._id))}
        onDeselectAll={() => deselectAllProducts()}
        onFilterChange={(v) => console.log("Filter:", v)}
        onSortChange={(v) => console.log("Sort:", v)}
        filterOptions={["All", "Active", "Archived", "Top"]}
        sortOptions={["Default", "Price", "Date Added", "Name"]}
      />

      <Paper
        shadow="sm"
        radius="md"
        p="lg"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(10px)",
        }}
      >
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <Loader color="blue" />
          </div>
        ) : isError ? (
          <Text color="red">Failed to load products.</Text>
        ) : products.length === 0 ? (
          <Text>No products found.</Text>
        ) : width <= 1250 ? (
          renderCards()
        ) : (
          renderTable()
        )}
      </Paper>

      {products.length > 0 && pagination?.totalPages > 1 && (
        <div style={{ paddingBottom: "5.7rem" }}>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setParams({ page })}
          />
        </div>
      )}

      {isModalOpen && (
        <ProductsModal
          setIsModalOpen={setIsModalOpen}
          editData={editData}
          isEditing={!!editData}
        />
      )}
    </main>
  );
};

export default Products;
