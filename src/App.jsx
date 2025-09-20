import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// 🔹 Startpage
function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 text-white">
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-5xl font-extrabold mb-4">Vaultrex</h1>
        <p className="text-xl mb-8 text-center max-w-lg">
          Hantera lager, tjänster och QR-scanning i ett futuristiskt dashboard.
        </p>
        <button
          className="px-8 py-3 bg-white text-purple-700 rounded-full font-semibold shadow-lg hover:scale-105 transition"
          onClick={() => navigate("/dashboard")}
        >
          Logga in
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-20">
        <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold mb-2">Inventory</h2>
          <p>Hantera och håll koll på ditt lager</p>
        </div>
        <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold mb-2">Services</h2>
          <p>Hantera dina tjänster och abonnemang</p>
        </div>
        <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold mb-2">QR-Scan</h2>
          <p>Snabb scanning med din kamera</p>
        </div>
      </div>
    </div>
  );
}

// 🔹 Dashboard with tabs
function Dashboard() {
  const [tab, setTab] = useState("inventory");

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vaultrex Dashboard</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => (window.location.href = "/")}
        >
          Logga ut
        </button>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <nav className="bg-white w-full md:w-64 border-r">
          <ul className="flex md:flex-col">
            <li
              className={`p-4 cursor-pointer hover:bg-gray-200 ${
                tab === "inventory" && "bg-gray-200 font-bold"
              }`}
              onClick={() => setTab("inventory")}
            >
              Inventory
            </li>
            <li
              className={`p-4 cursor-pointer hover:bg-gray-200 ${
                tab === "services" && "bg-gray-200 font-bold"
              }`}
              onClick={() => setTab("services")}
            >
              Services
            </li>
            <li
              className={`p-4 cursor-pointer hover:bg-gray-200 ${
                tab === "qr" && "bg-gray-200 font-bold"
              }`}
              onClick={() => setTab("qr")}
            >
              QR-Scan
            </li>
          </ul>
        </nav>

        {/* Content */}
        <main className="flex-1 p-6">
          {tab === "inventory" && (
            <div>
              <h2 className="text-3xl font-bold mb-4">Inventory</h2>
              <p>Här kommer inventarielistan…</p>
            </div>
          )}
          {tab === "services" && (
            <div>
              <h2 className="text-3xl font-bold mb-4">Services</h2>
              <p>Här kommer dina tjänster…</p>
            </div>
          )}
          {tab === "qr" && (
            <div>
              <h2 className="text-3xl font-bold mb-4">QR-Scan</h2>
              <p>Här kommer QR-scannern…</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// 🔹 Main App with routes
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
