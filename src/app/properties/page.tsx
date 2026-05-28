"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PROPERTIES, Property } from "@/data/properties";
import { MapPin, Shield, Map, LayoutGrid, RotateCcw } from "lucide-react";

// Zone badges background colors
const ZONE_COLORS = {
  Commercial: "#3b82f6",
  Residential: "#eab308",
  Agricultural: "#22c55e",
  Industrial: "#a855f7",
};

function PropertiesListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial filters from search params
  const initialLocality = searchParams.get("locality") || "All";
  const initialZone = searchParams.get("zone") || "All";

  const [localityFilter, setLocalityFilter] = useState(initialLocality);
  const [zoneFilter, setZoneFilter] = useState(initialZone);
  const [maxPrice, setMaxPrice] = useState<number>(40000000); // 4 Cr default
  const [minSize, setMinSize] = useState<number>(0);

  // Sync state with URL search params
  useEffect(() => {
    const loc = searchParams.get("locality");
    if (loc) setLocalityFilter(loc);
    
    const zn = searchParams.get("zone");
    if (zn) setZoneFilter(zn);
  }, [searchParams]);

  // Handle Reset Filters
  const handleReset = () => {
    setLocalityFilter("All");
    setZoneFilter("All");
    setMaxPrice(40000000);
    setMinSize(0);
    router.push("/properties");
  };

  // Filter listings logic
  const filteredProperties = PROPERTIES.filter((prop) => {
    // Locality
    if (localityFilter !== "All" && prop.locality !== localityFilter) return false;
    // Zone
    if (zoneFilter !== "All" && prop.zone !== zoneFilter) return false;
    // Price
    if (prop.price > maxPrice) return false;
    // Size
    if (prop.sizeSqFt < minSize) return false;
    return true;
  });

  const uniqueLocalities = Array.from(new Set(PROPERTIES.map((p) => p.locality)));

  return (
    <div className="py-12 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6">
        <h1 className="text-3xl font-extrabold mb-2">Verified Land & Plots for Sale</h1>
        <p className="text-foreground-muted mb-8 text-sm md:text-base leading-relaxed">
          Explore active land plots in Patna's high growth zones. Review dimensions and land registry logs on interactive GIS maps.
        </p>

        {/* Filters Panel */}
        <div className="bg-background-card border border-border-color rounded-2xl p-6 mb-10 shadow-sm flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Locality Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Patna Locality</label>
              <select
                value={localityFilter}
                onChange={(e) => setLocalityFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border-color text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              >
                <option value="All">All Localities</option>
                {uniqueLocalities.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Zone Category */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Zoning Use</label>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border-color text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              >
                <option value="All">All Zones</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            {/* Max Price */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Max Price: ₹{(maxPrice / 100000).toFixed(0)} Lakhs</label>
              <input
                type="range"
                min={1000000}
                max={40000000}
                step={1000000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border-color text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light cursor-pointer"
                style={{ padding: "0" }}
              />
            </div>

            {/* Area Size */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Min Area size (sq ft)</label>
              <select
                value={minSize}
                onChange={(e) => setMinSize(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border-color text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              >
                <option value={0}>Any Size</option>
                <option value={4000}>&gt; 4,000 sq ft</option>
                <option value={8000}>&gt; 8,000 sq ft</option>
                <option value={15000}>&gt; 15,000 sq ft</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-border-color-light pt-4 text-sm text-foreground-muted">
            <span>Showing {filteredProperties.length} active plots in Patna</span>
            <button onClick={handleReset} className="font-bold text-primary inline-flex items-center gap-1 hover:text-primary-hover hover:underline">
              <RotateCcw size={14} />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Listings Cards Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => {
              const zoneColor = ZONE_COLORS[prop.zone] || "#64748b";
              return (
                <div key={prop.id} className="bg-background-card border border-border-color rounded-2xl overflow-hidden shadow-sm flex flex-col hover:-translate-y-1.5 hover:shadow-lg hover:border-primary-medium transition-all duration-300">
                  {/* Card Image Area (Mock Map Visual) */}
                  <div 
                    className="relative h-[200px] bg-slate-800 flex items-center justify-center text-white"
                    style={{
                      backgroundImage: "radial-gradient(#334155 1.5px, transparent 1.5px)",
                      backgroundSize: "20px 20px"
                    }}
                  >
                    <span className="absolute top-4 left-4 text-[11px] font-extrabold px-2.5 py-1 rounded text-white uppercase" style={{ backgroundColor: zoneColor }}>
                      {prop.zone}
                    </span>
                    {prop.verified && (
                      <span className="absolute top-4 right-4 bg-secondary/95 text-white text-[11px] font-extrabold px-2.5 py-1 rounded backdrop-blur-xs flex items-center gap-1">
                        <Shield size={12} fill="white" color="rgba(63, 180, 136, 1)" />
                        Verified
                      </span>
                    )}

                    {/* SVG boundary box illustration */}
                    <svg className="w-[70%] h-[70%] opacity-80" viewBox="0 0 100 80">
                      <polygon
                        points="20,15 80,20 70,65 30,60"
                        fill={zoneColor}
                        fillOpacity="0.2"
                        stroke={zoneColor}
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                      />
                      <circle cx="50" cy="40" r="3" fill="#ef4444" />
                    </svg>
                  </div>

                  {/* Card Details */}
                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <div className="flex flex-col gap-1">
                      <span className="font-heading text-2xl font-extrabold text-primary">
                        ₹{(prop.price / 100000).toFixed(0)} Lakhs
                      </span>
                      <h2 className="text-base font-bold text-foreground leading-snug h-11 overflow-hidden line-clamp-2">{prop.title}</h2>
                    </div>

                    <div className="text-[13px] text-foreground-muted flex items-center gap-1">
                      <MapPin size={14} className="text-primary" />
                      <span>{prop.locality}, Patna, Bihar</span>
                    </div>

                    {/* Grid Specs */}
                    <div className="grid grid-cols-2 gap-3 bg-border-color-light p-3 rounded-xl text-[13px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-foreground-muted font-bold uppercase">Plot Size</span>
                        <span className="font-bold text-foreground">{prop.size}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-foreground-muted font-bold uppercase">Survey No</span>
                        <span className="font-bold text-foreground">{prop.surveyNo}</span>
                      </div>
                    </div>

                    <p className="text-[13px] text-foreground-muted leading-relaxed h-[60px] overflow-hidden line-clamp-3">{prop.description}</p>

                    {/* Actions */}
                    <div className="flex gap-3 border-t border-border-color-light pt-4">
                      <button
                        onClick={() => router.push(`/imap?search=${encodeURIComponent(prop.surveyNo)}`)}
                        className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold text-[13px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Map size={14} />
                        View on iMap
                      </button>
                      <button
                        onClick={() => router.push(`/imap?search=${encodeURIComponent(prop.surveyNo)}`)}
                        className="flex-1 bg-primary-light text-primary font-bold text-[13px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary-medium transition-all"
                      >
                        <LayoutGrid size={14} />
                        GIS Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="text-center py-16 px-8 bg-background-card rounded-2xl border border-border-color text-foreground-muted"
          >
            No listings found matching your exact filter queries.
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesList() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
          Loading Listings...
        </div>
      }
    >
      <PropertiesListContent />
    </Suspense>
  );
}
