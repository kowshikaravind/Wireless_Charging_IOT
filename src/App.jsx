import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import RechargePlans from "./components/RechargePlans";
import OtpPage from "./components/OtpPage";

function App() {
  const [view, setView] = useState("welcome");
  const [user, setUser] = useState(null);
  const [rechargeResult, setRechargeResult] = useState(null);

  const goToLogin = () => setView("login");
  const goToPlans = (loggedInUser) => {
    setUser(loggedInUser);
    setView("plans");
  };
  const handleRecharge = (result) => {
    setRechargeResult(result);
    setView("otp");
  };

  if (view === "welcome") {
    return <WelcomeScreen onFinish={goToLogin} />;
  }

  if (view === "login") {
    return <Login onLogin={goToPlans} onBack={() => setView("welcome")} />;
  }

  if (view === "plans") {
    return <RechargePlans user={user} onRecharge={handleRecharge} onBack={() => setView("login")} />;
  }

  if (view === "otp") {
    return <OtpPage result={rechargeResult} onContinue={() => setView("dashboard")} onBack={() => setView("plans")} />;
  }

  return <Dashboard user={user} />;
}

export default App;
