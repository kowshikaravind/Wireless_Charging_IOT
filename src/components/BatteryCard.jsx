import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function BatteryCard({ title, accent, voltage, current, graphData, yDomain }) {
  const lineColor = accent === "indigo" ? "#a5b4fc" : "#34d399";
  const borderClass = accent === "indigo" ? "border-indigo-400/30" : "border-emerald-400/30";
  const headerClass = accent === "indigo" ? "text-indigo-200" : "text-emerald-200";

  return (
    <section className={`bg-white/5 backdrop-blur-xl rounded-2xl p-5 border ${borderClass} shadow-2xl`}>
      <h2 className="text-xl font-bold text-white text-center mb-4">{title}</h2>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className={`bg-white/10 p-4 rounded-xl text-center border ${borderClass}`}>
          <h3 className={`${headerClass} text-base font-semibold mb-2`}>⚡ Voltage</h3>
          <p className="text-3xl font-black text-white">{voltage}V</p>
        </div>
        <div className={`bg-white/10 p-4 rounded-xl text-center border ${borderClass}`}>
          <h3 className={`${headerClass} text-base font-semibold mb-2`}>🔌 Current</h3>
          <p className="text-3xl font-black text-white">{current}A</p>
        </div>
      </div>
      
      <h3 className={`${headerClass} text-center mb-2`}>📈 Voltage Trend</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={9} />
          <YAxis domain={yDomain} stroke="rgba(255,255,255,0.4)" fontSize={9} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "6px",
              color: "white",
            }}
          />
          <Line
            type="monotone"
            dataKey="voltage"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ fill: lineColor, r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
