import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function WelcomeScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold mb-4"
      >
        ⚡ Team Powerhouse ⚡
      </motion.h1>
      <p className="text-lg">Wireless Solar Charging Dashboard</p>
    </div>
  );
}
