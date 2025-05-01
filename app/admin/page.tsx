"use client";
import React, { useState } from "react";

export default function AdminRegister() {
  const [password, setPassword] = useState("");

  const adminCode = process.env.NEXT_PUBLIC_ADMIN_CODE;

  const handleLogin = () => {
    if (password === adminCode) {
      location.href = "/admin/dashboard";
    } else {
      location.href = "/";
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/4 p-2 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-2">Admin Registr</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}
