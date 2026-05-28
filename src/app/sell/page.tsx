"use client";

import React from "react";
import dynamic from "next/dynamic";

const SellComponent = dynamic(() => import("./SellComponent"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--background)",
        color: "var(--foreground-muted)",
        fontSize: "18px",
        fontWeight: 600,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid var(--primary-light)",
            borderTop: "4px solid var(--primary)",
            borderRadius: "50%",
            animation: "pulse-soft 1.5s infinite"
          }}
        />
        Loading Sell Portal...
      </div>
    </div>
  ),
});

export default function SellPage() {
  return (
    <div>
      <SellComponent />
    </div>
  );
}
