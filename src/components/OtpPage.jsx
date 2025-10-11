import React from "react";

export default function OtpPage({ result, onContinue, onBack }) {
  if (!result) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-emerald-900 p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur rounded-xl p-6 border border-blue-500/20 shadow-lg text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Recharge Successful</h2>
        <p className="text-sm text-slate-300 mb-4">Receipt generated at {new Date(result.timestamp).toLocaleString()}</p>

        <div className="bg-white/6 p-4 rounded-lg mb-4">
          <p className="text-sm text-slate-300">User</p>
          <div className="text-white font-semibold">{result.user}</div>
          <p className="text-sm text-slate-300 mt-2">Plan</p>
          <div className="text-white font-semibold">{result.plan} — ₹{result.amount}</div>
          <p className="text-sm text-slate-300 mt-2">OTP</p>
          <div className="text-white text-xl font-bold">{result.otp}</div>
        </div>

        <div className="flex justify-between">
          <button onClick={onBack} className="text-sm text-slate-300 underline">Back</button>
          <button onClick={onContinue} className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold">Continue to Dashboard</button>
        </div>
      </div>
    </div>
  );
}
