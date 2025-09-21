import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import logo from "./assets/vaultrex-logo.png.png"; // din logga

// Sidor
function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Välkommen till Vaultrex</h1>
      <p className="text-lg mb-6 text-gray-300">
        Smidig inventering och tjänstehantering för företag.
      </p>
      <Link
        to="/login"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
      >
        Logga in
      </Link>
    </div>
  );
}

function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4">Logga in</h2>
      <form className="bg-gray-800 p-6 rounded-lg shadow-md w-80">
        <label className="block mb-2 text-sm">E-post</label>
        <input
          type="email"
          placeholder="Din e-post"
          className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white"
        />
        <label className="block mb-2 text-sm">Lösenord</label>
        <input
          type="password"
          placeholder="Ditt lösenord"
          className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
        >
          Logga in
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
      <p className="text-gray-700">Här kommer dina tjänster och inventering.</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Vaultrex Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold">Vaultrex</h1>
        </div>

        <nav className="space-x-4">
          <Link to="/" className="hover:text-indigo-400">
            Hem
          </Link>
          <Link to="/login" className="hover:text-indigo-400">
            Logga in
          </Link>
          <Link to="/dashboard" className="hover:text-indigo-400">
            Dashboard
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
