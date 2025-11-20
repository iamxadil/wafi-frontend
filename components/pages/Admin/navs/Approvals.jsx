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
  Button,
} from "@mantine/core";

import {
  CheckCircle2,
  MoreHorizontal,
  Trash2,
  Eye,
  BookCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Pagination from "../../../main/Pagination.jsx";
import AdminHeader from "../AdminHeader.jsx";
import useWindowWidth from "../../../hooks/useWindowWidth.jsx";
import { useDisclosure } from "@mantine/hooks";

import {
  useApprovalsQuery,
  useSetApprove,
} from "../../../hooks/useApprovalsQuery.jsx";

import PreviewProductModal from "../modals/PreviewModal.jsx";
import useApprovalsStore from "../../../stores/useApprovalsStore.jsx";

/* ==========================================================
   MAIN COMPONENT
========================================================== */
const Approvals = () => {
  const width = useWindowWidth();
  const isMobile = width < 800;

  const { params, setParams } = useApprovalsStore();

  // modal state
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  // queries
  const { data: pendingProducts = [], isLoading, isError } = useApprovalsQuery();
  const { mutate: handleProductAction, isPending } = useSetApprove();

  /* ==========================================================
     PAGINATION
  ========================================================== */
  const paginatedProducts = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    const end = params.page * params.limit;
    return pendingProducts.slice(start, end);
  }, [pendingProducts, params.page, params.limit]);

  const totalPages = Math.ceil(pendingProducts.length / params.limit);

  /* ==========================================================
     ACTION HANDLERS
  ========================================================== */
  const handleApprove = (id) =>
    handleProductAction({ id, action: "approve" });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      handleProductAction({ id, action: "delete" });
    }
  };

  const handleOpenModal = (index) => {
    setSelectedIndex(index);
    open();
  };

  const handleNext = () => {
    if (selectedIndex < paginatedProducts.length - 1)
      setSelectedIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (selectedIndex > 0)
      setSelectedIndex((i) => i - 1);
  };

  /* ==========================================================
     APPROVE ALL BUTTON
  ========================================================== */
  const handleApproveAll = () => {
    if (!pendingProducts.length) return;
    if (!window.confirm(`Approve ALL ${pendingProducts.length} products?`)) return;

    pendingProducts.forEach((p) =>
      handleProductAction({ id: p._id, action: "approve" })
    );
  };

  /* ==========================================================
     TABLE VIEW (DARK/LIGHT THEMED)
  ========================================================== */
  const renderTable = () => (
    <ScrollArea>
      <Table
        verticalSpacing="sm"
        horizontalSpacing="md"
        style={{
          borderCollapse: "separate",
          borderSpacing: "0 8px",
          color: "var(--text)",
        }}
      >
        <Table.Thead>
          <Table.Tr
            style={{
              background: "var(--background)",
              borderBottom: "1px solid var(--line-clr)",
            }}
          >
            <Table.Th style={{ color: "var(--text)" }}>Image</Table.Th>
            <Table.Th style={{ color: "var(--text)" }}>Name</Table.Th>
            <Table.Th style={{ color: "var(--text)" }}>Category</Table.Th>
            <Table.Th style={{ color: "var(--text)" }}>Brand</Table.Th>
            <Table.Th style={{ color: "var(--text)" }}>Price</Table.Th>
            <Table.Th style={{ textAlign: "center", color: "var(--text)" }}>
              Actions
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {paginatedProducts.map((p, idx) => (
            <Table.Tr
              key={p._id}
              style={{
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(8px)",
                border: "1px solid var(--line-clr)",
                color: "var(--text)",
              }}
            >
              <Table.Td>
                {p.images?.[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    width={50}
                    height={50}
                    fit="contain"
                    radius="sm"
                  />
                ) : (
                  <Text size="xs" style={{ color: "var(--secondary-text-clr)" }}>
                    No Image
                  </Text>
                )}
              </Table.Td>

              <Table.Td><Text style={{ color: "var(--text)" }}>{p.name}</Text></Table.Td>

              <Table.Td>
                <Badge
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "var(--text)",
                    border: "1px solid var(--line-clr)",
                  }}
                >
                  {p.category}
                </Badge>
              </Table.Td>

              <Table.Td>
                <Badge
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "var(--text)",
                    border: "1px solid var(--line-clr)",
                  }}
                >
                  {p.brand}
                </Badge>
              </Table.Td>

              <Table.Td>
                <Text fw={600} style={{ color: "var(--accent-clr)" }}>
                  {p.price?.toLocaleString()} IQD
                </Text>
              </Table.Td>

              <Table.Td style={{ textAlign: "center" }}>
                <Menu shadow="md" width={160}>
                  <Menu.Target>
                    <ActionIcon
                      radius="xl"
                      variant="light"
                      style={{
                        border: "1px solid var(--line-clr)",
                        background: "rgba(255,255,255,0.04)",
                        color: "var(--text)",
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--line-clr)",
                    }}
                  >
                    <Menu.Item
                      leftSection={<CheckCircle2 size={14} />}
                      onClick={() => handleApprove(p._id)}
                      style={{ color: "var(--text)" }}
                    >
                      Approve
                    </Menu.Item>

                    <Menu.Item
                      leftSection={<Eye size={14} />}
                      onClick={() => handleOpenModal(idx)}
                      style={{ color: "var(--text)" }}
                    >
                      View Details
                    </Menu.Item>

                    <Menu.Item
                      leftSection={<Trash2 size={14} />}
                      onClick={() => handleDelete(p._id)}
                      style={{ color: "red" }}
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
     MOBILE CARDS (THEMED)
  ========================================================== */
  const renderMobileCards = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {paginatedProducts.map((p, idx) => (
        <Card
          key={p._id}
          withBorder
          shadow="sm"
          radius="md"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--line-clr)",
            color: "var(--text)",
          }}
        >
          <Group justify="space-between">
            <Text fw={600} style={{ color: "var(--text)" }}>
              {p.name}
            </Text>
            <Badge
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "var(--text)",
                border: "1px solid var(--line-clr)",
              }}
            >
              {p.category}
            </Badge>
          </Group>

          <Image src={p.images?.[0]} alt={p.name} height={180} fit="contain" />

          <Group mt="sm" justify="space-between">
            <Text fw={600} style={{ color: "var(--accent-clr)" }}>
              {p.price?.toLocaleString()} IQD
            </Text>
            <Badge
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "var(--text)",
                border: "1px solid var(--line-clr)",
              }}
            >
              {p.brand}
            </Badge>
          </Group>

          <Group justify="flex-end" mt="sm" gap="xs">
            <ActionIcon
              variant="light"
              onClick={() => handleApprove(p._id)}
              style={{
                color: "var(--accent-clr)",
                border: "1px solid var(--line-clr)",
                background: "transparent",
              }}
            >
              <CheckCircle2 size={16} />
            </ActionIcon>

            <ActionIcon
              variant="light"
              onClick={() => handleOpenModal(idx)}
              style={{
                color: "var(--text)",
                border: "1px solid var(--line-clr)",
                background: "transparent",
              }}
            >
              <Eye size={16} />
            </ActionIcon>

            <ActionIcon
              variant="light"
              onClick={() => handleDelete(p._id)}
              style={{
                color: "red",
                border: "1px solid var(--line-clr)",
                background: "transparent",
              }}
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Group>
        </Card>
      ))}
    </div>
  );

  /* ==========================================================
     RENDER MAIN
  ========================================================== */
  return (
    <main className="adm-ct">
      <AdminHeader
        title="Pending Approvals"
        breadcrumb={["Dashboard", "Approvals"]}
        Icon={BookCheck}
        totalCount={pendingProducts.length}
        rightSection={
          pendingProducts.length > 0 && (
            <Button
              leftSection={<CheckCircle2 size={16} />}
              onClick={handleApproveAll}
              style={{
                background: "var(--accent-clr)",
                color: "#fff",
                borderRadius: 10,
              }}
            >
              Approve All
            </Button>
          )
        }
      />

      <Paper
        shadow="sm"
        radius="md"
        p="lg"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--line-clr)",
          color: "var(--text)",
        }}
      >
        {isLoading ? (
          <CenterLoader />
        ) : isError ? (
          <ErrorMessage />
        ) : pendingProducts.length === 0 ? (
          <Text align="center" style={{ color: "var(--secondary-text-clr)" }}>
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

      {/* FULL PREVIEW MODAL */}
      <PreviewProductModal
        opened={opened}
        close={close}
        product={paginatedProducts[selectedIndex]}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={selectedIndex < paginatedProducts.length - 1}
        hasPrev={selectedIndex > 0}
      />
    </main>
  );
};

/* Helper Components */
const CenterLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
    <Loader color="var(--accent-clr)" />
  </div>
);

const ErrorMessage = () => (
  <Text align="center" style={{ color: "red" }}>
    Failed to load pending approvals ❌
  </Text>
);

export default Approvals;
