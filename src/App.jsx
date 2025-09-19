import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Vaultrex Inventory</h1>
        <nav className="nav">
          <button
            className={activeTab === "inventory" ? "active" : ""}
            onClick={() => setActiveTab("inventory")}
          >
            Inventory
          </button>
          <button
            className={activeTab === "services" ? "active" : ""}
            onClick={() => setActiveTab("services")}
          >
            Services
          </button>
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </nav>
      </header>

      <main className="content">
        {activeTab === "inventory" && (
          <div className="card">
            <h2>Your Items</h2>
            <p>List and manage your inventory items here.</p>
          </div>
        )}

        {activeTab === "services" && (
          <div className="card">
            <h2>Available Services</h2>
            <p>Subscribe to and configure your services.</p>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="card">
            <h2>Your Profile</h2>
            <p>Manage your account and settings.</p>
          </div>
        )}
      </main>
    </div>
  );
}
