import React from "react";
import { motion } from "framer-motion";

export default function LocationSection({ location, gpsStatus, locationError, requestLocationPermission }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-7xl mb-6 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-blue-500/20 shadow-xl text-center"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-slate-200">📍 Device Location</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          gpsStatus.includes("Active")
            ? "bg-green-500/20 text-green-300 border border-green-500/30"
            : gpsStatus.includes("Requesting") || gpsStatus.includes("Initializing")
            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
            : "bg-red-500/20 text-red-300 border border-red-500/30"
        }`}>
          {gpsStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <div className="bg-white/10 p-3 rounded-xl border border-blue-400/30">
          <h4 className="text-blue-200 text-sm font-semibold mb-1">Latitude</h4>
          <p className="text-xl font-black text-white">
            {location.latitude ? `${location.latitude.toFixed(6)}°` : "---"}
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl border border-blue-400/30">
          <h4 className="text-blue-200 text-sm font-semibold mb-1">Longitude</h4>
          <p className="text-xl font-black text-white">
            {location.longitude ? `${location.longitude.toFixed(6)}°` : "---"}
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl border border-blue-400/30">
          <h4 className="text-blue-200 text-sm font-semibold mb-1">Location</h4>
          <p className="text-lg font-black text-white truncate" title={location.name}>
            {location.name}
          </p>
        </div>
      </div>

      {locationError && (
        <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 mb-2">
          <p className="text-xs text-red-300 mb-2">{locationError}</p>
          <button
            onClick={requestLocationPermission}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold rounded-lg border border-blue-500/30 transition-colors"
          >
            Retry Location Access
          </button>
        </div>
      )}

      <p className="text-xs text-slate-400">
        {gpsStatus.includes("Active")
          ? "Real-time GPS tracking active"
          : "Location services required for accurate tracking"
        }
      </p>
    </motion.section>
  );
}
