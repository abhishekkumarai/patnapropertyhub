"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Map, ShieldCheck, Handshake, ChevronRight, MapPin, Activity, Star, ExternalLink } from "lucide-react";

const PATNA_LOCALITIES = [
  "Bihta",
  "Danapur",
  "Bailey Road",
  "Phulwari Sharif",
  "Kankarbagh",
  "Saguna More",
  "Naubatpur",
  "Khagaul",
  "Digha",
  "Patna City"
];

export default function Home() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLFormElement>(null);

  // Handle typing search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim().length > 0) {
      const filtered = PATNA_LOCALITIES.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = (locality: string) => {
    setSearchValue(locality);
    setShowSuggestions(false);
    router.push(`/imap?search=${encodeURIComponent(locality)}`);
  };

  // Submit search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/imap?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push("/imap");
    }
  };

  const steps = [
    {
      num: "1",
      title: "Choose Location",
      desc: "Search Danapur, Bihta, or any key Patna growth corridor on our interactive map."
    },
    {
      num: "2",
      title: "Inspect Boundaries",
      desc: "Toggle Cadastral overlay maps and Town Planning Schemes to see actual plot dimensions."
    },
    {
      num: "3",
      title: "Verify Zoning",
      desc: "Verify if the land is Agricultural, Commercial, or Residential on Bihar Development Plan overlays."
    },
    {
      num: "4",
      title: "Direct Broker Contact",
      desc: "Download official mock land records and contact verified brokers directly. Zero commission."
    }
  ];

  const features = [
    {
      icon: <Map size={24} />,
      title: "Interactive Mapping",
      desc: "Move beyond standard listings. Move coordinates, overlay official masterplans, and view plot dimensions on Google Satellite layers."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Verified Land Records",
      desc: "All plots feature clean mock documentation logs, detailing past 7/12 entries, Khata (8A) registers, and Ferfar (6A) mutation certificates."
    },
    {
      icon: <Handshake size={24} />,
      title: "Direct Network - Zero Commission",
      desc: "We connect plot buyers directly with land brokers and owners. Buy, negotiate, and transact securely without middlemen fee hikes."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 border-b border-border-color overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(41, 65, 85, 0.85), rgba(41, 65, 85, 0.95)), url('/hero.png')"
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-6 lg:text-left text-center">
              <div className="self-center lg:self-start inline-flex items-center gap-1.5 bg-white/10 text-white font-bold text-xs px-4 py-1.5 rounded-full border border-white/20">
                <Activity size={14} />
                Patna's First Land-First GIS Platform
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                Buy Verified Land & Plots in <span className="bg-gradient-to-r from-secondary to-yellow-500 bg-clip-text text-transparent">Patna</span> on Interactive Maps
              </h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-[540px] mx-auto lg:mx-0">
                Explore agricultural, commercial, and residential plots in Patna's high-growth zones. Inspect actual boundaries, zoning laws, and land records instantly.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative max-w-[500px] w-full mx-auto lg:mx-0" ref={suggestionRef}>
                <div className="flex bg-background-card border-2 border-border-color rounded-full py-1.5 pl-5 pr-1.5 shadow-lg items-center gap-3 transition-all focus-within:border-secondary focus-within:shadow-premium">
                  <Search size={20} className="text-foreground-muted" />
                  <input
                    type="text"
                    placeholder="Search Danapur, Bihta, Bailey Road..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    onFocus={() => searchValue && setShowSuggestions(true)}
                    className="flex-1 border-none bg-transparent py-2 text-sm md:text-base font-semibold text-foreground focus:outline-none focus:ring-0"
                    aria-label="Search land in Patna"
                  />
                  <button type="submit" className="bg-secondary hover:bg-secondary-hover text-white font-bold text-sm md:text-base py-2.5 px-6 rounded-full inline-flex items-center gap-2 transition-all hover:scale-[1.02]">
                    Search
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-background-card border border-border-color rounded-xl shadow-lg z-10 max-h-[240px] overflow-y-auto">
                    {suggestions.map((locality) => (
                      <button
                        key={locality}
                        type="button"
                        className="w-full flex items-center gap-2.5 px-5 py-3 hover:bg-border-color-light hover:text-primary transition-all text-left text-sm font-medium text-foreground"
                        onClick={() => handleSuggestionClick(locality)}
                      >
                        <MapPin size={16} className="text-primary" />
                        <span>{locality}, Patna, Bihar</span>
                      </button>
                    ))}
                  </div>
                )}
              </form>

              {/* Statistics */}
              <div className="flex gap-8 justify-center lg:justify-start mt-4">
                <div className="flex flex-col">
                  <span className="font-heading text-[28px] font-extrabold text-white">1,200+</span>
                  <span className="text-[13px] text-slate-300 font-bold">Verified Plots</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-[28px] font-extrabold text-white">0%</span>
                  <span className="text-[13px] text-slate-300 font-bold">Broker Commission</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-[28px] font-extrabold text-white">250+</span>
                  <span className="text-[13px] text-slate-300 font-bold">Active Land Brokers</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Preview Box */}
            <div className="relative rounded-2xl overflow-hidden shadow-premium aspect-[4/3] border-4 border-background-card hover:-translate-y-1 transition-all duration-300">
              {/* Mock map imagery representing Leaflet GIS view */}
              <div
                className="w-full h-full bg-slate-800 relative flex items-center justify-center"
                style={{
                  backgroundImage: "radial-gradient(#334155 1.5px, transparent 1.5px)",
                  backgroundSize: "24px 24px"
                }}
              >
                {/* SVG mock map design with colored polygons representing plots */}
                <svg width="85%" height="80%" viewBox="0 0 400 300" style={{ opacity: 0.85 }}>
                  {/* Grid Lines */}
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#475569" strokeWidth="0.5" strokeDasharray="5,5" />
                  <line x1="0" y1="200" x2="400" y2="200" stroke="#475569" strokeWidth="0.5" strokeDasharray="5,5" />
                  <line x1="150" y1="0" x2="150" y2="300" stroke="#475569" strokeWidth="0.5" strokeDasharray="5,5" />
                  <line x1="300" y1="0" x2="300" y2="300" stroke="#475569" strokeWidth="0.5" strokeDasharray="5,5" />
                  
                  {/* Roads */}
                  <path d="M 0 120 Q 150 150 400 130" stroke="#cbd5e1" strokeWidth="12" fill="none" opacity="0.6" />
                  <path d="M 180 0 Q 170 140 220 300" stroke="#cbd5e1" strokeWidth="8" fill="none" opacity="0.6" />

                  {/* Land Parcels Polygons */}
                  {/* Agricultural Plots - Green */}
                  <polygon points="40,30 110,40 100,100 30,90" fill="#22c55e" fillOpacity="0.25" stroke="#22c55e" strokeWidth="1.5" />
                  <polygon points="120,35 170,40 160,110 110,105" fill="#22c55e" fillOpacity="0.25" stroke="#22c55e" strokeWidth="1.5" />
                  
                  {/* Residential Zone - Yellow */}
                  <polygon points="220,40 310,30 320,100 230,105" fill="#eab308" fillOpacity="0.25" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3,3" />
                  <polygon points="320,30 380,45 370,115 330,100" fill="#eab308" fillOpacity="0.25" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3,3" />

                  {/* Commercial Zone - Blue */}
                  <polygon points="50,170 140,165 130,250 40,240" fill="#3b82f6" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="1.5" />
                  
                  {/* Active Selected Plot highlight */}
                  <polygon points="240,180 340,170 330,260 250,270" fill="#0E4D92" fillOpacity="0.4" stroke="#73D1AC" strokeWidth="3" />
                  
                  {/* Pins */}
                  <circle cx="295" cy="220" r="6" fill="#ef4444" />
                  <circle cx="295" cy="220" r="12" stroke="#ef4444" strokeWidth="2" fill="none" style={{ animation: "pulse-soft 2s infinite" }} />
                </svg>

                {/* Satellite overlay badge mockup */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="text-[11px] font-bold bg-slate-900/85 px-2 py-1 rounded border border-white/10 text-white">
                    Satellite View
                  </span>
                  <span className="text-[11px] font-bold bg-secondary px-2 py-1 rounded text-white">
                    DP Active
                  </span>
                </div>
                
                {/* Bottom detail slide overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-6 text-white flex justify-between items-end">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-lg font-bold">Bihta Plot #214</span>
                    <span className="text-xs text-slate-300">Verified Cadastral Plot • 5 Katha • Residential Zone</span>
                  </div>
                  <Link href="/imap" className="bg-secondary hover:bg-secondary-hover text-white font-bold text-[13px] px-5 py-2.5 rounded-lg inline-flex items-center gap-1.5 transition-colors">
                    Explore iMap
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Features Grid */}
      <section className="bg-background-card py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[640px] mx-auto mb-16 flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Built for Professional Land Transactions</h2>
            <p className="text-sm md:text-base text-foreground-muted leading-relaxed">
              Whether you are a seasoned property investor, developer, or looking for a home-building plot, we simplify Patna land purchases.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-background-card border border-border-color rounded-2xl p-8 shadow-sm flex flex-col gap-4 hover:-translate-y-1.5 hover:shadow-lg hover:border-primary-medium transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-light text-primary">{feature.icon}</div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-foreground-muted text-[13px] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localities List */}
      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[640px] mx-auto mb-16 flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Browse Patna Growth Corridors</h2>
            <p className="text-sm md:text-base text-foreground-muted leading-relaxed">
              Explore verified plots ready for immediate possession in Patna's most sought-after localities.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PATNA_LOCALITIES.slice(0, 8).map((locality) => (
              <Link key={locality} href={`/properties?locality=${encodeURIComponent(locality)}`} className="bg-background border border-border-color rounded-xl p-6 flex flex-col gap-2 hover:bg-background-card hover:border-secondary hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-[17px] font-bold text-foreground">{locality}</span>
                <span className="text-[12px] text-foreground-muted font-bold">
                  {locality === "Bihta" ? "42 Plots" : locality === "Danapur" ? "35 Plots" : "15+ Plots"} • Zero Brokerage
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-background-card py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[640px] mx-auto mb-16 flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">How Patna Property Hub Works</h2>
            <p className="text-sm md:text-base text-foreground-muted leading-relaxed">
              Skip the opaque listings. We offer a transparent, boundary-mapped, document-verified search workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col gap-4 text-center items-center">
                <div className="w-[44px] h-[44px] rounded-full bg-secondary text-white font-extrabold text-[18px] flex items-center justify-center shadow-lg shadow-secondary/30">{step.num}</div>
                <h3 className="text-[17px] font-bold">{step.title}</h3>
                <p className="text-[13px] text-foreground-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Google Reviews & Office Location Section */}
      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            {/* Left: Testimonials Grid */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 font-bold text-xs px-3.5 py-1.5 rounded-full border border-yellow-500/20 self-start">
                  <Star size={14} className="fill-yellow-500" />
                  <span>4.9 Rating on Google Maps</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Verified Client Testimonials</h2>
                <p className="text-sm md:text-base text-foreground-muted leading-relaxed max-w-[540px]">
                  See what buyers and landowners say about Patna Property Hub's transparent consulting and map-integrated services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background-card border border-border-color rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-current" />
                      ))}
                    </div>
                    <p className="text-foreground-muted text-[13px] leading-relaxed">
                      "Highly professional real estate agency in Patna! They helped us buy a residential plot in Saguna Khagaul Road. The entire boundary verification and document checks were handled perfectly."
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-light text-primary font-bold text-sm flex items-center justify-center">AK</div>
                    <div>
                      <h4 className="text-[13px] font-bold text-foreground">Amit Kumar</h4>
                      <span className="text-[11px] text-foreground-muted">Plot Buyer, Saguna More</span>
                    </div>
                  </div>
                </div>

                <div className="bg-background-card border border-border-color rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-current" />
                      ))}
                    </div>
                    <p className="text-foreground-muted text-[13px] leading-relaxed">
                      "Very transparent dealings. No hidden charges or extra broker fees. Their GIS layering map tool makes it extremely easy to visualize land layout plans before visiting the site."
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary-light text-secondary font-bold text-sm flex items-center justify-center">PS</div>
                    <div>
                      <h4 className="text-[13px] font-bold text-foreground">Priyadarshini Singh</h4>
                      <span className="text-[11px] text-foreground-muted">Investor, Danapur Corridor</span>
                    </div>
                  </div>
                </div>

                <div className="bg-background-card border border-border-color rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4 md:col-span-2">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-current" />
                      ))}
                    </div>
                    <p className="text-foreground-muted text-[13px] leading-relaxed">
                      "Best property consultant in the Balaji Nagar area. The office is located in Pragati Tower. Very responsive staff, accurate information about land zones, and direct developer connect without any middlemen markup."
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center justify-center">RR</div>
                      <div>
                        <h4 className="text-[13px] font-bold text-foreground">Rajeev Ranjan</h4>
                        <span className="text-[11px] text-foreground-muted">Landowner, Phulwari Sharif</span>
                      </div>
                    </div>
                    <a
                      href="https://www.google.com/maps/place/Patna+property+hub/@25.6108534,85.039093,777m/data=!3m1!1e3!4m6!3m5!1s0x39ed57b4c109f9fd:0xa5140fcadd2a6683!8m2!3d25.6108486!4d85.0416679!16s%2Fg%2F11c74ck7s7?entry=ttu&g_ep=EgoyMDI2MDUyNS4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
                    >
                      Read all reviews on Google Maps <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Office Map Location Box */}
            <div className="bg-background-card border border-border-color rounded-2xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MapPin size={22} className="text-secondary shrink-0" />
                Office Headquarters
              </h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider">Office Address</span>
                  <p className="text-[13px] font-medium text-foreground leading-relaxed">
                    408, Pragati tower, Saguna Khagaul Rd, opposite St. karen's secondary school, Balaji Nagar, Patna, Bihar 801503
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider">Phone number</span>
                  <a href="tel:09472969648" className="text-[14px] font-bold text-primary hover:underline self-start">
                    09472969648
                  </a>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider">Social Links</span>
                  <div className="flex gap-3 mt-1.5">
                    <a href="https://www.facebook.com/pphub/" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-100 hover:bg-primary hover:text-white px-3.5 py-1.5 rounded-lg font-bold text-foreground-muted transition-all duration-300">
                      Facebook Page
                    </a>
                    <a href="https://www.instagram.com/propertyhubpatna1/" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-100 hover:bg-primary hover:text-white px-3.5 py-1.5 rounded-lg font-bold text-foreground-muted transition-all duration-300">
                      Instagram Profile
                    </a>
                  </div>
                </div>
              </div>

              {/* Mock Map Image Representation for Location */}
              <div className="h-[200px] rounded-xl overflow-hidden border border-border-color relative bg-slate-900 flex items-center justify-center">
                <div 
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }}
                />
                {/* SVG mock map marker highlight for headquarters */}
                <svg width="100%" height="100%" viewBox="0 0 300 200" className="relative z-10">
                  {/* Roads */}
                  <path d="M 0 80 L 300 120" stroke="#475569" strokeWidth="16" fill="none" opacity="0.4" />
                  <path d="M 120 0 L 180 200" stroke="#475569" strokeWidth="12" fill="none" opacity="0.4" />
                  {/* Opposite Landmark Text */}
                  <text x="10" y="55" fill="#94a3b8" fontSize="10" fontWeight="bold">St. Karen's Secondary School</text>
                  {/* Pragati Tower Office Landmark Box */}
                  <rect x="180" y="125" width="80" height="50" rx="6" fill="#0E4D92" fillOpacity="0.2" stroke="#0E4D92" strokeWidth="2" />
                  <text x="188" y="145" fill="#f8fafc" fontSize="9" fontWeight="extrabold">Pragati Tower</text>
                  <text x="188" y="157" fill="#cbd5e1" fontSize="8" fontWeight="bold">Office Suite 408</text>
                  {/* Active Pin at HQ */}
                  <circle cx="210" cy="115" r="5" fill="#ef4444" />
                  <circle cx="210" cy="115" r="10" stroke="#ef4444" strokeWidth="1.5" fill="none" />
                </svg>
                <div className="absolute bottom-3 right-3">
                  <a
                    href="https://www.google.com/maps/place/Patna+property+hub/@25.6108534,85.039093,777m/data=!3m1!1e3!4m6!3m5!1s0x39ed57b4c109f9fd:0xa5140fcadd2a6683!8m2!3d25.6108486!4d85.0416679!16s%2Fg%2F11c74ck7s7?entry=ttu&g_ep=EgoyMDI2MDUyNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary hover:bg-secondary-hover text-white text-[11px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 shadow-md transition-colors"
                  >
                    Open Google Maps
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-20 text-center">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col items-center gap-6 max-w-[640px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Are you a Landowner or Broker?</h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              List your properties for free. Draw your boundaries on our interactive maps, upload ownership documents, and reach over 10,000 active investors directly. All GIS layers and document verification features are completely free.
            </p>
            <Link href="/sell" className="bg-secondary hover:bg-secondary-hover text-white font-bold text-[15px] px-8 py-3.5 rounded-full shadow-lg shadow-secondary/40 hover:-translate-y-0.5 transition-all duration-300">
              List Your Land Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
