"use client";

import React, { useEffect, useRef, useState } from "react";
import { PROPERTIES, Property } from "@/data/properties";
import { 
  Search, MapPin, Shield, CheckCircle, FileText, Phone, Send, X,
  Map as MapIcon, Layers, Navigation, ChevronRight, Download, Check
} from "lucide-react";
import "leaflet/dist/leaflet.css";

// Patna location coordinates mapping
const LOCALITY_COORDINATES: { [key: string]: [number, number] } = {
  "bihta": [25.5606, 84.8727],
  "danapur": [25.6324, 85.0398],
  "bailey road": [25.6105, 85.0601],
  "phulwari sharif": [25.5786, 85.0772],
  "kankarbagh": [25.5996, 85.1542],
  "saguna more": [25.6100, 85.0500],
  "patna": [25.6022, 85.1360]
};

// Colors based on zoning
const ZONE_COLORS = {
  Commercial: "#3b82f6",  // Blue
  Residential: "#eab308", // Yellow
  Agricultural: "#22c55e", // Green
  Industrial: "#a855f7"   // Purple
};

export default function MapComponent({ initialSearch }: { initialSearch: string }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  // Layers refs for dynamic clearing/updating
  const propertiesLayerGroupRef = useRef<any>(null);
  const cadastralLayerGroupRef = useRef<any>(null);
  const zoningLayerGroupRef = useRef<any>(null);
  const tpSchemeLayerGroupRef = useRef<any>(null);
  const routeLayerGroupRef = useRef<any>(null);

  // Search & Filtering States
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeZoneFilter, setActiveZoneFilter] = useState<string>("All");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // GIS Layer Toggles
  const [mapType, setMapType] = useState<"streets" | "satellite">("satellite");
  const [showCadastral, setShowCadastral] = useState(true);
  const [showZoning, setShowZoning] = useState(true);
  const [showTPScheme, setShowTPScheme] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  // Active Property Selection
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Lead Form States
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Document View Modal States
  const [activeDocType, setActiveDocType] = useState<"712" | "khata" | "ferfar" | null>(null);

  // Tile layer instances
  const satelliteTileLayerRef = useRef<any>(null);
  const streetTileLayerRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Load Leaflet dynamically on the client
    const initLeaflet = async () => {
      const L = await import("leaflet");

      // Fix icon issues
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      // Center of Patna Junction or initial search coordinates
      let center: [number, number] = [25.6022, 85.1360];
      let initialZoom = 12;

      if (initialSearch) {
        const found = Object.keys(LOCALITY_COORDINATES).find(k => 
          initialSearch.toLowerCase().includes(k)
        );
        if (found) {
          center = LOCALITY_COORDINATES[found];
          initialZoom = 13;
        }
      }

      // Create Map
      const map = L.map(mapContainerRef.current!, {
        zoomControl: false // Custom controls positioned top-left
      }).setView(center, initialZoom);
      mapInstanceRef.current = map;

      // Add Zoom Control at custom position
      L.control.zoom({ position: "topleft" }).addTo(map);

      // Define Tile Layers
      satelliteTileLayerRef.current = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        }
      );

      streetTileLayerRef.current = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png",
        {
          attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        }
      );

      // Load initial layer
      if (mapType === "satellite") {
        satelliteTileLayerRef.current.addTo(map);
      } else {
        streetTileLayerRef.current.addTo(map);
      }

      // Initialize Layer Groups
      propertiesLayerGroupRef.current = L.layerGroup().addTo(map);
      cadastralLayerGroupRef.current = L.layerGroup().addTo(map);
      zoningLayerGroupRef.current = L.layerGroup().addTo(map);
      tpSchemeLayerGroupRef.current = L.layerGroup().addTo(map);
      routeLayerGroupRef.current = L.layerGroup().addTo(map);
    };

    initLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer Map Type
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (mapType === "satellite") {
      if (streetTileLayerRef.current) map.removeLayer(streetTileLayerRef.current);
      if (satelliteTileLayerRef.current) satelliteTileLayerRef.current.addTo(map);
    } else {
      if (satelliteTileLayerRef.current) map.removeLayer(satelliteTileLayerRef.current);
      if (streetTileLayerRef.current) streetTileLayerRef.current.addTo(map);
    }
  }, [mapType]);

  // Handle Search Input or Initial Search
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !searchTerm) return;

    const query = searchTerm.toLowerCase().trim();
    const matchedLocality = Object.keys(LOCALITY_COORDINATES).find(loc => 
      query.includes(loc) || loc.includes(query)
    );

    if (matchedLocality) {
      const coords = LOCALITY_COORDINATES[matchedLocality];
      map.flyTo(coords, 13, { duration: 1.5 });
    }
  }, [searchTerm]);

  // Redraw Polygons & Overlays based on state triggers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const L = (window as any).L;
    if (!L) return;

    // Clear Layers
    propertiesLayerGroupRef.current.clearLayers();
    cadastralLayerGroupRef.current.clearLayers();
    zoningLayerGroupRef.current.clearLayers();
    tpSchemeLayerGroupRef.current.clearLayers();
    routeLayerGroupRef.current.clearLayers();

    // 1. Draw Zoning Zones (DP Overlays)
    if (showZoning) {
      // Draw big shapes covering parts of Patna representing zoning
      // Bihta Industrial Zone (Purple)
      L.polygon([
        [25.568, 84.850],
        [25.578, 84.875],
        [25.550, 84.880],
        [25.540, 84.855]
      ], {
        color: "#a855f7",
        fillColor: "#a855f7",
        fillOpacity: 0.08,
        weight: 1,
        dashArray: "4,4",
        interactive: false
      }).addTo(zoningLayerGroupRef.current);

      // Danapur Residential Zone (Yellow)
      L.polygon([
        [25.640, 85.020],
        [25.645, 85.050],
        [25.615, 85.060],
        [25.610, 85.030]
      ], {
        color: "#eab308",
        fillColor: "#eab308",
        fillOpacity: 0.06,
        weight: 1,
        dashArray: "4,4",
        interactive: false
      }).addTo(zoningLayerGroupRef.current);
      
      // Kankarbagh Commercial Zone (Blue)
      L.polygon([
        [25.602, 85.145],
        [25.605, 85.165],
        [25.585, 85.170],
        [25.580, 85.150]
      ], {
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.06,
        weight: 1,
        dashArray: "4,4",
        interactive: false
      }).addTo(zoningLayerGroupRef.current);
    }

    // 2. Draw TP Schemes Layout Grid
    if (showTPScheme) {
      // Draw tiny sub-grid layouts representing planned developments
      PROPERTIES.forEach(prop => {
        const poly = prop.polygon;
        // Generate sub-plots around the property
        const offset = 0.002;
        L.polygon([
          [poly[0][0] + offset, poly[0][1] + offset],
          [poly[1][0] + offset, poly[1][1] + offset],
          [poly[2][0] + offset, poly[2][1] + offset],
          [poly[3][0] + offset, poly[3][1] + offset]
        ], {
          color: "#0E4D92",
          fillOpacity: 0.0,
          weight: 0.8,
          dashArray: "2,2",
          interactive: false
        }).addTo(tpSchemeLayerGroupRef.current);
      });
    }

    // Filter properties based on sidebar selection
    const filteredProps = PROPERTIES.filter(p => {
      // Zone filter
      if (activeZoneFilter !== "All" && p.zone !== activeZoneFilter) return false;
      // Search text filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        return (
          p.title.toLowerCase().includes(query) ||
          p.locality.toLowerCase().includes(query) ||
          p.surveyNo.toLowerCase().includes(query)
        );
      }
      return true;
    });

    // 3. Draw Plot Boundaries and Markers
    filteredProps.forEach(prop => {
      const zoneColor = ZONE_COLORS[prop.zone] || "#64748b";
      const isSelected = selectedProperty?.id === prop.id;

      // Plot Polygon Boundary
      const polygonObj = L.polygon(prop.polygon, {
        color: isSelected ? "#3FB488" : zoneColor,
        fillColor: zoneColor,
        fillOpacity: isSelected ? 0.35 : 0.18,
        weight: isSelected ? 3.5 : 2,
        dashArray: showCadastral ? (isSelected ? "0" : "5,5") : "0"
      });

      polygonObj.on("click", (e: any) => {
        L.DomEvent.stopPropagation(e);
        setSelectedProperty(prop);
        setIsSubmitted(false);
      });

      polygonObj.addTo(propertiesLayerGroupRef.current);

      // Custom Marker with numeric label or dynamic indicator
      const customIcon = L.divIcon({
        className: "",
        html: `<div style="
          background-color: ${zoneColor};
          color: white;
          font-weight: 800;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 1px solid white;
          white-space: nowrap;
          transform: translate(-50%, -100%);
        ">${prop.size}</div>`
      });

      const marker = L.marker(prop.latlng, { icon: customIcon });
      marker.on("click", (e: any) => {
        L.DomEvent.stopPropagation(e);
        setSelectedProperty(prop);
        setIsSubmitted(false);
      });
      marker.addTo(propertiesLayerGroupRef.current);
    });

    // 4. Draw Route Path if directions are requested
    if (showDirections && selectedProperty) {
      const patnaJunction: [number, number] = [25.6022, 85.1360];
      const propertyCoords = selectedProperty.latlng;

      // Draw polyline connecting Patna Junction to the property center
      // Add a curved or multi-segment mock route line to look like a highway route path
      const midPoint: [number, number] = [
        (patnaJunction[0] + propertyCoords[0]) / 2 + 0.005,
        (patnaJunction[1] + propertyCoords[1]) / 2 - 0.005
      ];

      L.polyline([patnaJunction, midPoint, propertyCoords], {
        color: "#EF4444",
        weight: 4,
        opacity: 0.85,
        dashArray: "8,8"
      }).addTo(routeLayerGroupRef.current);

      // Add a Start Marker at Patna Junction
      L.marker(patnaJunction, {
        icon: L.divIcon({
          className: "",
          html: `<div style="background-color: #ef4444; color: white; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">H</div>`
        })
      }).addTo(routeLayerGroupRef.current);
    }
  }, [selectedProperty, activeZoneFilter, searchTerm, showCadastral, showZoning, showTPScheme, showDirections]);

  // Centering and panning to selected property
  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setIsSubmitted(false);
    setIsMobileSidebarOpen(false);

    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(prop.latlng, 14, { duration: 1.2 });
    }
  };

  // Submit mock lead
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadName && leadPhone) {
      setIsSubmitted(true);
      setLeadName("");
      setLeadPhone("");
    }
  };

  // Toggle Directions
  const toggleDirections = () => {
    setShowDirections(!showDirections);
  };

  // Filtering Logic
  const filteredPropertiesList = PROPERTIES.filter(p => {
    if (activeZoneFilter !== "All" && p.zone !== activeZoneFilter) return false;
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        p.locality.toLowerCase().includes(query) ||
        p.surveyNo.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="flex w-screen h-full overflow-hidden relative">
      {/* Sidebar List */}
      <div className={`w-full md:w-[420px] h-full bg-background-card border-r border-border-color flex flex-col z-10 shadow-lg transition-transform duration-300 fixed md:relative top-0 left-0 ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-5 border-b border-border-color flex flex-col gap-4">
          <div className="flex items-center bg-background border border-border-color rounded-xl px-4 py-2 gap-2.5">
            <Search size={18} className="text-foreground-muted" />
            <input
              type="text"
              placeholder="Search survey no, locality, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none bg-transparent p-0 text-sm w-full focus:outline-none focus:ring-0"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {["All", "Residential", "Commercial", "Agricultural", "Industrial"].map((zone) => (
              <button
                key={zone}
                onClick={() => setActiveZoneFilter(zone)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border border-transparent whitespace-nowrap transition-all hover:bg-primary-light hover:text-primary ${
                  activeZoneFilter === zone 
                    ? "bg-primary text-white border-primary-hover hover:bg-primary-hover hover:text-white" 
                    : "bg-border-color-light text-foreground-muted"
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Listings view */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {filteredPropertiesList.length > 0 ? (
            filteredPropertiesList.map((prop) => {
              const zoneColor = ZONE_COLORS[prop.zone] || "#64748b";
              const isActive = selectedProperty?.id === prop.id;
              return (
                <button
                  key={prop.id}
                  onClick={() => handleSelectProperty(prop)}
                  className={`w-full border border-border-color rounded-xl p-4 bg-background-card cursor-pointer transition-all flex flex-col gap-2 hover:border-primary hover:shadow-md hover:-translate-y-0.5 text-left ${
                    isActive ? "border-secondary bg-primary-light shadow-premium" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-[15px] font-bold text-foreground">{prop.title}</h3>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded text-white uppercase"
                      style={{ backgroundColor: zoneColor }}
                    >
                      {prop.zone}
                    </span>
                  </div>
                  <div className="text-xs text-foreground-muted flex items-center gap-1">
                    <MapPin size={14} className="text-primary" />
                    <span>{prop.locality}, Patna • Survey No: {prop.surveyNo}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-base font-extrabold text-primary">
                      ₹{(prop.price / 100000).toFixed(0)} Lakhs
                    </span>
                    <span className="text-xs font-bold text-foreground">{prop.size}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 px-4 text-foreground-muted">
              No plots match your filter parameters.
            </div>
          )}
        </div>
      </div>

      {/* Map Renderer Wrapper */}
      <div className="flex-1 h-full relative">
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

        {/* Floating Layers Controls */}
        <div className="absolute top-4 right-4 z-[99] flex flex-col gap-3">
          {/* Map Style Selector */}
          <div className="bg-background-card rounded-xl shadow-lg border border-border-color p-4 flex flex-col gap-3 w-[220px]">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border-color pb-2">Map Layout</span>
            <div className="flex gap-2">
              <button
                onClick={() => setMapType("satellite")}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border border-transparent whitespace-nowrap transition-all hover:bg-primary-light hover:text-primary flex-1 p-2 ${
                  mapType === "satellite" ? "bg-primary text-white border-primary-hover" : "bg-border-color-light text-foreground-muted"
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setMapType("streets")}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border border-transparent whitespace-nowrap transition-all hover:bg-primary-light hover:text-primary flex-1 p-2 ${
                  mapType === "streets" ? "bg-primary text-white border-primary-hover" : "bg-border-color-light text-foreground-muted"
                }`}
              >
                Street
              </button>
            </div>
          </div>

          {/* GIS Data Layers */}
          <div className="bg-background-card rounded-xl shadow-lg border border-border-color p-4 flex flex-col gap-3 w-[220px]">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border-color pb-2">GIS Data Overlays</span>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-foreground-muted cursor-pointer hover:text-foreground select-none">
                <input
                  type="checkbox"
                  checked={showCadastral}
                  onChange={(e) => setShowCadastral(e.target.checked)}
                />
                Cadastral Borders
              </label>
              <label className="flex items-center gap-2 text-[13px] font-semibold text-foreground-muted cursor-pointer hover:text-foreground select-none">
                <input
                  type="checkbox"
                  checked={showZoning}
                  onChange={(e) => setShowZoning(e.target.checked)}
                />
                Development Plan (DP)
              </label>
              <label className="flex items-center gap-2 text-[13px] font-semibold text-foreground-muted cursor-pointer hover:text-foreground select-none">
                <input
                  type="checkbox"
                  checked={showTPScheme}
                  onChange={(e) => setShowTPScheme(e.target.checked)}
                />
                TP Scheme Layouts
              </label>
            </div>
          </div>
        </div>

        {/* Mobile Toggle Sidebar Button */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="flex md:hidden absolute bottom-6 left-6 z-[99] bg-primary text-white w-12 h-12 rounded-full shadow-lg items-center justify-center"
          aria-label="Toggle listing panel"
        >
          <Layers size={20} />
        </button>

        {/* Property Detail Drawer Overlay */}
        {selectedProperty && (
          <div className={`absolute top-4 md:left-[436px] w-[calc(100%-32px)] max-w-[380px] md:w-[380px] h-auto max-h-[calc(100%-32px)] bg-background-card border border-border-color rounded-2xl shadow-premium z-40 flex flex-col overflow-hidden transition-all duration-300 max-md:bottom-0 max-md:top-auto max-md:left-0 max-md:w-full max-md:max-h-[60%] max-md:rounded-b-none ${
            selectedProperty 
              ? "opacity-100 translate-x-0 pointer-events-auto max-md:translate-y-0" 
              : "opacity-0 -translate-x-5 max-md:translate-y-full pointer-events-none"
          }`}>
            <div className="px-5 py-4 border-b border-border-color flex justify-between items-center bg-border-color-light">
              <span className="text-xs font-bold text-primary uppercase">
                Plot GIS Record Details
              </span>
              <button onClick={() => setSelectedProperty(null)} className="text-foreground-muted hover:text-foreground p-1 transition-colors" aria-label="Close plot info">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex flex-col gap-4">
              <h2 className="text-lg font-extrabold">{selectedProperty.title}</h2>
              <div className="flex gap-2">
                <span className="bg-secondary-light text-secondary border border-secondary-border text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Shield size={14} fill="var(--secondary)" color="white" />
                  Government Verified
                </span>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded text-white uppercase"
                  style={{ backgroundColor: ZONE_COLORS[selectedProperty.zone] }}
                >
                  {selectedProperty.zone}
                </span>
              </div>

              {/* Grid Statistics */}
              <div className="grid grid-cols-2 gap-3 bg-border-color-light p-3.5 rounded-xl">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-extrabold text-foreground">₹{(selectedProperty.price / 100000).toFixed(0)} Lakhs</span>
                  <span className="text-[10px] text-foreground-muted font-bold uppercase">Total Price</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-extrabold text-foreground">{selectedProperty.size}</span>
                  <span className="text-[10px] text-foreground-muted font-bold uppercase">Plot Size</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-extrabold text-foreground">{selectedProperty.sizeSqFt.toLocaleString()} sq ft</span>
                  <span className="text-[10px] text-foreground-muted font-bold uppercase">Area Sq. Ft</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-extrabold text-foreground">₹{selectedProperty.pricePerKatha} L</span>
                  <span className="text-[10px] text-foreground-muted font-bold uppercase">Per Katha</span>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold uppercase text-foreground-muted">Plot Description</span>
                <p className="text-[13px] leading-relaxed text-foreground-muted">{selectedProperty.description}</p>
              </div>

              {/* Map Actions: Directions */}
              <div className="border-t border-border-color pt-4">
                <button
                  onClick={toggleDirections}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-[13px] py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  style={{ backgroundColor: showDirections ? "#ef4444" : "var(--primary)" }}
                >
                  <Navigation size={16} />
                  {showDirections ? "Remove Driving Route" : "Show Route from Patna Station"}
                </button>
              </div>

              {/* Document Download Section */}
              <div className="border-t border-border-color pt-4">
                <span className="text-xs font-bold uppercase text-foreground-muted">Verified Land Records (Free audit logs)</span>
                <div className="flex flex-col gap-2 mt-2">
                  <button onClick={() => setActiveDocType("712")} className="w-full flex items-center justify-between border border-dashed border-border-color rounded-xl px-4 py-2.5 text-[13px] font-semibold text-foreground bg-background hover:bg-primary-light hover:border-primary hover:text-primary transition-all">
                    <span className="flex items-center gap-2">
                      <FileText size={16} className="text-primary" />
                      Record 7/12 (Bihar Mutation)
                    </span>
                    <Download size={14} />
                  </button>
                  <button onClick={() => setActiveDocType("khata")} className="w-full flex items-center justify-between border border-dashed border-border-color rounded-xl px-4 py-2.5 text-[13px] font-semibold text-foreground bg-background hover:bg-primary-light hover:border-primary hover:text-primary transition-all">
                    <span className="flex items-center gap-2">
                      <FileText size={16} className="text-primary" />
                      Khata Certificate (Form 8A)
                    </span>
                    <Download size={14} />
                  </button>
                  <button onClick={() => setActiveDocType("ferfar")} className="w-full flex items-center justify-between border border-dashed border-border-color rounded-xl px-4 py-2.5 text-[13px] font-semibold text-foreground bg-background hover:bg-primary-light hover:border-primary hover:text-primary transition-all">
                    <span className="flex items-center gap-2">
                      <FileText size={16} className="text-primary" />
                      Ferfar Mutation (Form 6A)
                    </span>
                    <Download size={14} />
                  </button>
                </div>
              </div>

              {/* Direct Broker Network form */}
              <div className="border-t border-border-color pt-4 flex flex-col gap-3">
                <span className="text-xs font-bold uppercase text-foreground-muted">Contact Broker (Zero Commission)</span>
                <div className="flex items-center justify-between bg-primary-light px-4 py-2.5 rounded-lg text-[13px] text-primary font-bold">
                  <span>{selectedProperty.brokerName}</span>
                  <span className="flex items-center gap-1">
                    <Phone size={14} />
                    {selectedProperty.brokerPhone}
                  </span>
                </div>

                {isSubmitted ? (
                  <div className="bg-secondary-light text-secondary border border-secondary-border px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-bold animate-fade">
                    <Check size={16} />
                    <span>Lead submitted! Broker will callback within 24h.</span>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      required
                      className="text-[13px] p-2 border border-border-color rounded-lg bg-background"
                    />
                    <input
                      type="tel"
                      placeholder="Your Phone Number"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      required
                      className="text-[13px] p-2 border border-border-color rounded-lg bg-background"
                    />
                    <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold text-[13px] py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                      <Send size={14} />
                      Get Free Callback
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Viewer Modal Overlay */}
      {activeDocType && selectedProperty && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-xs z-[2000] flex items-center justify-center p-4" onClick={() => setActiveDocType(null)}>
          <div className="bg-white text-slate-800 w-full max-w-[680px] h-[90%] rounded-2xl flex flex-col overflow-hidden shadow-premium" onClick={(e) => e.stopPropagation()}>
            <div className="bg-background-footer text-white px-6 py-4 flex justify-between items-center">
              <span className="flex items-center gap-2 font-bold">
                <Shield size={18} />
                Bihar Government Land Record Verification Portal (Mock Audit)
              </span>
              <button onClick={() => setActiveDocType(null)} className="text-slate-400 hover:text-white p-1" aria-label="Close document">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
              <div className="flex justify-between items-start">
                <div className="border-4 double border-red-700 text-red-700 font-black px-4 py-2 uppercase inline-block mb-5 font-mono">Verified copy</div>
                <div className="text-right text-xs text-slate-400">
                  System ID: {selectedProperty.documents.record712}
                </div>
              </div>

              {/* Document rendering depending on selection */}
              {activeDocType === "712" && (
                <div>
                  <h1 className="font-serif text-2xl text-center mb-6 text-slate-900 underline">FORM 7/12 (LAND RECORD REGISTER)</h1>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">State</span>
                      <span className="text-sm font-semibold text-slate-900">BIHAR</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">District / Sub-division</span>
                      <span className="text-sm font-semibold text-slate-900">PATNA / {selectedProperty.locality.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Village / Khata No.</span>
                      <span className="text-sm font-semibold text-slate-900">{selectedProperty.locality} / 401A</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Survey/Plot Number</span>
                      <span className="text-sm font-semibold text-slate-900">{selectedProperty.surveyNo}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Land Owner Registered</span>
                      <span className="text-sm font-semibold text-slate-900">Lal Bihari Prasad S/o Ram Prasad</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Total Plot Area Size</span>
                      <span className="text-sm font-semibold text-slate-900">{selectedProperty.size} ({selectedProperty.sizeSqFt} Sq Ft)</span>
                    </div>
                  </div>
                  <p className="font-serif text-sm leading-relaxed text-slate-700 mt-4 text-justify">
                    This document certifies that the plot boundary marked under survey number {selectedProperty.surveyNo} is officially classified under zoning laws as {selectedProperty.zone} and matches the local Revenue records. The land is free of all encumbrances. lal Bihari Prasad is the absolute title owner, having acquired it through inherited ancestral division registered in book volume IV.
                  </p>
                </div>
              )}

              {activeDocType === "khata" && (
                <div>
                  <h1 className="font-serif text-2xl text-center mb-6 text-slate-900 underline">FORM 8A (KHATA HOLDING LIST REGISTER)</h1>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Khata Holding Register ID</span>
                      <span className="text-sm font-semibold text-slate-900">{selectedProperty.documents.khata}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Assessment Circle</span>
                      <span className="text-sm font-semibold text-slate-900">{selectedProperty.locality.toUpperCase()} CORRIDOR</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Tenant Category</span>
                      <span className="text-sm font-semibold text-slate-900">Raiyat (Permanent Occupant)</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Tax Assessment Annually</span>
                      <span className="text-sm font-semibold text-slate-900">₹450.00 (Paid up to Mar 2026)</span>
                    </div>
                  </div>
                  <p className="font-serif text-sm leading-relaxed text-slate-700 mt-4 text-justify">
                    Holding Register 8A details: Under holding ledger reference {selectedProperty.documents.khata}, the land tenant is recorded as Raiyat Lal Bihari Prasad. The plot under survey no {selectedProperty.surveyNo} has no pending government revenue dues or land tax demands. Records show water tax and local block development cess have been paid in full for assessment cycles 2024-2025.
                  </p>
                </div>
              )}

              {activeDocType === "ferfar" && (
                <div>
                  <h1 className="font-serif text-2xl text-center mb-6 text-slate-900 underline">FORM 6A (FERFAR MUTATION ENTRY REGISTER)</h1>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Mutation Entry Reference</span>
                      <span className="text-sm font-semibold text-slate-900">{selectedProperty.documents.ferfar}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Sub-registrar Office</span>
                      <span className="text-sm font-semibold text-slate-900">PATNA REGISTER OFFICE</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Acquisition Mode</span>
                      <span className="text-sm font-semibold text-slate-900">Sale Deed Registration</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Mutation Order Date</span>
                      <span className="text-sm font-semibold text-slate-900">12th October 2024</span>
                    </div>
                  </div>
                  <p className="font-serif text-sm leading-relaxed text-slate-700 mt-4 text-justify">
                    Pursuant to mutation case reference {selectedProperty.documents.ferfar}, a notice was issued under Bihar Land Mutation Act. The mutation orders are verified, transfer of name from vendor Shri Ram Narayan to the purchaser is successfully recorded in Register II ledger, and the boundary descriptions match the cadastral survey layouts of sub-plot {selectedProperty.surveyNo}.
                  </p>
                </div>
              )}

              {/* Signatures */}
              <div className="flex justify-between mt-12 text-[13px] text-slate-400">
                <div className="border-t border-slate-300 w-[180px] text-center pt-2">
                  Circle Officer (CO)<br />Digital Verification Signature
                </div>
                <div className="border-t border-slate-300 w-[180px] text-center pt-2">
                  Land Records Registrar<br />Patna Revenue Department
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
