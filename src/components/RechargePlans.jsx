import React, { useState } from "react";

const PLANS = [
  { id: "basic", name: "Basic Recharge", amount: 49, minutes: 30 },
  { id: "pro", name: "Pro Recharge", amount: 99, minutes: 75 },
  { id: "ultra", name: "Ultra Recharge", amount: 199, minutes: 200 },
];

export default function RechargePlans({ user, onRecharge, onBack }) {
  const [selected, setSelected] = useState(PLANS[0].id);
  const [processing, setProcessing] = useState(false);

  const handleRecharge = () => {
    setProcessing(true);
    // Simulate payment and OTP generation
    setTimeout(() => {
      const plan = PLANS.find((p) => p.id === selected);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const receipt = {
        user: user?.name || "Guest",
        plan: plan.name,
        amount: plan.amount,
        otp,
        timestamp: new Date().toISOString(),
      };
      onRecharge?.(receipt);
      setProcessing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-emerald-900 p-4">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur rounded-xl p-6 border border-blue-500/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Recharge Plans</h2>
          <div className="text-sm text-slate-300">User: {user?.name || "Guest"}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`p-4 rounded-lg border ${selected === plan.id ? "border-indigo-400 bg-indigo-500/10" : "border-slate-700/30"}`}>
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="text-sm text-slate-300">{plan.minutes} minutes</p>
              <p className="text-xl font-bold text-white mt-2">₹{plan.amount}</p>
              <div className="mt-3">
                <button onClick={() => setSelected(plan.id)} className={`px-3 py-1 rounded ${selected === plan.id ? "bg-indigo-500 text-white" : "bg-white/5 text-white"}`}>
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button onClick={onBack} className="text-sm text-slate-300 underline">Back</button>
          <button onClick={handleRecharge} disabled={processing} className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold">
            {processing ? "Processing..." : "Recharge Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
