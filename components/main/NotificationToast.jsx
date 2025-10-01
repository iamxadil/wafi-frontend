// src/components/NotificationToast.jsx
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useNotificationsStore from "../stores/useNotificationsStore.jsx";

// Initialize Toast container somewhere in App.jsx
// <ToastContainer position="top-right" autoClose={5000} />

const NotificationToast = () => {
  const notifications = useNotificationsStore((state) => state.notifications);
  const markAsShown = useNotificationsStore((state) => state.markAsShown);

  useEffect(() => {
    // Show toast for any new notification that hasn't been displayed yet
    notifications.forEach((n) => {
      if (!n.shown) {
        toast.info(n.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Mark notification as shown so we don't toast it again
        markAsShown(n._id);
      }
    });
  }, [notifications, markAsShown]);

  return null;
};

export default NotificationToast;
