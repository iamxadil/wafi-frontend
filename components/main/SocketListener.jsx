// src/components/SocketListener.jsx
import { useEffect } from "react";
import io from "socket.io-client";
import useNotificationsStore from "../stores/useNotificationsStore.jsx";
import PlayNotSound from "../effects/PlayNotSound.jsx";

// 🔌 Connect to backend socket
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const socket = io(API_URL, {
  withCredentials: true, // needed if using cookies for auth
});

const SocketListener = () => {
  const addNotification = useNotificationsStore((state) => state.addNotification);

  useEffect(() => {
    // Listen for new product
    socket.on("newProduct", (data) => {
      addNotification({
        _id: data._id, // if backend returns DB id
        type: "product",
        message: data.message,
        productId: data.productId,
        time: new Date(),
        read: false,
      });

      PlayNotSound();
    });

    // Listen for new user registration
    socket.on("newUser", (data) => {
      addNotification({
        _id: data._id,
        type: "newUser",
        message: data.message,
        productId: data.userId,
        time: new Date(),
        read: false,
      });

      PlayNotSound();
    });

    // Listen for new comment
    socket.on("newComment", (data) => {
      addNotification({
        _id: data._id,
        type: "comment",
        message: `${data.user} commented: ${data.text}`,
        productId: data.productId,
        time: new Date(),
        read: false,
      });

      PlayNotSound();
    });

    // Listen for product updates
    socket.on("updateProduct", (data) => {
      addNotification({
        _id: data._id,
        type: "updateProduct",
        message: data.message,
        productId: data.productId,
        time: new Date(),
        read: false,
      });

     PlayNotSound();
    });

    socket.on("newOrder", (data) => {
      addNotification({
        _id: data._id,
        type: "newOrder",
        message: data.message,
        productId: data.productId,
        time: new Date(),
        read: false,
      });

     PlayNotSound();
    });

    // Cleanup on unmount
    return () => {
      socket.off("newProduct");
      socket.off("newUser");
      socket.off("newComment");
      socket.off("updateProduct");
      socket.off("newOrder");
    };
  }, [addNotification]);

  return null; // This component doesn’t render anything
};

export default SocketListener;
