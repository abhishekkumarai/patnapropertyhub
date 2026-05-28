import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Buy Land & Plots in Patna | Verified Plots on Interactive Maps",
  description:
    "Discover verified plots and agricultural land across Patna, Bihar on interactive maps. Access Cadastral, DP, and TP overlays. Connect directly with brokers. Zero commission.",
  keywords: "patna property, land in patna, plots for sale in patna, bihta plots, danapur land, verified plots bihar, interactive map real estate, cadastral map patna, development plan bihar",
  authors: [{ name: "Patna Property Hub" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://patnapropertyhub.com",
  },
  openGraph: {
    title: "Buy Land & Plots in Patna | Verified Plots on Interactive Maps",
    description: "Discover verified plots and agricultural land across Patna on interactive maps with DP/TP layouts. Zero commission.",
    url: "https://patnapropertyhub.com",
    siteName: "Patna Property Hub",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          margin: 0,
        }}
      >
        <Header />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </main>
        <Footer />

        {/* Floating WhatsApp Button */}
        <a 
          href="https://api.whatsapp.com/send?phone=%2B919472969648&token=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyNSJ9.eyJleHAiOjE3ODAwNjMzMjgsInBob25lIjoiKzkxOTQ3Mjk2OTY0OCIsImNvbnRleHQiOiJBZmo1YnFBUlVZX3hIN25HbHJJeHlyYjBaZ2V0Y2JzenRPSjk5bmlRV2VHM3dnZlZtTGFnZDFuRnNpZzljVm9jVmRjc0RWWDZfMVVpQ0gxMm1MRzFqejN3ekxVYktENU9mRTdnRXV6cVgtaGRSUHRQa0FaejJEZXMwdG84ZVB2bV82aFJuV3R4Tm4zY0dGd25rX2tGM0cxczhnIiwic291cmNlIjoiRkJfUGFnZSIsImFwcCI6ImZhY2Vib29rIiwiZW50cnlfcG9pbnQiOiJwYWdlX2N0YSJ9.BAfLdiCH-8s58n_zmJMJ_wfA-SNikphsS3j9aeWEO3ysqCju_-hqdhFvFvLtPHLO6wrzDiJtLs6GOf1RNDSUgQ&fbclid=IwY2xjawSFLFpleHRuA2FlbQIxMABicmlkETFtaHZTYVFJd1RQTGNYU2hVc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHgufSmQA9e5bX9KK2wEuMSMPyBXTBk0pTF3OkqjZ_2E1wWmxVeCKxenTJVXZ_aem_n9hCPD213_JgBrn69QXPmg" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "#25D366",
            color: "white",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            transition: "all 0.3s ease",
          }}
          className="hover:scale-110 active:scale-95 flex"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </body>
    </html>
  );
}
