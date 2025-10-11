import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import RechargePlans from "./components/RechargePlans";
import OtpPage from "./components/OtpPage";
import Register from "./components/Register";

function App() {
  const [user, setUser] = useState(null);
  const [rechargeResult, setRechargeResult] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    navigate("/plans");
  };

  const handleRegister = (newUser) => {
    setUser(newUser);
    navigate("/plans");
  };

  const handleRecharge = (result) => {
    setRechargeResult(result);
    navigate("/otp");
  };

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen onFinish={() => navigate('/login')} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} onBack={() => navigate('/')} onRegisterLink={() => navigate('/register')} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} onCancel={() => navigate('/login')} />} />
      <Route path="/plans" element={<RechargePlans user={user} onRecharge={handleRecharge} onBack={() => navigate('/login')} />} />
      <Route path="/otp" element={<OtpPage result={rechargeResult} onContinue={() => navigate('/dashboard')} onBack={() => navigate('/plans')} />} />
      <Route path="/dashboard" element={<Dashboard user={user} />} />
    </Routes>
  );
}

export default App;
