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
import { EyeOff, ShieldCheck, XCircle } from "lucide-react";
import AdminHeader from "../AdminHeader";
import ProductsModal from "../modals/ProductsModal";

import { useProductsQuery, useDeleteProductMutation } from "../../../hooks/useManageProducts";
import { useManageProductsStore } from "../../../stores/useManageProductsStore";
import Pagination from "../../../main/Pagination.jsx";
import useWindowWidth from "../../../hooks/useWindowWidth.jsx";

/* ============================================================
   FRONTEND → BACKEND MAPPINGS
============================================================ */
const CATEGORY_MAP = {
  "All Products": "",
  Laptops: "Laptops",
  Keyboards: "Keyboards",
  Mice: "Mice",
  Monitors: "Monitors",
  Speakers: "Speakers",
  Bags: "Bags",
  "Cooling Pads": "Cooling Pads",
  "Mousepads & Deskpads": "Mousepads & Deskpads",
};

const SORT_MAP = {
  Default: "date-desc",
  Newest: "date-desc",
  Oldest: "date-asc",
  "A → Z": "alpha-asc",
  "Z → A": "alpha-desc",
  "Price ↑": "price-asc",
  "Price ↓": "price-desc",
};

const OPT_FILTER_MAP = {
  "In Stock": { inStock: "true" },
  "Out of Stock": { inStock: "false" },
  "Low Stock": { lowStock: "true" },
  "Hidden": { hidden: "true" },
  "Visible Only": { hidden: "false" },
};

/* ============================================================
   MAIN COMPONENT
============================================================ */
const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const {
    selectedProducts,
    selectProduct,
    selectAllProducts,
    deselectAllProducts,
    deleteProduct,
    params,
    setParams,
  } = useManageProductsStore();

  /* =======================
     FETCH DATA
  ======================= */
  const { data, isLoading, isError } = useProductsQuery(params);
  const { mutate: deleteProductAPI, isPending: isDeleting } = useDeleteProductMutation();

  const products = data?.products || [];
  const pagination = data?.pagination || {};
  const totalItems = pagination.totalItems || 0;
  const width = useWindowWidth();

  /* ============================================================
     UI HANDLERS
  ============================================================= */

  const handleSearch = (value) =>
    setParams({ ...params, search: value, page: 1 });

  const handleCategoryFilter = (label) => {
    const backend = CATEGORY_MAP[label];

    setParams({
      ...params,
      category: backend || undefined,
      page: 1,
    });
  };

  const handleSort = (label) =>
    setParams({
      ...params,
      sort: SORT_MAP[label] || "date-desc",
      page: 1,
    });

  const handleOptFilters = (selected) => {
    const updated = { inStock: undefined, lowStock: undefined };

    selected.forEach((label) => {
      const mapped = OPT_FILTER_MAP[label];
      if (mapped) Object.assign(updated, mapped);
    });

    setParams({ ...params, ...updated, page: 1, optFilters: selected });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) deselectAllProducts();
    else selectAllProducts(products.map((p) => p._id));
  };

  const handleEdit = (product = null) => {
    if (product) {
      setEditData(product);
      setIsModalOpen(true);
      return;
    }

    if (selectedProducts.length === 1) {
      const item = products.find((p) => p._id === selectedProducts[0]);
      setEditData(item);
      setIsModalOpen(true);
      return;
    }

    toast.info("Please select exactly one product to edit.");
  };

  const handleDelete = (ids) => {
    const idList = Array.isArray(ids) ? ids : selectedProducts;
    if (!idList.length) return toast.warning("No products selected.");

    if (!window.confirm(`Delete ${idList.length} product(s)?`)) return;

    deleteProductAPI(idList, {
      onSuccess: () => {
        idList.forEach((id) => deleteProduct(id));
        toast.success("Deleted successfully!");
      },
      onError: (err) => toast.error(err.response?.data?.message),
    });
  };

  const handleDeleteSingle = (id) => {
    if (!window.confirm("Delete this product?")) return;
    deleteProductAPI([id], {
      onSuccess: () => {
        deleteProduct(id);
        toast.success("Product deleted.");
      },
      onError: (err) => toast.error(err.response?.data?.message),
    });
  };

  /* ============================================================
     CARD VIEW
  ============================================================= */
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
            background: "rgba(20,20,25,0.6)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <Group position="apart" mb="xs">
            <Checkbox
              checked={selectedProducts.includes(p._id)}
              onChange={() => selectProduct(p._id)}
            />

            <Badge color={p.countInStock > 0 ? "green" : "red"} variant="light">
              {p.countInStock > 0 ? "In Stock" : "Out"}
            </Badge>

             {p.hidden && (
                  <Badge
                    size="xs"
                    variant="filled"
                    color="gray"
                    leftSection={<EyeOff size={12} />}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    Hidden
                  </Badge>
                )}
          </Group>

          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <img
              src={p.images?.[0] || "/placeholder.png"}
              style={{
                width: "100%",
                height: 220,
                objectFit: "contain",
              }}
            />
          </div>

          <Stack spacing={6}>
            <Text fw={600} color="white">{p.name}</Text>
            <Text size="sm" color="var(--accent)">
              {p.brand} • {p.category}
            </Text>

            {!p.approved && (
                  <Badge
                    size="xs"
                    variant="filled"
                    color="red"
                    leftSection={<XCircle size={12} />}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    Not Approved
                  </Badge>
                )}
            <Divider my="xs" />
            <Text fw={600} color="white">{p.price.toLocaleString()} IQD</Text>
          </Stack>

          <Group position="right" mt="sm">
            <ActionIcon onClick={() => handleEdit(p)}>
              <Edit3 size={16} />
            </ActionIcon>
            <ActionIcon onClick={() => handleDeleteSingle(p._id)} color="red">
              <Trash2 size={16} />
            </ActionIcon>
          </Group>
        </Card>
      ))}
    </div>
  );

  /* ============================================================
     TABLE VIEW
  ============================================================= */
  const renderTable = () => (
    <ScrollArea>
      <Table highlightOnHover verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
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
            <Table.Th>Img</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>SKU</Table.Th>
            <Table.Th>Qty</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Brand</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Discount</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Priority</Table.Th>
            <Table.Th>Actions</Table.Th>
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
                  style={{ width: 40, height: 40, objectFit: "contain" }}
                />
              </Table.Td>

             <Table.Td>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{p.name}</span>

                {p.hidden && (
                  <Badge
                    size="xs"
                    variant="filled"
                    color="gray"
                    leftSection={<EyeOff size={12} />}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    Hidden
                  </Badge>
                )}

                {!p.approved && (
                  <Badge
                    size="xs"
                    variant="filled"
                    color="red"
                    leftSection={<EyeOff size={12} />}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    Not Approved
                  </Badge>
                )}
              </div>
            </Table.Td>

              <Table.Td>{p.sku || "—"}</Table.Td>
              <Table.Td>{p.countInStock}</Table.Td>
              <Table.Td>{p.category}</Table.Td>
              <Table.Td>{p.brand}</Table.Td>
              <Table.Td>{p.price.toLocaleString()} IQD</Table.Td>

              <Table.Td>
                {p.discountPrice > 0 ? (
                  <Text color="teal">{p.discountPrice.toLocaleString()}</Text>
                ) : (
                  "—"
                )}
              </Table.Td>

              <Table.Td>
                <Badge color={p.countInStock > 0 ? "green" : "red"}>
                  {p.countInStock > 0 ? "In Stock" : "Out"}
                </Badge>
              </Table.Td>

              <Table.Td>{p.priority}</Table.Td>


              <Table.Td>
                <Menu shadow="md">
                  <Menu.Target>
                    <ActionIcon>
                      <MoreHorizontal />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item icon={<Edit3 />} onClick={() => handleEdit(p)}>
                      Edit
                    </Menu.Item>

                    <Menu.Item
                      icon={<Trash2 />}
                      color="red"
                      onClick={() => handleDeleteSingle(p._id)}
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

  /* ============================================================
     MAIN RETURN
  ============================================================= */
  return (
    <main className="adm-ct">
      <AdminHeader
        title="Products"
        breadcrumb={["Dashboard", "Products"]}
        Icon={Package}
        totalCount={totalItems}
        selectedCount={selectedProducts.length}
        onSearch={handleSearch}
        onAdd={() => {
          setEditData(null);
          setIsModalOpen(true);
        }}
        onEdit={() => handleEdit()}
        onDelete={() => handleDelete()}
        onFilterChange={handleCategoryFilter}
        onSortChange={handleSort}
        optFilterOptions={[
          "In Stock",
          "Out of Stock",
          "Low Stock",
          "Hidden",
          "Visible Only"
        ]}
        onOptFilterChange={handleOptFilters}
        filterOptions={Object.keys(CATEGORY_MAP)}
        isSticky={true}
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
          <Loader color="blue" style={{ display: "block", margin: "2rem auto" }} />
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

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setParams({ ...params, page })}
        />
      )}

      {isModalOpen && (
        <ProductsModal
          setIsModalOpen={setIsModalOpen}
          editData={editData}
          isEditing={!!editData}
          allProducts={products}
        />
      )}
    </main>
  );
};

export default Products;
