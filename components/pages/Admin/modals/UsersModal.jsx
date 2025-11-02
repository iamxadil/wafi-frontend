import React, { useState } from "react";
import {
  Modal,
  Badge,
  Divider,
  Tooltip,
  Loader,
  Collapse,
  Group,
  Text,
  Paper,
  Grid,
} from "@mantine/core";
import {
  X,
  Clock,
  Mail,
  User,
  Shield,
  Ban,
  Trash2,
  Printer,
  Download,
  AlertTriangle,
  Activity,
  Send,
  UserCog,
  Star,
  MessageSquare,
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from "lucide-react";
import "../styles/usersmodal.css";
import BanModal from "./BanModal.jsx";
import ConfirmModal from "../../../main/ConfirmModal.jsx";
import {
  useBanUser,
  useDeleteUser,
  useUserInsightsQuery,
} from "../../../hooks/useManageUser.jsx";
import RolesModal from "./RolesModal.jsx";

const UsersModal = ({ opened, onClose, user }) => {

  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expanded, setExpanded] = useState({

    orders: true,
    favorites: false,
    reviews: false,
  });

  const banMutation = useBanUser();
  const deleteMutation = useDeleteUser();
  const { data, isLoading: loadingInsights } = useUserInsightsQuery(user?._id);

  const insights = data?.insights || {};
  const orders = data?.orders || [];
  const favorites = data?.favorites || [];
  const reviews = data?.reviews || [];

  if (!user)
    return (
      <Modal opened={opened} onClose={onClose} centered withCloseButton={false}>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>No user selected</p>
        </div>
      </Modal>
    );

  const {
    _id,
    name,
    email,
    role,
    createdAt,
    updatedAt,
    isVerified,
    isBanned,
    banReason,
    bannedAt,
    lastLogin,
  } = user;

  /* =========================================================
     🧠 ACTION HANDLERS
  ========================================================= */
  const handleBanClick = () => {
    if (isBanned) {
      banMutation.mutate(
        { userId: _id, action: "unban" },
        {
          onSuccess: () => {
            setTimeout(onClose, 400);
          },
        }
      );
    } else {
      setBanModalOpen(true);
    }
  };

  const handleDelete = () => setConfirmOpen(true);

  const confirmDelete = () => {
    deleteMutation.mutate(_id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setTimeout(onClose, 600);
      },
      onError: () => setConfirmOpen(false), // ✅ ensure modal closes on error too
    });
  };

  const toggleSection = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  /* =========================================================
     🧱 MAIN RENDER
  ========================================================= */
  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        centered
        withCloseButton={false}
        size="lg"
        yOffset="6vh"
        classNames={{ content: "umodal", body: "umodal__body" }}
      >
        {/* HEADER */}
        <header className="umodal__header">
          <div className="head-left">
            <h2>User Profile</h2>
            <div className="meta">
              <Clock size={14} /> Joined{" "}
              {new Date(createdAt).toLocaleDateString()} • Updated{" "}
              {new Date(updatedAt).toLocaleDateString()}
            </div>
          </div>
          <div className="umodal__tools">
            <Tooltip label="Print">
              <button className="iconbtn">
                <Printer size={16} />
              </button>
            </Tooltip>
            <Tooltip label="Download Info">
              <button className="iconbtn">
                <Download size={16} />
              </button>
            </Tooltip>
            <Tooltip label="Close">
              <button className="iconbtn close" onClick={onClose}>
                <X size={16} />
              </button>
            </Tooltip>
          </div>
        </header>

        {isBanned && (
          <div className="notice danger">
            <Ban size={15} />
            <span>
              <strong>Banned</strong>{" "}
              {bannedAt && (
                <>since {new Date(bannedAt).toLocaleDateString()} — </>
              )}
              <em>{banReason}</em>
            </span>
          </div>
        )}

        {/* OVERVIEW */}
        <section className="section">
          <h3>
            <User size={16} /> Overview
          </h3>
          <div className="details-grid">
            <div>
              <span>ID</span>
              <div>#{_id.slice(-6)}</div>
            </div>
            <div>
              <span>Name</span>
              <div>{name}</div>
            </div>
            <div>
              <span>Email</span>
              <div className="email-line">
                <Mail size={14} /> {email}
              </div>
            </div>
            <div>
              <span>Status</span>
              <Badge
                color={isVerified ? "green" : "red"}
                variant="light"
                radius="sm"
              >
                {isVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>
        </section>

        {/* ACCOUNT INFO */}
        <section className="section">
          <h3>
            <Shield size={16} /> Account Info
          </h3>
          <div className="details-grid">
            <div>
              <span>Role</span>
              <div style={{ textTransform: "capitalize" }}>{role}</div>
            </div>
            <div>
              <span>Last Login</span>
              <div>
                {lastLogin
                  ? new Date(lastLogin).toLocaleString()
                  : "Never logged in"}
              </div>
            </div>
            <div>
              <span>Created</span>
              <div>{new Date(createdAt).toLocaleString()}</div>
            </div>
            <div>
              <span>Updated</span>
              <div>{new Date(updatedAt).toLocaleString()}</div>
            </div>
          </div>

          {!isVerified && (
            <div className="notice warning">
              <AlertTriangle size={15} />
              <span>Account not verified</span>
            </div>
          )}
        </section>

        {/* ===================================================
            INSIGHTS SECTION
        =================================================== */}
        <section className="section insights">
          <h3>
            <Activity size={16} /> Insights
          </h3>

          {loadingInsights ? (
            <div className="center-loader">
              <Loader color="blue" />
            </div>
          ) : (
            <>
              {/* ====== Summary Cards ====== */}
              <Grid gutter="sm" mb="sm">
                <Grid.Col span={4}>
                  <Paper className="summary-card" p="md" radius="md">
                    <ShoppingBag size={18} />
                    <Text fw={700} fz="lg">
                      {insights.totalOrders}
                    </Text>
                    <Text fz="xs" c="dimmed">
                      Orders
                    </Text>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Paper className="summary-card" p="md" radius="md">
                    <Heart size={18} />
                    <Text fw={700} fz="lg">
                      {insights.totalFavorites}
                    </Text>
                    <Text fz="xs" c="dimmed">
                      Favorites
                    </Text>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Paper className="summary-card" p="md" radius="md">
                    <Star size={18} />
                    <Text fw={700} fz="lg">
                      {insights.avgRating}
                    </Text>
                    <Text fz="xs" c="dimmed">
                      Avg
                    </Text>
                  </Paper>
                </Grid.Col>
              </Grid>

              {/* ====== Orders Section ====== */}
              <div className="insight-block">
                <div
                  className="insight-header"
                  onClick={() => toggleSection("orders")}
                >
                  <Group justify="space-between">
                    <Group>
                      <ShoppingBag size={16} />
                      <Text fw={600}>
                        Orders ({orders?.length || 0})
                      </Text>
                    </Group>
                    {expanded.orders ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </Group>
                </div>
                <Collapse in={expanded.orders}>
                  {orders.length === 0 ? (
                    <Text c="dimmed" size="sm" p="xs">
                      No orders yet
                    </Text>
                  ) : (
                    orders.map((o) => (
                      <div key={o._id} className="insight-item">
                        <span>#{o.orderNumber || o._id.slice(-6)}</span>
                        <Badge
                          color={
                            o.status === "Delivered"
                              ? "green"
                              : o.status === "Canceled"
                              ? "red"
                              : "yellow"
                          }
                        >
                          {o.status}
                        </Badge>
                        <span>
                         {o.totalPrice.toLocaleString()} IQD
                        </span>
                      </div>
                    ))
                  )}
                </Collapse>
              </div>

              {/* ====== Favorites Section ====== */}
              <div className="insight-block">
                <div
                  className="insight-header"
                  onClick={() => toggleSection("favorites")}
                >
                  <Group justify="space-between">
                    <Group>
                      <Heart size={16} />
                      <Text fw={600}>
                        Favorites ({favorites?.length || 0})
                      </Text>
                    </Group>
                    {expanded.favorites ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </Group>
                </div>
                <Collapse in={expanded.favorites}>
                  {favorites.length === 0 ? (
                    <Text c="dimmed" size="sm" p="xs">
                      No favorites yet
                    </Text>
                  ) : (
                    favorites.map((p) => (
                      <div key={p._id} className="insight-item">
                        <img
                          src={p.images?.[0]}
                          alt=""
                          className="mini-thumb"
                        />
                        <span>{p.name}</span>
                        <Badge color="blue">{p.price.toLocaleString()} IQD</Badge>
                      </div>
                    ))
                  )}
                </Collapse>
              </div>

              {/* ====== Reviews Section ====== */}
              <div className="insight-block">
                <div
                  className="insight-header"
                  onClick={() => toggleSection("reviews")}
                >
                  <Group justify="space-between">
                    <Group>
                      <MessageSquare size={16} />
                      <Text fw={600}>
                        Reviews ({reviews?.length || 0})
                      </Text>
                    </Group>
                    {expanded.reviews ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </Group>
                </div>
                <Collapse in={expanded.reviews}>
                  {reviews.length === 0 ? (
                    <Text c="dimmed" size="sm" p="xs">
                      No reviews yet
                    </Text>
                  ) : (
                    reviews.map((r, i) => (
                      <div key={i} className="insight-item">
                        <span>
                          <Star size={14} color="#facc15" /> {r.rating}/5
                        </span>
                        <span>{r.productName}</span>
                        <Text size="sm" c="dimmed">
                          “{r.comment}”
                        </Text>
                      </div>
                    ))
                  )}
                </Collapse>
              </div>
            </>
          )}
        </section>

        <Divider my="md" />

        {/* ADMIN ACTIONS */}
        <section className="section admin-actions">
          <button className="btn modify" onClick={() => setRolesModalOpen(true)}>
            <UserCog size={15}/> Roles
          </button>
          <button className="btn secondary">
            <Send size={15} /> Email
          </button>
          <button
            className={`btn ${isBanned ? "success" : "warning"}`}
            onClick={handleBanClick}
            disabled={banMutation.isLoading}
          >
            <Ban size={15} /> {isBanned ? "Unban" : "Ban"}
          </button>
          <button
            className="btn danger"
            onClick={handleDelete}
            disabled={deleteMutation.isLoading}
          >
            <Trash2 size={15} /> Delete
          </button>
        </section>
      </Modal>

      {/* SUB-MODALS */}
      <BanModal
        opened={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        user={user}
      />
     <ConfirmModal
        key={confirmOpen ? "open" : "closed"}
        opened={confirmOpen}
        title="Confirm Delete"
        onConfirm={confirmDelete}
        onClose={() => {
          setConfirmOpen(false);
        }}
        loading={deleteMutation.isLoading}
      />

      <RolesModal
      opened={rolesModalOpen}
      onClose={() => setRolesModalOpen(false)}
      user={user}
    />
    </>
  );
};

export default UsersModal;
