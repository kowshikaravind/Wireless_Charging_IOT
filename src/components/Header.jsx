import React from "react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <>
      <motion.h1
        className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-emerald-300 drop-shadow-2xl text-center mb-4 leading-tight md:leading-snug lg:leading-normal pt-2"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ⚡ Wireless Charging Dashboard
      </motion.h1>

      <p className="text-xs md:text-sm text-slate-300 mb-8 text-center">
        Real-time monitoring & bidirectional energy flow
      </p>
      
    </>
  );
}
