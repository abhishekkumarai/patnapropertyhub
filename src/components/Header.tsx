"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin } from "lucide-react";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const navLinks = [
    { name: "iMap", href: "/imap" },
    { name: "Buy Land", href: "/properties" },
    { name: "Sell Land", href: "/sell" },
  ];

  return (
    <>
      <header className="sticky top-0 w-full h-[72px] bg-background-card/85 backdrop-blur-md border-b border-border-color z-[100] transition-all">
        <div className="flex h-full items-center justify-between max-w-[1280px] mx-auto px-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <button 
              className="block md:hidden p-2 text-foreground-muted hover:text-primary transition-colors" 
              onClick={toggleDrawer} 
              aria-label="Toggle navigation menu"
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center text-lg font-bold font-heading gap-2.5">
              <img 
                src="/logo.jpg" 
                alt="Patna Property Hub Logo" 
                className="w-9 h-9 rounded-full object-cover border border-secondary/20 shadow-sm"
              />
              <span>
                <span className="text-primary font-extrabold text-[22px]">Patna</span>
                <span className="text-secondary font-extrabold text-[22px]">PropertyHub</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[15px] font-semibold relative py-1 transition-all after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-secondary after:transition-all hover:after:w-full ${
                    isActive 
                      ? "text-primary after:w-full" 
                      : "text-foreground-muted hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-5">
            <Link href="/auth/signin" className="hidden md:block text-[15px] font-semibold text-foreground hover:text-primary transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-black/40 backdrop-blur-sm z-[999] transition-all duration-300 ${
          isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={toggleDrawer}
      />

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 w-[280px] h-full bg-background-card shadow-premium z-[1000] p-6 flex flex-col gap-8 transition-transform duration-300 ${
        isDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center text-lg font-bold font-heading gap-2" onClick={toggleDrawer}>
            <img 
              src="/logo.jpg" 
              alt="Patna Property Hub Logo" 
              className="w-8 h-8 rounded-full object-cover border border-secondary/20"
            />
            <span>
              <span className="text-primary font-extrabold text-[20px]">Patna</span>
              <span className="text-secondary font-extrabold text-[20px]">Hub</span>
            </span>
          </Link>
          <button className="text-foreground p-2" onClick={toggleDrawer} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[16px] font-semibold text-foreground py-2 border-b border-border-color-light hover:text-primary transition-all"
              onClick={toggleDrawer}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <Link href="/auth/signin" className="flex items-center justify-center bg-primary-light text-primary font-bold text-[15px] py-3 rounded-lg text-center hover:bg-primary-medium transition-all" onClick={toggleDrawer}>
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
