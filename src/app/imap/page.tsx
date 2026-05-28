"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import MapComponent to disable SSR
// Leaflet requires browser window APIs which are not available during server builds
const MapComponent = dynamic<{ initialSearch: string }>(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "calc(100vh - var(--header-height))",
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
        Loading Patna iMap & GIS layers...
      </div>
    </div>
  ),
});

interface PageProps {
  searchParams: Promise<{ search?: string; locality?: string }>;
}

export default function IMapPage({ searchParams }: PageProps) {
  const params = React.use(searchParams);
  const initialSearch = params.search || params.locality || "";

  return (
    <div style={{ width: "100%", height: "calc(100vh - var(--header-height))", overflow: "hidden" }}>
      <MapComponent initialSearch={initialSearch} />
    </div>
  );
}
