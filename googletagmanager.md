# Google Analytics / Google Tag Manager Implementation

In this codebase, Google Analytics (Google Tag) is implemented in the global layout file: `src/app/layout.tsx`.

It uses Next.js's native `<Script>` component and relies on an environment variable (`NEXT_PUBLIC_GA_ID`).

## How it works

1. **Environment Check**: It first checks if `process.env.NEXT_PUBLIC_GA_ID` is defined. This prevents the tag from running if no Google Analytics Measurement ID is provided (e.g., during local development without the variable).

2. **External Script Loader**: It loads the `gtag.js` library directly from Google Tag Manager using the `afterInteractive` strategy so it doesn't block page load:
   ```tsx
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
     strategy="afterInteractive"
   />
   ```

3. **Initialization Script**: It then runs the standard initialization block to set up the `dataLayer` and configure the tracker with the ID:
   ```tsx
   <Script id="google-analytics" strategy="afterInteractive">
     {`
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
     `}
   </Script>
   ```

*(Note: Additionally, Vercel's native Analytics is also added via the `<Analytics />` component from `@vercel/analytics/react` in the same layout file)*.

## Enabling Analytics

To enable Google Analytics in your deployment, you just need to ensure `NEXT_PUBLIC_GA_ID` is set to your Measurement ID (e.g., `G-W8CLVVMZ0M`) in your Vercel project environment variables.
