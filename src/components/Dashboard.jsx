import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import Header from "./Header";
import LocationSection from "./LocationSection";
import BatteryCard from "./BatteryCard";
import EfficiencyFooter from "./EfficiencyFooter";

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
  const [gpsStatus, setGpsStatus] = useState("Initializing GPS...");
  const [locationError, setLocationError] = useState(null);

  const intervalRef = useRef(null);
  const watchIdRef = useRef(null);

  // Real GPS Location Tracking
  useEffect(() => {
    const initializeGPS = async () => {
      if (!navigator.geolocation) {
        setGpsStatus("Geolocation not supported");
        setLocationError("Your browser doesn't support GPS location tracking.");
        return;
      }

      setGpsStatus("Requesting location permission...");

      try {
        // First get current position
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          });
        });

        // Then start watching position
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            setLocation(prev => ({
              ...prev,
              latitude,
              longitude,
              accuracy
            }));
            setGpsStatus("GPS Active - Live Tracking");
            setLocationError(null);
            
            // Update location name
            reverseGeocode(latitude, longitude);
          },
          (error) => {
            handleLocationError(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000
          }
        );

      } catch (error) {
        handleLocationError(error);
      }
    };

    initializeGPS();

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      // Add a small delay to avoid too many API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        let locationName = "Current Location";
        
        if (data.address) {
          const address = data.address;
          if (address.road || address.suburb) {
            locationName = `${address.road || address.suburb}`;
            if (address.city || address.town || address.village) {
              locationName += `, ${address.city || address.town || address.village}`;
            }
          } else if (data.display_name) {
            locationName = data.display_name.split(',')[0];
          }
        }
        
        setLocation(prev => ({
          ...prev,
          name: locationName
        }));
      }
    } catch (error) {
      console.log("Geocoding failed, using coordinates");
      setLocation(prev => ({
        ...prev,
        name: `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`
      }));
    }
  };

  const handleLocationError = (error) => {
    let errorMessage = "Location error";
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location access denied. Please enable location permissions in your browser settings.";
        setGpsStatus("Permission Denied");
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information unavailable. Please check your GPS signal.";
        setGpsStatus("Location Unavailable");
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out. Please try again.";
        setGpsStatus("Request Timeout");
        break;
      default:
        errorMessage = "Unable to get location. Please try again.";
        setGpsStatus("Location Error");
        break;
    }
    
    setLocationError(errorMessage);
    setLocation(prev => ({ 
      ...prev, 
      name: "Location unavailable" 
    }));
  };

  const requestLocationPermission = () => {
    setGpsStatus("Requesting permission...");
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          latitude,
          longitude,
          name: "Current Location",
          accuracy
        });
        setGpsStatus("GPS Active - Live Tracking");
        setLocationError(null);
        
        // Restart watching position
        if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
        
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            setLocation(prev => ({
              ...prev,
              latitude,
              longitude,
              accuracy
            }));
            reverseGeocode(latitude, longitude);
          },
          handleLocationError,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000
          }
        );
      },
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  // Simulated data updates (unchanged)
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

      <div className="relative z-10 flex flex-col items-center px-4 pt-2 pb-6 md:px-6 md:pt-4 md:pb-8">

        <Header />

        {/* 📍 Location Section */}
        <LocationSection
          location={location}
          gpsStatus={gpsStatus}
          locationError={locationError}
          requestLocationPermission={requestLocationPermission}
        />

        {/* Rest of the dashboard components */}
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BatteryCard
            title={"📡 Battery I"}
            accent="indigo"
            voltage={transmitterVoltage}
            current={transmitterCurrent}
            graphData={transmitterGraphData}
            yDomain={[12, 13]}
          />

          <BatteryCard
            title={"📶 Battery II"}
            accent="emerald"
            voltage={receiverVoltage}
            current={receiverCurrent}
            graphData={receiverGraphData}
            yDomain={[11, 13]}
          />
        </div>

        <EfficiencyFooter
          efficiency={efficiency}
          transmitterVoltage={transmitterVoltage}
          transmitterCurrent={transmitterCurrent}
          receiverVoltage={receiverVoltage}
          receiverCurrent={receiverCurrent}
        />
      </div>
    </div>
  );
}