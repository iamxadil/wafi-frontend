// src/TestWindowsKey.jsx
import React from "react";
import { useWindowsKeySuggestions } from "../components/query/useWindowsKeySuggestions.jsx";

export default function TestWindowsKey() {
  const { data, isLoading, isError, error } = useWindowsKeySuggestions();

  if (isLoading) return <p>Loading suggestions...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  if (!data || data.length === 0) {
    return <p>No suggestions found for tag: windows-key</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Windows Key Suggestions (Test)</h2>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {data.map((p) => (
          <li
            key={p._id}
            style={{
              marginBottom: "12px",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "12px",
            }}
          >
            <strong>{p.name}</strong>
            <br />
            <span>Price: {p.finalPrice || p.price}$</span>
            <br />
            {p.images?.[0] && (
              <img
                src={p.images[0]}
                alt=""
                style={{ width: "120px", marginTop: "8px" }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
