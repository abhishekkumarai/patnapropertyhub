# Technical Architecture - Patna Property Hub

Patna Property Hub is a GIS-enabled real estate aggregator clone of `mypropertymap.com` built on the **Next.js 16 (App Router)** framework. The site focuses on simplifying land transactions by mapping physical boundaries and zoning overlays in Patna's high-growth corridors.

---

## 1. Directory Structure

The project files are structured as follows:

```
patnapropertyhub/
├── public/                 # Static assets (images, logos)
├── src/
│   ├── app/                # Next.js App Router (pages and layouts)
│   │   ├── globals.css     # Design system tokens and global styles (Tailwind CSS v4.0)
│   │   ├── layout.tsx      # Root template (Header, Footer, Metadata)
│   │   ├── page.tsx        # Homepage (Client search + stats)
│   │   ├── imap/           # iMap Dashboard Route
│   │   │   ├── page.tsx    # Page loader (next/dynamic import)
│   │   │   └── MapComponent.tsx # GIS Leaflet map implementation
│   │   ├── properties/     # Buy Land listings grid
│   │   │   └── page.tsx    
│   │   └── sell/           # Sell Land portal
│   │       ├── page.tsx    
│   │       └── SellComponent.tsx
│   ├── components/         # Common Layout Components
│   │   ├── Header.tsx      # Responsive header & drawer menu
│   │   └── Footer.tsx      # Address links & locality browse links
│   └── data/               # Static dataset
│       └── properties.ts   # Property structures, lat/lngs, boundaries
├── tsconfig.json           # TypeScript configuration
├── package.json            # Node dependencies
└── README.md               # Quickstart & Vercel instructions
```

---

## 2. Component Architecture & Data Flow

### A. GIS Mapping Integration (Leaflet.js)
Leaflet depends strongly on browser APIs (e.g. `window`, `document`) which throw errors during Next.js server-side builds.
- **SSR Bypassing**: `src/app/imap/page.tsx` uses `next/dynamic` to load `MapComponent.tsx` with `{ ssr: false }`, deferring map generation completely to client-side runtimes.
- **Direct Leaflet Init**: Rather than wrapping Leaflet elements in React components (which has compatibility bugs with React 19), `MapComponent.tsx` initializes vanilla Leaflet inside a `useEffect` hook. This provides raw access to draw coordinates, clear paths, and pan/zoom cleanly.
- **Interactions Sync**: Clicking map polygons triggers React callbacks setting the `selectedProperty` state, which slides open the details card drawer in the UI. Conversely, clicking sidebar listings centers and zooms the map.

### B. Styling System (Tailwind CSS v4.0)
The application styling is fully migrated to **Tailwind CSS v4.0**:
- All components use utility classes. Custom themes are configured directly in `src/app/globals.css` using the `@theme` directive, which maps design tokens (brand blue `#0E4D92`, secondary emerald green `#3FB488`, custom shadows, and fonts) directly into Tailwind CSS classes.
- Dark mode is supported natively via Tailwind's media utility classes and CSS variables inside `@media (prefers-color-scheme: dark)`.

---

## 3. Integrated Services (Mock Layer)

To deliver a premium, fully-functional UX without forcing external API keys:
1. **Mock Land Record Verification**:
   - Clicking a plot’s documents in the iMap drawer opens the **Bihar Land Record Verification Portal** simulator.
   - It outputs mock digitized copies of **Form 7/12 (Land Mutation)**, **Form 8A (Khata Holding)**, and **Form 6A (Ferfar Mutation Entry)** using official sub-registrar signatures and stamp designs. All land records are accessible for free without subscription gates.
2. **Driving Route Path**:
   - Selecting a plot in the dashboard lets users click "Show Route from Patna Station".
   - The map dynamically computes and draws a mock polyline path from Patna Junction coordinates `[25.6022, 85.1360]` directly to the property parcel.
3. **Zoning & GIS Overlays**:
   - Users can toggle high-fidelity GIS map layers (Cadastral boundaries, development master plans, and town planning schemes) instantly and free of charge.
