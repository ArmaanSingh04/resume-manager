"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

interface Navbar1Props {
  hasSession?: boolean;
}

const Navbar1 = ({ hasSession = false }: Navbar1Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/#about-us" },
    { name: "Features", href: "/#features" },
    { name: "How it works", href: "/#how-it-works" }
  ];

  return (
    <div className="flex justify-center w-full py-6 px-4">
      {/* Outer Shell - Dark Theme */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#18181b]/80 border border-[#292813] backdrop-blur-md rounded-full shadow-lg shadow-black/50 w-full max-w-3xl relative z-50">
        
        {/* Brand Slot with Resume Emoji */}
        <div className="flex items-center">
          <Link href="/">
            <motion.div
              className="w-8 h-8 mr-6 flex items-center justify-center cursor-pointer text-2xl select-none"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              📄
            </motion.div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href={item.href} className="text-sm text-[#aaaaaf] hover:text-[#f9f871] transition-colors font-medium">
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop CTA Button - Yellowish Theme */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          {hasSession ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-5 py-2 text-sm text-[#111010] bg-[#f9f871] hover:bg-[#fffc94] font-semibold rounded-full transition-all active:scale-95 shadow-md shadow-[#f9f871]/10"
            >
              Go to App
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2 text-sm text-[#111010] bg-[#f9f871] hover:bg-[#fffc94] font-semibold rounded-full transition-all active:scale-95 shadow-md shadow-[#f9f871]/10"
            >
              Sign In
            </Link>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button className="md:hidden flex items-center p-1" onClick={toggleMenu} whileTap={{ scale: 0.9 }}>
          {isOpen ? (
            <X className="h-6 w-6 text-[#f9f871]" />
          ) : (
            <Menu className="h-6 w-6 text-[#f9f871]" />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu Overlay - Dark Theme */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-[#111010]/95 backdrop-blur-lg z-40 pt-24 px-6 md:hidden flex flex-col justify-start"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button inside mobile menu */}
            <motion.button
              className="absolute top-6 right-6 p-2 text-[#f9f871]"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.button>
            
            <div className="flex flex-col space-y-6">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link 
                    href={item.href} 
                    className="text-lg text-[#aaaaaf] hover:text-[#f9f871] font-medium block py-2 border-b border-zinc-800" 
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                {hasSession ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-[#111010] bg-[#f9f871] hover:bg-[#fffc94] font-bold rounded-full transition-colors shadow-md shadow-[#f9f871]/15"
                    onClick={toggleMenu}
                  >
                    Go to App
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-[#111010] bg-[#f9f871] hover:bg-[#fffc94] font-bold rounded-full transition-colors shadow-md shadow-[#f9f871]/15"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Navbar1 };
