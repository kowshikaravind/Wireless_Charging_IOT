import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function WelcomeScreen({ onFinish }) {
  const TOTAL_TIME = 5; // in seconds
  const [remainingTime, setRemainingTime] = useState(TOTAL_TIME);

  // ✅ Trigger exit exactly after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.();
    }, TOTAL_TIME * 1000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  // ✅ Countdown updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate fixed positions for stars and lines on mount to prevent repositioning on re-renders
  const stars = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }));
  }, []);

  const lightRays = useMemo(() => {
    return [...Array(35)].map((_, i) => ({
      id: i,
      width: `${Math.random() * 300 + 150}px`,
      height: `${Math.random() * 3 + 1}px`,
      top: `${Math.random() * 100}%`,
      rotate: `${Math.random() * 360}deg`,
      duration: Math.random() * 15 + 6,
      delay: Math.random() * 5,
      direction: Math.random() > 0.5 ? "leftToRight" : "rightToLeft",
    }));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.4 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 15 } },
  };

  const titleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 25, duration: 0.8 } },
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-white relative overflow-hidden bg-slate-950">
      {/* 🌌 Enhanced Cinematic Background: Multi-Layer Gradient for Depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            /* Layer 1: Deep space base gradient */
            radial-gradient(ellipse at 20% 20%, rgba(15,23,42,1) 0%, rgba(30,27,75,0.8) 50%, rgba(51,65,85,1) 100%),
            /* Layer 2: Nebula glows with multiple radials */
            radial-gradient(circle at 10% 70%, rgba(99,102,241,0.5) 0%, transparent 70%),
            radial-gradient(circle at 70% 20%, rgba(139,92,246,0.4) 0%, transparent 60%),
            radial-gradient(circle at 90% 90%, rgba(16,185,129,0.3) 0%, transparent 50%),
            /* Layer 3: Subtle starry overlay */
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 40%),
            /* Layer 4: Additional faint cosmic dust */
            radial-gradient(ellipse at 40% 80%, rgba(236,72,153,0.1) 0%, transparent 80%)
          `,
          backgroundBlendMode: "overlay, normal, screen, overlay",
        }}
      />

      {/* ⚡ Subtle Pulsating Thunder Glow Layers - Low opacity to avoid overwhelming content */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-emerald-500/15 rounded-full blur-3xl"
        style={{ zIndex: 1 }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 3, -3, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-red-400/10 rounded-full blur-2xl"
        style={{ 
          top: "10%", 
          left: "10%", 
          width: "80%", 
          height: "80%",
          zIndex: 1 
        }}
        animate={{
          scale: [0.9, 1.05, 0.9],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* 🌠 Twinkling Stars Effect - Fixed positions, smooth twinkling (opacity + subtle scale) */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
            style={{
              top: star.top,
              left: star.left,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 2 + 1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ☄️ Enhanced Moving Light Rays - Fixed initial positions, smooth horizontal movement */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 3 }}>
        {lightRays.map((ray) => (
          <motion.div
            key={ray.id}
            className="absolute bg-gradient-to-r from-white/15 via-white/30 to-transparent rounded-full"
            style={{
              width: ray.width,
              height: ray.height,
              top: ray.top,
              rotate: ray.rotate,
              transformOrigin: "left center",
              left: ray.direction === "leftToRight" ? "-60%" : "100%",
            }}
            animate={{
              left: ray.direction === "leftToRight" ? "160%" : "-60%",
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: ray.duration,
              repeat: Infinity,
              ease: "linear",
              delay: ray.delay,
            }}
          />
        ))}
      </div>

      {/* ✨ Loading Dots - Adjusted position and size for better spacing */}
      <div className="absolute bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4 z-30">
        {[0, 0.3, 0.6].map((delay, idx) => (
          <motion.div
            key={idx}
            className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-indigo-400/60 to-purple-400/60 rounded-full shadow-lg"
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, delay }}
          />
        ))}
      </div>

      {/* ⚡ Main Content - Improved spacing with responsive adjustments */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center z-40 text-center px-4 md:px-8 max-w-4xl w-full py-12 md:py-16"
        style={{ minHeight: "80vh" }} // Ensures vertical breathing room
      >
        {/* 🚀 Title Section - Enhanced spacing and responsive sizing */}
        <motion.div variants={titleVariants} className="mb-12 md:mb-16 lg:mb-20">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.02em] bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200 drop-shadow-2xl flex items-center justify-center gap-2 md:gap-4 leading-none">
            POWER HOUSE
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-semibold text-slate-300 mt-6 md:mt-8 max-w-2xl lg:max-w-3xl mx-auto leading-6 md:leading-7 lg:leading-8 tracking-wide">
            Wireless Charging with Renewable Energy based <br />
            <span className="text-indigo-300 font-bold">Bidirectional Charging</span> &{" "}
            <span className="text-purple-300 font-bold">Secured IoT Authentication</span>
          </p>
        </motion.div>

        {/* 🪄 Tagline - Adjusted margins for balanced spacing */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-12 md:mb-16 lg:mb-20 max-w-2xl lg:max-w-3xl mx-auto italic font-light leading-7 md:leading-8 lg:leading-9 tracking-wide"
        >
          “Empowering the future with seamless <span className="text-indigo-300 not-italic font-semibold">wireless solar energy</span>.”
        </motion.p>

        {/* 📊 Progress Bar - Centered with improved spacing */}
        <div className="w-full max-w-xl md:max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <span className="text-sm sm:text-base md:text-lg font-semibold text-slate-300 tracking-wide">Initializing Dashboard...</span>
            <span className="text-sm sm:text-base md:text-lg font-bold text-slate-100">{remainingTime}s</span>
          </div>
          <div className="relative w-full bg-slate-800/60 rounded-full h-2.5 md:h-3 overflow-hidden border border-slate-600/50 shadow-inner">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: TOTAL_TIME,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent h-full rounded-full"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: TOTAL_TIME, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>

      {/* 📌 Footer - Adjusted positioning for better bottom spacing */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 md:bottom-8 text-center text-slate-400 text-xs sm:text-sm tracking-widest z-40"
      >
        © 2025 POWER HOUSE | Built with React ⚛️
      </motion.p>
    </div>
  );
}