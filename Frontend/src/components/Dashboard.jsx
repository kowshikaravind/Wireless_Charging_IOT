import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion"; // Assuming framer-motion is installed for smooth animations

export default function Dashboard() {
  // 🔋 Define voltage/current limits
  const TX_VOLTAGE_MIN = 12.4;
  const TX_VOLTAGE_MAX = 12.8;
  const TX_CURRENT_MIN = 1.7;
  const TX_CURRENT_MAX = 1.9;

  const RX_VOLTAGE_START = 11.8;
  const RX_VOLTAGE_MAX = 12.0;
  const RX_CURRENT_START = 1.2;
  const RX_CURRENT_MAX = 1.31;

  // 📊 States
  const [transmitterVoltage, setTransmitterVoltage] = useState(12.6);
  const [transmitterCurrent, setTransmitterCurrent] = useState(1.8);
  const [receiverVoltage, setReceiverVoltage] = useState(RX_VOLTAGE_START);
  const [receiverCurrent, setReceiverCurrent] = useState(RX_CURRENT_START);
  const [graphData, setGraphData] = useState([]);
  const [isCharging, setIsCharging] = useState(true); // For status animation
  const intervalRef = useRef(null);

  // Improved useEffect with ref to avoid stale closures and infinite loops
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // 📶 Receiver: increase until max, then stop
      let newRxVoltage = parseFloat(receiverVoltage) + 0.05;
      newRxVoltage = Math.min(newRxVoltage, RX_VOLTAGE_MAX);
      setReceiverVoltage(newRxVoltage.toFixed(2));

      let newRxCurrent = parseFloat(receiverCurrent) + 0.03;
      newRxCurrent = Math.min(newRxCurrent, RX_CURRENT_MAX);
      setReceiverCurrent(newRxCurrent.toFixed(2));

      // 📡 Transmitter: random increase or decrease each cycle (within limits)
      let txVoltageChange = Math.random() * 0.05 - 0.025;
      let newTxVoltage = parseFloat(transmitterVoltage) + txVoltageChange;
      newTxVoltage = Math.max(TX_VOLTAGE_MIN, Math.min(newTxVoltage, TX_VOLTAGE_MAX));
      setTransmitterVoltage(newTxVoltage.toFixed(2));

      let txCurrentChange = Math.random() * 0.03 - 0.015;
      let newTxCurrent = parseFloat(transmitterCurrent) + txCurrentChange;
      newTxCurrent = Math.max(TX_CURRENT_MIN, Math.min(newTxCurrent, TX_CURRENT_MAX));
      setTransmitterCurrent(newTxCurrent.toFixed(2));

      // 📊 Update graph with new receiver voltage (using computed value for accuracy)
      const newTime = new Date().toLocaleTimeString().slice(0, 8);
      setGraphData((prev) => [
        ...prev.slice(-14), // Keep last 15 points for smooth graph
        { time: newTime, voltage: newRxVoltage },
      ]);

      // Toggle charging status for visual feedback
      setIsCharging((prev) => !prev);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // Empty dependency: runs once, uses functional updates for latest state

  // Calculate progress for receiver (0-100%)
  const rxVoltageProgress = ((parseFloat(receiverVoltage) - RX_VOLTAGE_START) / (RX_VOLTAGE_MAX - RX_VOLTAGE_START)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex flex-col items-center p-4 md:p-8">
      {/* Header with animation */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600 text-center"
      >
        ⚡ Wireless Charging Dashboard ⚡
      </motion.h1>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 📡 TRANSMITTER PANEL - Improved with gradient and animations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-indigo-100 hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700 flex items-center justify-center gap-2">
            📡 Transmitter Side
            <AnimatePresence>
              {isCharging && (
                <motion.span
                  key="pulse"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-xs bg-indigo-200 px-2 py-1 rounded-full text-indigo-700"
                >
                  Active
                </motion.span>
              )}
            </AnimatePresence>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              key={transmitterVoltage} // Key for re-animation on change
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg text-center border border-indigo-200"
            >
              <h3 className="text-lg font-semibold mb-3 text-indigo-600 flex items-center justify-center gap-2">
                <span>⚡</span> Voltmeter
              </h3>
              <p className="text-4xl md:text-5xl font-extrabold text-indigo-600 mb-2 transition-all duration-700">
                {transmitterVoltage} V
              </p>
              <p className="text-sm text-indigo-500">Stable Range: {TX_VOLTAGE_MIN}-{TX_VOLTAGE_MAX}V</p>
            </motion.div>

            <motion.div
              key={transmitterCurrent}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg text-center border border-indigo-200"
            >
              <h3 className="text-lg font-semibold mb-3 text-indigo-600 flex items-center justify-center gap-2">
                <span>🔌</span> Ammeter
              </h3>
              <p className="text-4xl md:text-5xl font-extrabold text-indigo-600 mb-2 transition-all duration-700">
                {transmitterCurrent} A
              </p>
              <p className="text-sm text-indigo-500">Stable Range: {TX_CURRENT_MIN}-{TX_CURRENT_MAX}A</p>
            </motion.div>
          </div>
        </motion.div>

        {/* 📶 RECEIVER PANEL - Improved with progress bar and enhanced graph */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-emerald-100 hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-emerald-700 flex items-center justify-center gap-2">
            📶 Receiver Side
            <AnimatePresence>
              {rxVoltageProgress >= 100 && (
                <motion.span
                  key="complete"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs bg-emerald-200 px-2 py-1 rounded-full text-emerald-700"
                >
                  Complete
                </motion.span>
              )}
            </AnimatePresence>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div
              key={receiverVoltage}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl shadow-lg text-center border border-emerald-200 relative overflow-hidden"
            >
              <h3 className="text-lg font-semibold mb-3 text-emerald-600 flex items-center justify-center gap-2">
                <span>⚡</span> Voltmeter
              </h3>
              <p className="text-4xl md:text-5xl font-extrabold text-emerald-600 mb-2 transition-all duration-700 relative z-10">
                {receiverVoltage} V
              </p>
              <p className="text-sm text-emerald-500">Target: {RX_VOLTAGE_MAX}V</p>
              {/* Progress overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent" style={{ width: `${rxVoltageProgress}%` }} />
            </motion.div>

            <motion.div
              key={receiverCurrent}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl shadow-lg text-center border border-emerald-200"
            >
              <h3 className="text-lg font-semibold mb-3 text-emerald-600 flex items-center justify-center gap-2">
                <span>🔌</span> Ammeter
              </h3>
              <p className="text-4xl md:text-5xl font-extrabold text-emerald-600 mb-2 transition-all duration-700">
                {receiverCurrent} A
              </p>
              <p className="text-sm text-emerald-500">Target: {RX_CURRENT_MAX}A</p>
            </motion.div>
          </div>

          {/* Progress Bar for Receiver Voltage */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-emerald-600 mb-2 text-center">Charging Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rxVoltageProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full shadow-md"
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-1">{rxVoltageProgress.toFixed(0)}% Complete</p>
          </div>

          {/* 📈 Enhanced Receiver Voltage Graph */}
          <h2 className="text-xl font-semibold text-center mb-4 text-emerald-700">📊 Receiver Voltage Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis
                domain={[11, 13]}
                stroke="#6b7280"
                label={{ value: "Voltage (V)", angle: -90, position: "insideLeft", fill: "#059669", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="voltage"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-8 text-center text-gray-500 text-sm"
      >
        🔄 Data updates every 3 seconds. Simulated wireless charging in progress.
      </motion.p>
    </div>
  );
}