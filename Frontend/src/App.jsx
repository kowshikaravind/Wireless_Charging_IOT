import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import Dashboard from "./components/Dashboard";

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return showDashboard ? (
    <Dashboard />
  ) : (
    <WelcomeScreen onFinish={() => setShowDashboard(true)} />
  );
}

export default App;
