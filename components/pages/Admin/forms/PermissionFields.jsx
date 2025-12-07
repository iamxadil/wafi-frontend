import React, { useEffect, useState } from "react";
import { Card, Checkbox, Row, Col, Typography } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Home, Box, ShoppingCart, Users, BarChart2, CheckCircle, Archive, Shield, Mail } from "lucide-react";
import usePermissionStore from "../../../stores/usePermissionStore.jsx";

const { Title } = Typography;

// Map permission names to icons
const permissionIcons = {
  products: <Box size={18} />,
  orders: <ShoppingCart size={18} />,
  users: <Users size={18} />,
  analytics: <BarChart2 size={18} />,
  approvals: <CheckCircle size={18} />,
  archive: <Archive size={18} />,
  permissions: <Shield size={18} />,
  emails: <Mail size={18} />
};

const PermissionFields = () => {
  const { mods, fetchMods, updateMods } = usePermissionStore();
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    fetchMods();
  }, []);

  const handleCardToggle = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleCheckboxChange = (modId, perm) => {
    const mod = mods.find((m) => m._id === modId);
    const updatedPerms = { ...mod.permissions, [perm]: !mod.permissions?.[perm] };
    updateMods(modId, updatedPerms);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2} style={{ textAlign: "left", marginBottom: "2rem", color: "var(--text)" }}>
        Manage Moderator Permissions
      </Title>

      {mods.length === 0 && <p style={{ textAlign: "center" }}>No moderators found.</p>}

      <Row gutter={[16, 16]}>
        {mods.map((mod) => (
          <Col key={mod._id} xs={24} sm={12} md={12} lg={12}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                cursor: "pointer",
                background: "none"
              }}
              onClick={() => handleCardToggle(mod._id)}
              styles={{ padding: "1rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Title level={4} style={{ margin: 0, color: "var(--text)" }}>{mod.name}</Title>
                {expandedCard === mod._id ? <ChevronUp size={20} color="var(--text)"/> : <ChevronDown size={20} color="var(--text)"/>}
              </div>

              <AnimatePresence>
                {expandedCard === mod._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden", marginTop: "1rem" }}
                  >
                    {Object.keys(permissionIcons).map((perm) => (
                      <label
                        key={perm}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 8,
                          cursor: "pointer",
                          color: "var(--text)"
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent collapse
                      >
                        <Checkbox
                          checked={mod.permissions?.[perm] || false}
                          onChange={() => handleCheckboxChange(mod._id, perm)}
                        />
                        {permissionIcons[perm]}
                        <span style={{ textTransform: "capitalize", fontWeight: 500 }}>
                          {perm}
                        </span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PermissionFields;
