import React, { useState } from "react";
import AdminHeader from "../AdminHeader.jsx";
import Pagination from "../../../main/Pagination.jsx";
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
  Tooltip,
} from "@mantine/core";
import {
  MoreHorizontal,
  Eye,
  Mail,
  Shield,
  CheckCircle2,
  XCircle,
  Ban,
  Trash2,
  User,
} from "lucide-react";
import useWindowWidth from "../../../hooks/useWindowWidth.jsx";
import {
  useUsersQuery,
  useBanUser,
  useDeleteUser,
} from "../../../hooks/useManageUser.jsx";
import { useManageUsersStore } from "../../../stores/useManageUsersStore.jsx";
import UserDetailsModal from "../modals/UsersModal.jsx";
import ConfirmModal from "../../../main/ConfirmModal.jsx";
import BanModal from "../modals/BanModal.jsx";
import RolesModal from "../modals/RolesModal.jsx";

/* ============================================================
   🎨 STATUS LOGIC
============================================================ */
const getUserStatus = (user) => {
  if (user.isBanned && user.isVerified)
    return { label: "Banned (Verified)", color: "red", Icon: Ban };
  if (user.isBanned && !user.isVerified)
    return { label: "Banned (Unverified)", color: "red", Icon: Ban };
  if (user.isVerified)
    return { label: "Verified", color: "green", Icon: CheckCircle2 };
  return { label: "Not Verified", color: "gray", Icon: XCircle };
};

/* ============================================================
   MAIN COMPONENT
============================================================ */
const Users = () => {
  const width = useWindowWidth();
  const isMobile = width < 750;

  // Zustand store
  const {
    params,
    setParams,
    selectedUsers,
    selectUser,
    selectAllUsers,
    deselectAllUsers,
    activeUser,
    setActiveUser,
    clearActiveUser,
  } = useManageUsersStore();

  // React Query
  const { data, isLoading, isError } = useUsersQuery(params);
  const users = data?.users || [];
  const pagination = data?.pagination || {};

  // Mutations
  const banMutation = useBanUser();
  const deleteMutation = useDeleteUser();

  // Modals
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [rolesModalOpen, setRolesModalOpen] = useState(false);

  /* ============================================================
     🧠 ACTION HANDLERS
  ============================================================= */
  const handleOpenModal = (user) => {
    setActiveUser(user);
    setDetailsOpened(true);
  };
  const handleCloseModal = () => {
    clearActiveUser();
    setDetailsOpened(false);
  };

  const handleBanClick = (user) => {
    setTargetUser(user);
    if (user.isBanned) {
      banMutation.mutate(
        { userId: user._id, action: "unban" },
        {
          onSuccess: () => {
            setTimeout(() => setTargetUser(null), 500);
          },
        }
      );
    } else {
      setBanModalOpen(true);
    }
  };

  const handleDeleteClick = (user) => {
    setTargetUser(user);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!targetUser) return;

    deleteMutation.mutate(targetUser._id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setTargetUser(null);
      },
      onError: () => {
        setConfirmOpen(false);
        setTargetUser(null);
      },
      onSettled: () => {
        setConfirmOpen(false);
        setTargetUser(null);
      },
    });
  };

  const handleSort = (label) => {
    const map = {
      Default: "default",
      "Newest Users": "newest",
      "Oldest Users": "oldest",
      "Verified First": "verifiedFirst",
      "Banned First": "bannedFirst",
      "Unverified First": "unverifiedFirst",
    };
    setParams({ sort: map[label] || "default", page: 1 });
  };

  const allSelected = users.length > 0 && selectedUsers.length === users.length;

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
                    ? selectAllUsers(users.map((u) => u._id))
                    : deselectAllUsers()
                }
              />
            </Table.Th>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {users.map((user) => {
            const isSelected = selectedUsers.includes(user._id);
            const { label, color, Icon } = getUserStatus(user);

            return (
              <Table.Tr
                key={user._id}
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
                    onChange={() => selectUser(user._id)}
                  />
                </Table.Td>

                <Table.Td>
                  <Text fw={500} size="sm">
                    #{user._id.slice(-6)}
                  </Text>
                </Table.Td>

                <Table.Td>
                  <Text fw={500}>{user.name}</Text>
                </Table.Td>

                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {user.email || "—"}
                  </Text>
                </Table.Td>

                <Table.Td>
                  <Badge color="blue" variant="light">
                    {user.role || "User"}
                  </Badge>
                </Table.Td>

                <Table.Td>
                  <Badge
                    color={color}
                    variant="light"
                    leftSection={<Icon size={14} />}
                  >
                    {label}
                  </Badge>
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
                        onClick={() => handleOpenModal(user)}
                      >
                        View Details
                      </Menu.Item>

                      <Menu.Item
                        icon={<Shield size={14} />}
                        color="blue"
                        onClick={() => {
                          setTargetUser(user);
                          setRolesModalOpen(true);
                        }}
                      >
                        Manage Roles
                      </Menu.Item>

                      <Menu.Item
                        icon={<Ban size={14} />}
                        color={user.isBanned ? "green" : "orange"}
                        onClick={() => handleBanClick(user)}
                        disabled={banMutation.isLoading}
                      >
                        {user.isBanned ? "Unban" : "Ban"} User
                      </Menu.Item>

                      <Menu.Item
                        icon={<Mail size={14} />}
                        color="violet"
                        onClick={() =>
                          alert(`Send email to ${user.email} (coming soon)`)
                        }
                      >
                        Send Email
                      </Menu.Item>

                      <Divider />

                      <Menu.Item
                        icon={<Trash2 size={14} />}
                        color="red"
                        onClick={() => handleDeleteClick(user)}
                        disabled={deleteMutation.isLoading}
                      >
                        Delete User
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
      {users.map((user) => {
        const { label, color, Icon } = getUserStatus(user);
        return (
          <Paper
            key={user._id}
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
                {user.name}
              </Text>
              <Badge
                color={color}
                variant="filled"
                leftSection={<Icon size={13} />}
              >
                {label}
              </Badge>
            </Group>

            <Divider my="xs" />

            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <Group gap={6}>
                <User size={14} />
                <Text size="sm">{user.role}</Text>
              </Group>
              <Group gap={6}>
                <Mail size={14} />
                <Text size="sm" color="dimmed">
                  {user.email}
                </Text>
              </Group>
            </div>

            <Group justify="flex-end" mt="sm" gap="xs">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => handleOpenModal(user)}
              >
                <Eye size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color={user.isBanned ? "green" : "orange"}
                onClick={() => handleBanClick(user)}
              >
                <Ban size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handleDeleteClick(user)}
              >
                <Trash2 size={16} />
              </ActionIcon>
            </Group>
          </Paper>
        );
      })}
    </div>
  );

  /* ============================================================
     🧱 MAIN RENDER
  ============================================================= */
  return (
    <main className="adm-ct">
      <AdminHeader
        title="Users"
        breadcrumb={["Dashboard", "Users"]}
        Icon={User}
        totalCount={users.length}
        selectedCount={selectedUsers.length}
        onSelectAll={() => selectAllUsers(users.map((u) => u._id))}
        onDeselectAll={deselectAllUsers}
        onSearch={(val) => setParams({ search: val })}
        onFilterChange={(val) => setParams({ filter: val, page: 1 })}
        onSortChange={handleSort}
        filterOptions={[
          "All",
          "Verified",
          "Not Verified",
          "Banned",
          "Verified + Banned",
        ]}
        sortOptions={[
          "Default",
          "Newest Users",
          "Oldest Users",
          "Verified First",
          "Banned First",
          "Unverified First",
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "70vh",
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
            Failed to load users.
          </Text>
        ) : users.length === 0 ? (
          <Text align="center" color="dimmed">
            No users found.
          </Text>
        ) : isMobile ? (
          renderMobileCards()
        ) : (
          renderTable()
        )}

        {/* Pagination Section */}
        {pagination?.totalPages > 1 && (
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setParams({ page })}
            />
          </div>
        )}
      </Paper>

      {/* MODALS */}
      <UserDetailsModal
        opened={detailsOpened}
        onClose={handleCloseModal}
        user={activeUser}
      />
      <BanModal
        opened={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        user={targetUser}
      />
      <ConfirmModal
        key={confirmOpen ? "open" : "closed"}
        opened={confirmOpen}
        title="Confirm Delete"
        message={
          targetUser
            ? `Are you sure you want to permanently delete ${targetUser.name}?`
            : ""
        }
        onConfirm={confirmDelete}
        onClose={() => {
          setConfirmOpen(false);
          setTargetUser(null);
        }}
        loading={deleteMutation.isLoading}
      />
      <RolesModal
        opened={rolesModalOpen}
        onClose={() => setRolesModalOpen(false)}
        user={targetUser}
      />
    </main>
  );
};

export default Users;
