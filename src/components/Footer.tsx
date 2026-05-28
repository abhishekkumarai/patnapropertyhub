import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Interactive iMap", href: "/imap" },
    { name: "Browse Lands", href: "/properties" },
    { name: "Sell Property", href: "/sell" },
  ];

  const localities = [
    { name: "Danapur Plots", href: "/properties?locality=Danapur" },
    { name: "Bihta Land", href: "/properties?locality=Bihta" },
    { name: "Bailey Road Plots", href: "/properties?locality=Bailey Road" },
    { name: "Phulwari Sharif Land", href: "/properties?locality=Phulwari Sharif" },
    { name: "Kankarbagh Plots", href: "/properties?locality=Kankarbagh" },
  ];

  return (
    <footer className="bg-background-footer text-slate-400 py-16 pb-8 border-t border-border-color text-sm">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center text-lg font-bold font-heading gap-2.5 mb-2">
              <img 
                src="/logo.jpg" 
                alt="Patna Property Hub Logo" 
                className="w-8 h-8 rounded-full object-cover border border-secondary/20"
              />
              <span>
                <span className="text-white font-extrabold text-[20px]">Patna</span>
                <span className="text-secondary font-extrabold text-[20px]">PropertyHub</span>
              </span>
            </Link>
            <p className="leading-relaxed max-w-[320px] text-slate-400">
              Patna's premier land aggregation platform. Visualize boundary lines, government development schemes, and cadastral maps before making your investment. Zero commission, direct broker network.
            </p>
            <div className="flex gap-4 mt-3">
              <a href="https://www.facebook.com/pphub/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-slate-100 hover:bg-primary hover:-translate-y-0.5 transition-all duration-300" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/propertyhubpatna1/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-slate-100 hover:bg-primary hover:-translate-y-0.5 transition-all duration-300" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.google.com/maps/place/Patna+property+hub/@25.6108534,85.039093,777m/data=!3m1!1e3!4m6!3m5!1s0x39ed57b4c109f9fd:0xa5140fcadd2a6683!8m2!3d25.6108486!4d85.0416679!16s%2Fg%2F11c74ck7s7?entry=ttu&g_ep=EgoyMDI2MDUyNS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-slate-100 hover:bg-primary hover:-translate-y-0.5 transition-all duration-300" aria-label="Google Maps">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-heading text-[15px] font-bold text-white mb-5 uppercase tracking-wider">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-secondary hover:pl-1 transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Areas Column */}
          <div>
            <h3 className="font-heading text-[15px] font-bold text-white mb-5 uppercase tracking-wider">Localities</h3>
            <ul className="flex flex-col gap-3">
              {localities.map((loc) => (
                <li key={loc.name}>
                  <Link href={loc.href} className="text-slate-400 hover:text-secondary hover:pl-1 transition-all">
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h3 className="font-heading text-[15px] font-bold text-white mb-5 uppercase tracking-wider">Contact Us</h3>
            <ul className="flex flex-col gap-3.5">
              <li className="flex items-start gap-2.5 leading-relaxed">
                <MapPin size={20} className="text-secondary mt-1 shrink-0" />
                <a 
                  href="https://www.google.com/maps/place/Patna+property+hub/@25.6108534,85.039093,777m/data=!3m1!1e3!4m6!3m5!1s0x39ed57b4c109f9fd:0xa5140fcadd2a6683!8m2!3d25.6108486!4d85.0416679!16s%2Fg%2F11c74ck7s7?entry=ttu&g_ep=EgoyMDI2MDUyNS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  408, Pragati tower, Saguna Khagaul Rd, opposite St. karen's secondary school, Balaji Nagar, Patna, Bihar 801503
                </a>
              </li>
              <li className="flex items-start gap-2.5 leading-relaxed">
                <Phone size={18} className="text-secondary mt-1 shrink-0" />
                <a href="tel:09472969648" className="hover:text-white transition-colors">09472969648</a>
              </li>
              <li className="flex items-start gap-2.5 leading-relaxed">
                <Mail size={18} className="text-secondary mt-1 shrink-0" />
                <a href="mailto:support@patnapropertyhub.com" className="hover:text-white transition-colors">support@patnapropertyhub.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom copyright and legals */}
        <div className="border-t border-white/5 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs sm:text-sm">
            &copy; {currentYear} Patna Property Hub. Built with Next.js & Tailwind v4. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-slate-500 text-xs sm:text-sm hover:text-secondary transition-colors">
              Terms of Use
            </Link>
            <Link href="/privacy" className="text-slate-500 text-xs sm:text-sm hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="text-slate-500 text-xs sm:text-sm hover:text-secondary transition-colors">
              GIS Data Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
