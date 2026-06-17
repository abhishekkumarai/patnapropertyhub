# Google Analytics / Google Tag Manager Implementation

This codebase supports both **Google Analytics (GA4)** and **Google Tag Manager (GTM)**. They are implemented in the global layout file: `src/app/layout.tsx` using Next.js's optimized `<Script>` loader.

---

## 1. Google Analytics (GA4 / gtag.js)

### How it works
1. **Environment Check**: It checks if `process.env.NEXT_PUBLIC_GA_ID` is defined. This prevents the scripts from executing if no ID is configured.
2. **Library Loader**: It loads the external `gtag.js` script asynchronously using the `afterInteractive` strategy.
3. **Initialization**: It configures the global `dataLayer` and configures GA4 using the variable ID.

### Code snippet in `src/app/layout.tsx`
```tsx
{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      strategy="afterInteractive"
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
      `}
    </Script>
  </>
)}
```

---

## 2. Google Tag Manager (GTM / gtm.js)

### How it works
1. **Environment Check**: It checks if `process.env.NEXT_PUBLIC_GTM_ID` is defined.
2. **Main Loader**: It dynamically inserts the GTM script tag using Next.js's `<Script>` with `strategy="afterInteractive"`.
3. **Noscript Fallback**: It inserts a `<noscript>` iframe immediately inside the opening `<body>` tag to ensure tracking works for users who disable JavaScript.

### Code snippet in `src/app/layout.tsx`
**For `<noscript>` (directly inside the `<body>` element):**
```tsx
{process.env.NEXT_PUBLIC_GTM_ID && (
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
      height="0"
      width="0"
      style={{ display: "none", visibility: "hidden" }}
    />
  </noscript>
)}
```

**For the script tag (in the script declaration block):**
```tsx
{process.env.NEXT_PUBLIC_GTM_ID && (
  <Script id="google-tag-manager" strategy="afterInteractive">
    {`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
    `}
  </Script>
)}
```

---

## 3. Environment Variable Settings (`.env.local`)

To configure these services locally, add their respective IDs to your `.env.local` file:

```env
# Google Analytics 4 (GA4) ID
NEXT_PUBLIC_GA_ID="G-W8CLVVMZ0M"

# Google Tag Manager (GTM) ID
NEXT_PUBLIC_GTM_ID="GTM-WLQVMF72"
```

---

## 4. How to Verify if Google Tag/GTM is Working

### Method 1: Google Tag Assistant (Recommended)
1. Go to [Tag Assistant (tagassistant.google.com)](https://tagassistant.google.com/).
2. Click **Add Domain** and enter your site URL (works for `http://localhost:3000` as well).
3. Verify that your GTM ID (`GTM-WLQVMF72`) or GA4 ID (`G-W8CLVVMZ0M`) is listed as **Connected** and that the tag firing history shows the correct event triggers.

### Method 2: Browser Developer Tools
1. Open your website.
2. Open **Developer Tools** (`F12`) and navigate to the **Network** tab.
3. In the filter box, type `gtm.js` or `collect` to verify scripts are fetching successfully.
4. Go to the **Console** tab, type `window.dataLayer` and press Enter. You should see arrays initialized with the correct container and config details.

### Method 3: Google Analytics Realtime Dashboard
1. Log in to your [Google Analytics Account](https://analytics.google.com/).
2. Select your property and go to **Reports** > **Realtime** to confirm pageviews stream in live.
