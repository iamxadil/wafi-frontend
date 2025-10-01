import React, { useEffect } from "react";
import "../styles/adminlandingpage.css";
import useAuthStore from "../../../stores/useAuthStore.jsx";
import useNotsStore from "../../../stores/useNotsStore.jsx";
import useProductStore from "../../../stores/useProductStore.jsx";
import useUserStore from "../../../stores/useUserStore.jsx";
import useOrderStore from "../../../stores/useOrderStore.jsx";
import usePermissionStore from "../../../stores/usePermissionStore.jsx";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";

import {
  RiArrowRightUpBoxLine as Arrow,
  RiNotification3Fill as Bell,
  RiPushpin2Fill as Pedning,
  RiUserSharedFill as NewUser,
  RiFileTransferFill as Updated,
  RiShoppingBag3Fill as Order,
  RiHeart3Line  as Heart
} from "react-icons/ri";

import { 
  TbPresentationAnalyticsFilled as Counts,
  TbUsers as Users,
  TbCircleSquare as Products,
  TbPinned as Pin,
  TbChecks as Approved
} from "react-icons/tb";

// DashCard Component
const DashCard = ({ title, icon, children, footer }) => (
  <div className="dash-card">
    <h3 className="dash-card-header">
      {icon && <span className="card-icon">{icon}</span>}
      {title}
    </h3>
    <div className="card-data">{children}</div>
    {footer && <div className="view-more">{footer}</div>}
  </div>
);

const AdminLandingPage = () => {
  // User Related
  const user = useAuthStore((state) => state.user);
  const countAllUsers = useUserStore((state) => state.countAllUsers);
  const allUsers = useUserStore((state) => state.allUsers);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);

  // Notifications Related
  const fetchNotifications = useNotsStore((state) => state.fetchNotifications);
  const notifications = useNotsStore((state) => state.notifications);

  // Products Related
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);
  const countAllProducts = useProductStore((state) => state.countAllProducts);
  const allProducts = useProductStore((state) => state.allProducts);
  const countPending = allProducts.filter((p) => !p.approved).length;
  const countApproved = allProducts.filter((p) => p.approved).length;

  //Orders Related
  const fetchAllOrders = useOrderStore((state) => state.fetchAllOrders);
  const countAllOrders = useOrderStore((state) => state.countAllOrders);
  const totalOrders = useOrderStore((state) => state.totalOrders);
  const allOrders = useOrderStore((state) => state.allOrders);
  const loadingOrders = useOrderStore((state) => state.loading);

  const lastOrderMade = allOrders.length > 0
    ? allOrders[allOrders.length - 1] 
    : null;

  //Test
  
  const fetchMods = usePermissionStore((store) => store.fetchMods);


  // Initial Data Fetch
  useEffect(() => {
    profile();
    fetchNotifications();
    fetchProducts();
    countAllProducts();
    countAllUsers();
    countAllOrders();
    fetchAllOrders();
    fetchMods();
   
  }, [profile, fetchNotifications, fetchProducts, countAllProducts, countAllUsers, countAllOrders, fetchAllOrders]);


  
  dayjs.extend(relativeTime);

  // Icon Mapping
  const iconMap = {
    "New User": <NewUser />,
    "Product Updated": <Updated />,
    "default": <Bell />
  };


      // Get all reviews from all products
    const allReviews = allProducts.flatMap(p => 
      p.reviews?.map(r => ({ ...r, productName: p.name, productImage: p.images[0] })) || []
    );

    // Sort by date (latest first)
    const lastReview = allReviews.length > 0 
      ? allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] 
      : null;

  // Card Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: .6, ease: "easeInOut" } }
  };

  return (
    <main id="admin-landing-page">
      {/* Header Animations */}
      <motion.header
        className="hello-user"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome
        </motion.h1>
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading ? "...." : user?.name}
        </motion.h3>
      </motion.header>

      {/* Dashboard Cards */}
      <div className="overview-container">
        {/* Last Notification */}
        <motion.div
          key="last-notification"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ amount: 0.2 }}
        >
          <DashCard title="Last Notification" footer={<Arrow size={25}/>} icon={<Bell size={25}/>}>
            {notifications.length > 0 ? (
              notifications.slice(0, 1).map((not) => (
                <div key={not._id} className="last-notification">
                  <h3 className="message">
                    {iconMap[not.type] || iconMap["default"]} {not.type}
                  </h3>
                  <p>{not.message}</p>
                  <h5>{dayjs(not.date).fromNow()}</h5>
                </div>
              ))
            ) : <p>No notifications</p>}
          </DashCard>
        </motion.div>

        {/* Latest Pending Products */}
        <motion.div
          key="latest-pending"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ amount: 0.2 }}
        >
          <DashCard title="Last Pendings" footer={<Arrow size={25}/>} icon={<Pedning size={25}/>}>
            {products.filter(p => !p.approved).slice(-1).map(product => (
              <div key={product._id} className="last-pending">
                <div className="product-image">
                  <img src={product.images} alt={product.name}/>
                </div>
                <div className="pending-details">
                  <h4 style={{fontSize: "1.25rem"}}>{product.name}</h4>
                  <p>Price: {product.price.toLocaleString()}</p>
                  <p>{dayjs(product.updatedAt).fromNow()}</p>
                </div>
              </div>
            ))}
            {products.filter(p => !p.approved).length === 0 && <p>No pending products</p>}
          </DashCard>
        </motion.div>

        {/* Quick Counts */}
        <motion.div
          key="quick-counts"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ amount: 0.2 }}
        >
          <DashCard title="Quick Counts" icon={<Counts size={25}/>}>
            <div className="quick-counts">
              <p> <span><Products/></span> Total Products: {allProducts.length}</p>
              <p><span><Users/></span> Total Users: {allUsers.length}</p>
              <p><span><Pin/></span> Total Pendings: {countPending}</p>
              <p><span><Approved/></span> Total Orders: {totalOrders}</p>
            </div>     
          </DashCard>
        </motion.div>

        {/* Last Order */}

        <motion.div
          key="last-order-counts"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ amount: 0.2 }}
        >
            <DashCard title="Last Order" icon={<Order />} size={25}>
                {loadingOrders && <p>Loading...</p>}
                {!loadingOrders && !lastOrderMade && <p>No orders yet.</p>}
                
                {lastOrderMade && (
                  <div className="adm-last-order">
                    <div className="adm-order-summary">
                      <p>
                        User: {lastOrderMade.user?.name || "Guest"}
                      </p>
                      <p>Address: {lastOrderMade.shippingInfo.city}</p>
                      <p>
                        Status: <span className={`status ${lastOrderMade.status.toLowerCase()}`}>
                          {lastOrderMade.status}
                        </span>
                      </p>
                      <p>Total: {lastOrderMade.totalPrice.toLocaleString()} IQD</p>
                    </div>
                  </div>
                )}
              </DashCard>
        </motion.div>

            <motion.div
          key="last-comment"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ amount: 0.2 }}
        >
          <DashCard title="Last Comment" icon={<Heart size={25} />} footer={<Arrow size={25} />}>
            {lastReview ? (
              <div className="last-comment">
                <div className="comment-user">
                  <p><strong>{lastReview.name}</strong> on {lastReview.productName}</p>
                  <p style={{fontWeight: "200"}}>{lastReview.comment}</p>
                  <p className="comment-date">{dayjs(lastReview.createdAt).fromNow()}</p>
                </div>

  
              </div>
            ) : <p>No comments yet.</p>}
          </DashCard>
        </motion.div>
      </div>
    </main>
  );
};

export default AdminLandingPage;
