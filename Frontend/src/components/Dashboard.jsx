import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

  useEffect(() => {
    const interval = setInterval(() => {
      // 📶 Receiver: increase until max, then stop
      setReceiverVoltage((prev) => {
        const next = parseFloat(prev) + 0.05;
        return next >= RX_VOLTAGE_MAX ? RX_VOLTAGE_MAX.toFixed(2) : next.toFixed(2);
      });

      setReceiverCurrent((prev) => {
        const next = parseFloat(prev) + 0.03;
        return next >= RX_CURRENT_MAX ? RX_CURRENT_MAX.toFixed(2) : next.toFixed(2);
      });

      // 📡 Transmitter: random increase or decrease each cycle (within limits)
      setTransmitterVoltage((prev) => {
        let change = (Math.random() * 0.05 - 0.025).toFixed(2); // random -0.025V to +0.025V
        let next = parseFloat(prev) + parseFloat(change);

        if (next > TX_VOLTAGE_MAX) next = TX_VOLTAGE_MAX;
        if (next < TX_VOLTAGE_MIN) next = TX_VOLTAGE_MIN;

        return next.toFixed(2);
      });

      setTransmitterCurrent((prev) => {
        let change = (Math.random() * 0.03 - 0.015).toFixed(2); // random -0.015A to +0.015A
        let next = parseFloat(prev) + parseFloat(change);

        if (next > TX_CURRENT_MAX) next = TX_CURRENT_MAX;
        if (next < TX_CURRENT_MIN) next = TX_CURRENT_MIN;

        return next.toFixed(2);
      });

      // 📊 Update graph with new receiver voltage
      setGraphData((prev) => [
        ...prev.slice(-14),
        {
          time: new Date().toLocaleTimeString().slice(0, 8),
          voltage: parseFloat(receiverVoltage),
        },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [receiverVoltage]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-10 text-indigo-700">
        ⚡ Wireless Charging Dashboard ⚡
      </h1>

      {/* 📡 TRANSMITTER PANEL */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-10 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center mb-6">📡 Transmitter Side</h2>
        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-medium mb-2">Voltmeter</h3>
            <p className="text-4xl font-bold text-indigo-600">{transmitterVoltage} V</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-medium mb-2">Ammeter</h3>
            <p className="text-4xl font-bold text-indigo-600">{transmitterCurrent} A</p>
          </div>
        </div>
      </div>

      {/* 📶 RECEIVER PANEL */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center mb-6">📶 Receiver Side</h2>
        <div className="grid grid-cols-2 gap-6 text-center mb-10">
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-medium mb-2">Voltmeter</h3>
            <p className="text-4xl font-bold text-green-600">{receiverVoltage} V</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-medium mb-2">Ammeter</h3>
            <p className="text-4xl font-bold text-green-600">{receiverCurrent} A</p>
          </div>
        </div>

        {/* 📈 Receiver Voltage Graph */}
        <h2 className="text-xl font-semibold text-center mb-4">📊 Receiver Voltage Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <XAxis dataKey="time" />
            <YAxis
              domain={[11, 13]}
              label={{ value: "Voltage (V)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="voltage"
              stroke="#34d399"
              strokeWidth={3}
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
