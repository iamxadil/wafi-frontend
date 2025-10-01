import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://192.168.100.116:5000"); // your server URL

const TestSocket = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Listen for newProduct event
    socket.on("newProduct", (product) => {
      console.log("Received new product:", product);
      setProducts((prev) => [...prev, product]);
    });

    // Clean up on unmount
    return () => {
      socket.off("newProduct");
    };
  }, []);

  return (
    <div>
      <h1>Socket.io Product Test</h1>
      <ul>
        {products.map((p, index) => (
          <li key={index}>{p.name} - ${p.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestSocket;
