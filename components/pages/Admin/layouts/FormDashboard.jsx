import React, { useEffect, useState, useRef } from "react";
import HeaderDashboard from "./HeaderDashboard.jsx";
import ProductFields from "../forms/ProductFields.jsx";
import UserFormFields from "../forms/UserFormFields.jsx";
import ApprovalFields from "../forms/ApprovalFields.jsx";
import ProductModal from "../layouts/ProductModal.jsx";
import OrderFields from '../forms/OrderFields.jsx';
import ArchiveFields from '../forms/ArchiveFields.jsx';
import UserModal from "./UserModal.jsx";
import RoleModal from "./RoleModal.jsx";
import useProductStore from "../../../stores/useProductStore.jsx";
import useUserStore from "../../../stores/useUserStore.jsx";
import "../styles/formdashboard.css";
import { toast } from "react-toastify";
import useOrderStore from "../../../stores/useOrderStore.jsx";




const FormDashboard = ({ page }) => {

  // Store States
  const { products, fetchProducts } = useProductStore();
  const totalQuantity = products.reduce(
    (sum, product) => sum + Number(product.countInStock),
    0
  );

  // Local States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToPromote, setUserToPromote] = useState(null);
  const [sort, setSort] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ category: "", brand: "" });

  // Handlers
  const handleDelete = () => {
    const { selectedItems } = useProductStore.getState();
    if (selectedItems.length === 0) {
      toast.warning("No Products Selected");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedItems.length} product(s)?`
    );
    if (confirmDelete) {
      useProductStore.getState().deleteProducts();
      toast.success("Product Deleted Successfully");
    }
  };

  const handleEdit = () => {
    const { selectedItems } = useProductStore.getState();
    if (selectedItems.length !== 1) {
      toast.warning("Please select exactly one product to edit");
      return;
    }
    const product = products.find((p) => p.id === selectedItems[0]);
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchProducts(term, sort, filters);
  };

  const handleSort = (value) => {
    setSort(value);
    fetchProducts(searchTerm, value, filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchProducts(searchTerm, sort, newFilters);
  };

  //User States!
  const {
    fetchUsers,
    users,
    selectedUsers,
    setSelectedUsers,
    updateUser,
    deleteUser,
  } = useUserStore();

  const usersPage = useUserStore((state) => state.page);
  const [searchedUsers, setSearchUsers] = useState("");  
  const [usersRole, setUsersRole] = useState("");
  const adminCount = users.filter((u) => u.role === "admin").length;



  // Promote User(s)
const handlePromoteUsers = () => {
  if (selectedUsers.length === 0) {
    toast.warning("No user selected to promote");
    return;
  }
  if (selectedUsers.length > 1) {
    toast.warning("Please select only one user to promote at a time");
    return;
  }

  const user = users.find((u) => u.id === selectedUsers[0]);
  if (!user) return;

  setUserToPromote(user);
  setIsRoleModalOpen(true); // open role modal for promotion
};

// Delete User(s)
const handleDeleteUsers = async () => {
  if (selectedUsers.length === 0) {
    toast.warning("No user selected to delete");
    return;
  }

  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${selectedUsers.length} user(s)?`
  );
  if (!confirmDelete) return;

  try {
    for (const userId of selectedUsers) {
      await deleteUser(userId);
    }
    toast.success("Selected user(s) deleted successfully");
  } catch (err) {
    toast.error("Failed to delete users");
  }
};

// Edit User
const handleEditUser = () => {
  if (selectedUsers.length !== 1) {
    toast.warning("Please select exactly one user to edit");
    return;
  }

  const user = users.find((u) => u.id === selectedUsers[0]);
  if (!user) return;

  setUserToEdit(user);
  setIsUserModalOpen(true); // open user edit modal
};


//Orders
const fetchAllOrders = useOrderStore((state) => state.fetchAllOrders);
const searchDebounceTimer = useRef(null);
const currentPage = useOrderStore((state) => state.currentPage);
const setOrderTerm = useOrderStore((state) => state.setOrderTerm);
const setStatusFilter = useOrderStore((state) => state.setStatusFilter);
const orderTerm = useOrderStore((state) => state.searchTerm);
const status = useOrderStore((state) => state.status);
const totalPages = useOrderStore((state) => state.totalPages);

const pages = [];
for (let i = 1; i <= totalPages; i++) {
  pages.push(i);
}

// Search handler for orders
const handleOrderSearch = (term) => {
  setOrderTerm(term);         // updates store
  fetchAllOrders(1);          // reset page to 1
};

//Filter Handler
const handleFilterOrders = (statusValue) => {
  setStatusFilter(statusValue); // updates store
  fetchAllOrders(1);            // reset page to 1
};

//Pagination Handler
const handlePageChange = (page) => {
  useOrderStore.getState().setPage(page); // updates currentPage
  fetchAllOrders(page); // fetch orders for the new page
};


const handleOrderSort = (value) => {
  useOrderStore.getState().setSort(value); // updates store + triggers fetch
}

 const handleFilterUsers = (selectedRole) => {
  setUsersRole(selectedRole);
  fetchUsers(usersPage, 10, selectedRole, searchedUsers); 
}

const handleUserSearch = (searchedUser) => {
  setSearchUsers(searchedUser);
  fetchUsers(usersPage, 10, usersRole, searchedUser); 
}

// Cleanup
useEffect(() => {
  return () => {
    if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
  };
}, []);

// Fetch when page changes
useEffect(() => {
  fetchAllOrders();
}, [orderTerm, status, currentPage]);

  // Header Props
  const getHeaderProps = () => {
    switch (page) {
      case "products":
        return {
          page: "products",
          addText: "Add Product",
          deleteText: "Delete Product",
          editText: "Edit Product",
          stats: [
            { label: "Total", value: products.length, icon: "📦" },
            { label: "In Stock", value: totalQuantity, icon: "🔢" },
          ],
          filterOptions: [
            { value: "", label: "All Categories" },
            { value: "Laptops", label: "Laptops" },
            { value: "Headphones", label: "Headphones" },
            { value: "Mice", label: "Mice" },
            { value: "Keyboards", label: "Keyboards" },
          ],
          sortOptions: [
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "price-asc", label: "Price: Low → High" },
            { value: "price-desc", label: "Price: High → Low" },
            { value: "discount-desc", label: "Price: Highest Discount" },
            { value: "discount-asc", label: "Price: Lowest Discount" },
          ],
          brandOptions: [
            { value: "", label: "All Brands" },
            { value: "Asus", label: "Asus" },
            { value: "Apple", label: "Apple" },
            { value: "Acer", label: "Acer" },
            { value: "Logitech", label: "Logitech" },
          ],
          onAdd: () => {
            setIsModalOpen(true);
            setProductToEdit(null);
          },
          onDelete: handleDelete,
          onEdit: handleEdit,
          onSearch: handleSearch,
          onSort: handleSort,
          onCategory: (value) => handleFilterChange("category", value),
          onBrand: (value) => handleFilterChange("brand", value),
        };

      case "users":
        return {
          page: "users",
          addText: "Promote User",
          deleteText: " Delete User",
          editText: "Edit User",
          stats: [
            { label: "Total", value: users.length, icon: "👤" },
            { label: "Admins", value: adminCount, icon: "👤" },
          ],
          filterOptions: [],
          sortOptions: [],

          brandOptions: [],
          onAdd: () => handlePromoteUsers(),
          onDelete: () => handleDeleteUsers(),
          onEdit: () => handleEditUser(),
          onRole: (value) => handleFilterUsers(value),
          onSearch: (value) => handleUserSearch(value)
      
        };

      case "approvals":
        return {
          page: "approvals",
          addText: "Approve",
          deleteText: "Deny",
          stats: [
            { label: "Total", value: 1, icon: "👤" },
            { label: "Pending", value: 2, icon: "👤" },
          ],
          filterOptions: [
            { value: "admin", label: "Admin" },
            { value: "moderator", label: "Moderator" },
            { value: "user", label: "User" },
          ],
          sortOptions: [
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
          ],

          onAdd: () => console.log("Approve"),
          onDelete: () => console.log("Denied"),
        };

      case "order-status":
        return {
          page: "order-status",
          addText: "Approve",
          deleteText: "Deny",
          stats: [
            { label: "Total", value: 1, icon: "📥" },
            { label: "Pending", value: 2, icon: "👤" },
          ],
          filterOptions: [
            { value: "", label: "All Status" },
            { value: "Waiting", label: "Waiting" },
            { value: "Packaging", label: "Packaging" },
            { value: "On the Way", label: "On the Way" },
            { value: "Delivered", label: "Delivered" },
            { value: "Canceled", label: "Canceled" },
            { value: "Refunded", label: "Refunded" },
          ],
          sortOptions: [
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
          ],

         
          onSearch: (value) => handleOrderSearch(value),
          onCategory: (value) => handleFilterOrders(value),
          onSort: (value) => handleOrderSort(value)
        };

      case "archive":
        return {
          page: "order-status",
          addText: "Approve",
          deleteText: "Deny",
          stats: [
            { label: "Total", value: 1, icon: "📥" },
            { label: "Pending", value: 2, icon: "👤" },
          ],
          
          filterOptions: [
          ],

          sortOptions: [
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
          ],


        };

      default:
        return {};

    }
  };

  const headerProps = getHeaderProps();

  return (
    <section className="form-dashboard">
      {page && <HeaderDashboard {...headerProps} />}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
      />
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={userToEdit}
      />
      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        userToPromote={userToPromote}
      />

      <div className="form-dashboard-content">
        {page === "products" && <ProductFields />}
        {page === "users" && <UserFormFields />}
        {page === "approvals" && <ApprovalFields />}
        {page === "order-status" && <OrderFields handlePageChange={handlePageChange} pages={pages} 
          currentPage={currentPage}/>}
        {page === "archive" && <ArchiveFields />}

      </div>
    </section>
  );
};

export default FormDashboard;
