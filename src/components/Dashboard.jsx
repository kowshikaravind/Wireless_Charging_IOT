import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  
  const TX_VOLTAGE_MIN = 12.4;
  const TX_VOLTAGE_MAX = 12.8;
  const TX_CURRENT_MIN = 1.7;
  const TX_CURRENT_MAX = 1.9;

  const RX_VOLTAGE_START = 11.8;
  const RX_VOLTAGE_MAX = 12.0;
  const RX_CURRENT_START = 1.2;
  const RX_CURRENT_MAX = 1.31;

  const [transmitterVoltage, setTransmitterVoltage] = useState(12.6);
  const [transmitterCurrent, setTransmitterCurrent] = useState(1.8);
  const [receiverVoltage, setReceiverVoltage] = useState(RX_VOLTAGE_START);
  const [receiverCurrent, setReceiverCurrent] = useState(RX_CURRENT_START);
  const [transmitterGraphData, setTransmitterGraphData] = useState([]);
  const [receiverGraphData, setReceiverGraphData] = useState([]);
  const [efficiency, setEfficiency] = useState(85);
  const [location, setLocation] = useState({ 
    latitude: null, 
    longitude: null, 
    name: "Acquiring location...",
    accuracy: null
  });
  const [gpsStatus, setGpsStatus] = useState("Waiting for GPS...");

  const intervalRef = useRef(null);
  const watchIdRef = useRef(null);

  // Real GPS Location Tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus("Geolocation is not supported by this browser.");
      return;
    }

    setGpsStatus("Requesting location access...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          latitude,
          longitude,
          name: "Current Location",
          accuracy
        });
        setGpsStatus("GPS Active - Tracking");
        
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation(prev => ({
          ...prev,
          latitude,
          longitude,
          accuracy
        }));
        setGpsStatus("GPS Active - Tracking");
        if (Math.random() < 0.3) { 
          reverseGeocode(latitude, longitude);
        }
      },
      (error) => {
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          const address = data.address;
          let locationName = "";
          
          if (address.city || address.town || address.village) {
            locationName = address.city || address.town || address.village;
          } else if (address.municipality || address.county) {
            locationName = address.municipality || address.county;
          } else {
            locationName = data.display_name.split(',')[0];
          }
          
          if (address.state || address.region) {
            locationName += `, ${address.state || address.region}`;
          }
          
          setLocation(prev => ({
            ...prev,
            name: locationName || "Unknown Location"
          }));
        }
      }
    } catch (error) {
      console.log("Geocoding failed, using coordinates:", error);
      setLocation(prev => ({
        ...prev,
        name: `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`
      }));
    }
  };

  const handleLocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setGpsStatus("Location access denied by user");
        setLocation(prev => ({ ...prev, name: "Location access denied" }));
        break;
      case error.POSITION_UNAVAILABLE:
        setGpsStatus("Location information unavailable");
        setLocation(prev => ({ ...prev, name: "Location unavailable" }));
        break;
      case error.TIMEOUT:
        setGpsStatus("Location request timed out");
        setLocation(prev => ({ ...prev, name: "Location timeout" }));
        break;
      default:
        setGpsStatus("An unknown location error occurred");
        setLocation(prev => ({ ...prev, name: "Location error" }));
        break;
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setReceiverVoltage((prev) => {
        let newRxVoltage = parseFloat(prev) + (Math.random() * 0.08);
        if (newRxVoltage >= RX_VOLTAGE_MAX) newRxVoltage = RX_VOLTAGE_MAX;
        const newTime = new Date().toLocaleTimeString().slice(0, 8);
        setReceiverGraphData((graphPrev) => [...graphPrev.slice(-19), { time: newTime, voltage: newRxVoltage }]);
        return newRxVoltage.toFixed(2);
      });

      setReceiverCurrent((prev) => {
        let newRxCurrent = parseFloat(prev) + (Math.random() * 0.04);
        if (newRxCurrent >= RX_CURRENT_MAX) newRxCurrent = RX_CURRENT_MAX;
        return newRxCurrent.toFixed(2);
      });

      setTransmitterVoltage((prev) => {
        let newTxVoltage = parseFloat(prev) + (Math.random() * 0.05 - 0.025);
        newTxVoltage = Math.max(TX_VOLTAGE_MIN, Math.min(newTxVoltage, TX_VOLTAGE_MAX));
        const newTime = new Date().toLocaleTimeString().slice(0, 8);
        setTransmitterGraphData((graphPrev) => [...graphPrev.slice(-19), { time: newTime, voltage: newTxVoltage }]);
        return newTxVoltage.toFixed(2);
      });

      setTransmitterCurrent((prev) => {
        let newTxCurrent = parseFloat(prev) + (Math.random() * 0.03 - 0.015);
        newTxCurrent = Math.max(TX_CURRENT_MIN, Math.min(newTxCurrent, TX_CURRENT_MAX));
        return newTxCurrent.toFixed(2);
      });

      setEfficiency((prev) => Math.min(95, Math.max(75, prev + (Math.random() - 0.5) * 3)));
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-emerald-900 relative overflow-hidden">
     
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
            transition={{ duration: Math.random() * 6 + 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-6 md:px-6 md:py-8">
        <motion.h1
          className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-emerald-300 drop-shadow-2xl text-center mb-2"
        >
          ⚡ Wireless Charging Dashboard
        </motion.h1>

        <p className="text-xs md:text-sm text-slate-300 mb-6 text-center">
          Real-time monitoring & bidirectional energy flow
        </p>

        {/* 📍 Location Section */}
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
                : gpsStatus.includes("Waiting") || gpsStatus.includes("Requesting")
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
          
          
          <p className="text-xs text-slate-400">
            {gpsStatus.includes("denied") 
              ? "Please enable location permissions"
              : "Real-time GPS tracking"
            }
          </p>
        </motion.section>

        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6">
    
          <motion.section className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-indigo-500/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white text-center mb-4">📡 Battery I</h2>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="bg-white/10 p-4 rounded-xl text-center border border-indigo-400/30">
                <h3 className="text-indigo-200 text-base font-semibold mb-2">⚡ Voltage</h3>
                <p className="text-3xl font-black text-white">{transmitterVoltage}V</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl text-center border border-indigo-400/30">
                <h3 className="text-indigo-200 text-base font-semibold mb-2">🔌 Current</h3>
                <p className="text-3xl font-black text-white">{transmitterCurrent}A</p>
              </div>
            </div>
            <h3 className="text-indigo-200 text-center mb-2">📈 Voltage Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={transmitterGraphData}>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={9} />
                <YAxis domain={[12, 13]} stroke="rgba(255,255,255,0.4)" fontSize={9} />
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
                  stroke="#a5b4fc"
                  strokeWidth={2}
                  dot={{ fill: "#a5b4fc", r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.section>

          <motion.section className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white text-center mb-4">📶 Battery II</h2>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="bg-white/10 p-4 rounded-xl text-center border border-emerald-400/30">
                <h3 className="text-emerald-200 text-base font-semibold mb-2">⚡ Voltage</h3>
                <p className="text-3xl font-black text-white">{receiverVoltage}V</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl text-center border border-emerald-400/30">
                <h3 className="text-emerald-200 text-base font-semibold mb-2">🔌 Current</h3>
                <p className="text-3xl font-black text-white">{receiverCurrent}A</p>
              </div>
            </div>
            <h3 className="text-emerald-200 text-center mb-2">📈 Voltage Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={receiverGraphData}>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={9} />
                <YAxis domain={[11, 13]} stroke="rgba(255,255,255,0.4)" fontSize={9} />
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
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={{ fill: "#34d399", r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.section>
        </div>

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
            Power Transfer: {(transmitterVoltage * transmitterCurrent).toFixed(1)}W →{" "}
            {(receiverVoltage * receiverCurrent).toFixed(1)}W
          </p>
        </motion.footer>
      </div>
    </div>
  );
}