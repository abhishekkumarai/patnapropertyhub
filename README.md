# Patna Property Hub (MyPropertyMap Clone)

Patna Property Hub is a premium real estate mapping platform focusing on agricultural, commercial, and residential plots in Patna, Bihar, India. It clones the GIS-layering features of `mypropertymap.com` using Next.js 16 and Tailwind CSS v4.0.

---

## Key Features

1. **Interactive iMap Dashboard**:
   - Leaflet satellite/street maps displaying Patna land parcels.
   - Interactive GIS layers: **Cadastral borders**, **Development Plan (DP)** color-coded zoning, and **Town Planning (T.P.) Schemes** layout grids.
   - Spatial searches panning to Patna coordinates (Danapur, Bihta, Bailey Road, Phulwari Sharif, Kankarbagh).
2. **Land Document Registry Auditor**:
   - Digitized mock copies of Bihar government land deeds: **Record 7/12**, **Khata (8A) Holding**, and **Ferfar (6A) Mutation**.
   - Fully open and accessible to all users for free (no paywalls or premium gates).
3. **Broker Listing Portal**:
   - Point-and-click satellite map coordinate picker for registering new plots.
4. **Zero Commission Broker Network**:
   - Direct lead generation popup callback forms.

---

## Local Development

Follow these steps to set up and run the project on your machine:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Verify Production Compilation
Ensure the Next.js static builder compiles successfully without any TypeScript or server-side rendering errors:
```bash
npm run build
```

---

## Deploy to Vercel

The application is fully prepared to be hosted on Vercel. Deploy it directly using the Vercel CLI:

### 1. Log In to Vercel CLI
```bash
npx vercel login
```

### 2. Setup and Link Project
Run this command in the project root to initialize, configure, and link your local project to Vercel:
```bash
npx vercel
```
*Follow the terminal prompts (choose your team, link to a new project, name it `patnapropertyhub`, and confirm default configurations).*

### 3. Production Deployment
Build and publish the final production bundle:
```bash
npx vercel --prod
```
Once completed, Vercel will provide the live, secure URL hosting your Patna Property Hub application.
