import React, { useState } from "react";

export default function Login({ onLogin, onBack, onRegisterLink }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }
    // Simulate simple auth
    const user = { name: username };
    onLogin?.(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-emerald-900 p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur rounded-xl p-6 border border-blue-500/20 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Sign In</h2>
        {error && <div className="text-sm text-red-300 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-white/6 text-white placeholder-slate-300 border border-slate-700"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full p-3 rounded-lg bg-white/6 text-white placeholder-slate-300 border border-slate-700"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <button type="button" onClick={onBack} className="text-sm text-slate-300 underline">Back</button>
              <button type="button" onClick={onRegisterLink} className="text-sm text-indigo-300 underline">Register</button>
            </div>
            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
}
