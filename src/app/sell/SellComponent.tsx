"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  MapPin, Upload, ShieldCheck, CheckCircle2, AlertCircle, Map as MapIcon 
} from "lucide-react";
import "leaflet/dist/leaflet.css";

const LOCALITY_CENTERS: { [key: string]: [number, number] } = {
  "Bihta": [25.5606, 84.8727],
  "Danapur": [25.6324, 85.0398],
  "Bailey Road": [25.6105, 85.0601],
  "Phulwari Sharif": [25.5786, 85.0772],
  "Kankarbagh": [25.5996, 85.1542]
};

export default function SellComponent() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [locality, setLocality] = useState("Bihta");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [sizeSqFt, setSizeSqFt] = useState("");
  const [zone, setZone] = useState("Residential");
  const [description, setDescription] = useState("");
  const [brokerName, setBrokerName] = useState("");
  const [brokerPhone, setBrokerPhone] = useState("");
  
  // Coordinates State
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  // Process States
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");

      const map = L.map(mapContainerRef.current!, {
        zoomControl: false
      }).setView(LOCALITY_CENTERS["Bihta"], 13);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Esri"
        }
      ).addTo(map);

      L.control.zoom({ position: "topleft" }).addTo(map);
      mapInstanceRef.current = map;

      // Handle map clicks to set plot coordinate pin
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        setSelectedCoords([lat, lng]);

        if (markerInstanceRef.current) {
          markerInstanceRef.current.setLatLng(e.latlng);
        } else {
          // Custom red pin for broker input location
          const customIcon = L.divIcon({
            className: "",
            html: `<div style="background-color: #ef4444; border: 2px solid white; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5); transform: translate(-50%, -50%);"></div>`
          });
          markerInstanceRef.current = L.marker(e.latlng, { icon: customIcon }).addTo(map);
        }
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Pan Map when locality changes
  const handleLocalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setLocality(selected);

    const map = mapInstanceRef.current;
    if (map && LOCALITY_CENTERS[selected]) {
      const coords = LOCALITY_CENTERS[selected];
      map.flyTo(coords, 13, { duration: 1.0 });

      // Move marker to the new center
      setSelectedCoords(coords);
      const L = (window as any).L;
      if (L) {
        if (markerInstanceRef.current) {
          markerInstanceRef.current.setLatLng(coords);
        } else {
          const customIcon = L.divIcon({
            className: "",
            html: `<div style="background-color: #ef4444; border: 2px solid white; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5); transform: translate(-50%, -50%);"></div>`
          });
          markerInstanceRef.current = L.marker(coords, { icon: customIcon }).addTo(map);
        }
      }
    }
  };

  // Mock File Upload
  const handleMockUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadedFiles(["7_12_record_signed.pdf", "khata_certificate_verification.pdf"]);
    }, 1500);
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleResetForm = () => {
    setTitle("");
    setPrice("");
    setSize("");
    setSizeSqFt("");
    setDescription("");
    setBrokerName("");
    setBrokerPhone("");
    setUploadedFiles([]);
    setSelectedCoords(null);
    if (markerInstanceRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerInstanceRef.current);
      markerInstanceRef.current = null;
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="bg-background-card border border-border-color rounded-2xl p-12 text-center max-w-[600px] mx-auto my-10 shadow-lg flex flex-col items-center gap-6 animate-fade">
          <div className="w-16 h-16 rounded-full bg-secondary-light text-secondary flex items-center justify-center">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="text-[28px] font-extrabold">Land Listing Published!</h1>
          <p className="text-foreground-muted leading-relaxed">
            Your property <strong>"{title}"</strong> has been successfully submitted to the Patna Property Hub database. Our revenue audit team will check the uploaded land records (7/12, Khata) within 24 hours to attach the <strong>"Government Verified"</strong> badge to your plot.
          </p>
          <div className="bg-border-color-light p-4 rounded-xl w-full text-left text-sm flex flex-col gap-2">
            <span><strong>Listing Details:</strong></span>
            <span>• Area corridor: {locality}, Patna</span>
            <span>• Size: {size} ({sizeSqFt} Sq Ft)</span>
            <span>• Zoning: {zone} Land Use</span>
            {selectedCoords && (
              <span>• GIS Coordinates: {selectedCoords[0].toFixed(5)}, {selectedCoords[1].toFixed(5)}</span>
            )}
            <span>• Document Status: {uploadedFiles.length > 0 ? "Uploaded, Pending Verification Check" : "No documents uploaded"}</span>
          </div>
          <button onClick={() => { setIsSuccess(false); handleResetForm(); }} className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3 rounded-full transition-all">
            List Another Property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6">
        <h1 className="text-3xl font-extrabold mb-2">Sell Land / List Plot for Free</h1>
        <p className="text-foreground-muted mb-8 text-sm md:text-base">
          Are you a land broker or owner? Publish your plots, draw their boundaries on maps, upload land records, and reach thousands of investors directly.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12">
          {/* Left Form */}
          <form onSubmit={handleSubmit} className="bg-background-card border border-border-color rounded-2xl p-8 shadow-sm flex flex-col gap-6">
            <h2 className="text-xl font-bold border-b border-border-color-light pb-3">Plot & Ownership Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Title */}
              <div className="col-span-1 sm:col-span-2 flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Listing Heading Title</label>
                <input
                  type="text"
                  placeholder="e.g. Prime Corner Plot in Bihta Near Ring Road"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border-color text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Locality */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Patna Area Locality</label>
                <select
                  value={locality}
                  onChange={handleLocalityChange}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border-color text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                >
                  <option value="Bihta">Bihta</option>
                  <option value="Danapur">Danapur</option>
                  <option value="Bailey Road">Bailey Road</option>
                  <option value="Phulwari Sharif">Phulwari Sharif</option>
                  <option value="Kankarbagh">Kankarbagh</option>
                </select>
              </div>

              {/* Zoning Category */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Land Zoning Category</label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border-color text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Total Price (in ₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 4500000 (45 Lakhs)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border-color text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Size in Katha */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Size (in Katha / Bigha)</label>
                <input
                  type="text"
                  placeholder="e.g. 4 Katha"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border-color text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Size in Sq Ft */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Size (in Sq Ft)</label>
                <input
                  type="number"
                  placeholder="e.g. 5440"
                  value={sizeSqFt}
                  onChange={(e) => setSizeSqFt(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border-color text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Broker Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Contact Name (Broker/Owner)</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={brokerName}
                  onChange={(e) => setBrokerName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border-color text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="10-digit Mobile Number"
                  value={brokerPhone}
                  onChange={(e) => setBrokerPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border-color text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Description */}
              <div className="col-span-1 sm:col-span-2 flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Detailed Description</label>
                <textarea
                  placeholder="Provide boundaries information, road width in front of plot, water/electricity status, mutation details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border-color text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light h-[120px] resize-y"
                />
              </div>

              {/* Mock Upload Box */}
              <div className="col-span-1 sm:col-span-2 flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground-muted uppercase tracking-wider">Land Verification Registry Logs (7/12, Khata)</label>
                <div onClick={handleMockUpload} className="border-2 border-dashed border-border-color rounded-xl p-6 text-center cursor-pointer bg-background hover:border-primary hover:bg-primary-light flex flex-col items-center gap-3 transition-all">
                  <Upload size={32} className="text-primary" />
                  {isUploading ? (
                    <span className="text-sm font-bold text-foreground">Uploading documents...</span>
                  ) : uploadedFiles.length > 0 ? (
                    <div>
                      <div className="text-sm font-bold text-secondary flex items-center gap-1.5 justify-center">
                        <CheckCircle2 size={16} />
                        Documents Attached Successfully
                      </div>
                      <span className="text-xs text-foreground-muted">
                        {uploadedFiles.join(", ")}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-sm font-bold text-foreground">Click to upload PDF land deeds (7/12, Khata)</span>
                      <p className="text-xs text-foreground-muted mt-1">Attaching files speeds up the "Government Verified" audit badge.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="bg-secondary hover:bg-secondary-hover text-white font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 hover:-translate-y-0.5 transition-all duration-300">
              <CheckCircle2 size={18} />
              Publish Land Listing
            </button>
          </form>

          {/* Right Info Panels */}
          <div className="flex flex-col gap-8">
            {/* Interactive Map Selector */}
            <div className="bg-background-card border border-border-color rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MapIcon size={18} className="text-primary" />
                Plot Location on iMap
              </h3>
              <span className="text-[13px] text-foreground-muted leading-relaxed">
                Click on the satellite map below to drop a pin on the exact location of your plot boundaries.
              </span>
              <div className="h-[300px] rounded-xl overflow-hidden border border-border-color">
                <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
              </div>
              {selectedCoords ? (
                <div className="flex items-center gap-1.5 text-[13px] font-bold text-secondary">
                  <MapPin size={16} />
                  <span>Dropped Pin: {selectedCoords[0].toFixed(5)}, {selectedCoords[1].toFixed(5)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[13px] text-red-500 font-bold">
                  <AlertCircle size={16} />
                  <span>Please click on map to define coordinates pin.</span>
                </div>
              )}
            </div>

            {/* Help / FAQ */}
            <div className="bg-background-card border border-border-color rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-lg font-bold text-foreground">How to get a Verified Badge?</h3>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <ShieldCheck size={20} className="text-secondary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">1. Upload Records</h4>
                    <p className="text-[13px] text-foreground-muted leading-relaxed mt-0.5">Provide clear PDF copies of 7/12 mutation extracts, Khata holdings, or registration sale deeds.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <ShieldCheck size={20} className="text-secondary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">2. Geographic Audit</h4>
                    <p className="text-[13px] text-foreground-muted leading-relaxed mt-0.5">Our GIS engineers cross-reference the coordinates you pinned with Bihar government cadastral maps.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <ShieldCheck size={20} className="text-secondary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">3. Earn the Badge</h4>
                    <p className="text-[13px] text-foreground-muted leading-relaxed mt-0.5">Once verified, a green badge displays on your listing, increasing buyer inquiries by up to 300%.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
