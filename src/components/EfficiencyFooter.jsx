import React from "react";
import { motion } from "framer-motion";

export default function EfficiencyFooter({ efficiency, transmitterVoltage, transmitterCurrent, receiverVoltage, receiverCurrent }) {
  return (
    <motion.footer className="w-full max-w-4xl mt-6 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-slate-500/20 text-center">
      <h3 className="text-lg font-bold text-slate-200 mb-2">🔋 System Efficiency</h3>
      <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-emerald-300 mb-1">
        {efficiency.toFixed(1)}%
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${efficiency}%` }}
          transition={{ duration: 1.2 }}
          className="bg-gradient-to-r from-purple-400 via-indigo-400 to-emerald-400 h-2 rounded-full"
        />
      </div>
      <p className="text-xs text-slate-400">
        Power Transfer: {(transmitterVoltage * transmitterCurrent).toFixed(1)}W → {(receiverVoltage * receiverCurrent).toFixed(1)}W
      </p>
    </motion.footer>
  );
}
