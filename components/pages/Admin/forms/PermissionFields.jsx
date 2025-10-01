import React, { useEffect, useState } from "react";
import usePermissionStore from "../../../stores/usePermissionStore";
import "../styles/permissionfields.css";

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
    <main className="permissions-page">
      <h1>Manage Moderator Permissions</h1>

      {mods.length === 0 && <p className="no-mods">No moderators found.</p>}

      <div className="permissions-grid">
        {mods.map((mod) => (
          <div
            key={mod._id}
            className={`mod-card ${expandedCard === mod._id ? "expanded" : ""}`}
          >
            <div
              className="mod-card-header"
              onClick={() => handleCardToggle(mod._id)}
            >
              <h3>{mod.name}</h3>
              <span className="arrow">{expandedCard === mod._id ? "▲" : "▼"}</span>
            </div>

            {expandedCard === mod._id && (
              <div className="mod-card-body">
                {[
                  "dashboard",
                  "products",
                  "orders",
                  "users",
                  "analytics",
                  "approvals",
                  "archive",
                  "permissions",
                ].map((perm) => (
                  <label key={perm} className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={mod.permissions?.[perm] || false}
                      onChange={() => handleCheckboxChange(mod._id, perm)}
                    />
                    {perm.charAt(0).toUpperCase() + perm.slice(1)}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default PermissionFields;
