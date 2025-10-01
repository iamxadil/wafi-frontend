import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "../../../stores/useUserStore";
import "../styles/userfields.css";

// Custom hook to detect mobile vs desktop
const useIsMobile = (breakpoint = 1250) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

const UserFormFields = () => {
  const {
    users,
    page,
    pages,
    limit,
    fetchUsers,
    setPage,
    selectedUsers,
    toggleSelectUser,
    setSelectedUsers,
  } = useUserStore();

  const selectAllRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchUsers(page, limit);
  }, [page, limit, fetchUsers]);

  // Update indeterminate state for "select all" checkbox
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedUsers.length > 0 && selectedUsers.length < users.length;
    }
  }, [selectedUsers, users]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map((u) => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => toggleSelectUser(id);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < pages) setPage(page + 1);
  };

  return (
    <div className={isMobile ? "mobile-version" : "pc-version"}>
      {/* Select All */}
      <div className="select-all-container">
        <input
          ref={selectAllRef}
          type="checkbox"
          onChange={handleSelectAll}
          checked={users.length > 0 && selectedUsers.length === users.length}
        />
        <label>Select All</label>
      </div>

      {/* Desktop Table Layout */}
      {!isMobile && (
        <div className="user-fields">
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Email</th>
                <th>Verified</th>
                <th>Joined</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users.length > 0 ? (
                  users.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.isVerified ? "Verified" : "Not Verified"}</td>
                      <td>{user.joined}</td>
                      <td>
                        {user.role
                          ? user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)
                          : ""}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      <h1>No Users Found</h1>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Card Layout */}
      {isMobile && (
        <div className="user-cards">
          <AnimatePresence>
            {users.length > 0 ? (
              users.map((user) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  layout
                  className="user-card"
                >
                  <div className="card-header">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                    <h3>{user.name}</h3>
                  </div>
                  <p>Email: {user.email}</p>
                  <p>Status: {user.isVerified ? "Verified" : "Not Verified"}</p>
                  <p>Joined: {user.joined}</p>
                  <p>
                    Role:{" "}
                    {user.role
                      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      : ""}
                  </p>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: "center", padding: "2rem" }}
              >
                <h1>No Users Found</h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-controls">
        <button onClick={handlePrev} disabled={page <= 1}>
          Previous
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button onClick={handleNext} disabled={page >= pages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UserFormFields;
