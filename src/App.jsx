import React, { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./Dashboard"; // 👈 importera

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("list");
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (activePage === "inventory") {
      fetch("https://vaultrex-backend.onrender.com/inventory")
        .then((res) => res.json())
        .then((data) => setItems(data))
        .catch((err) => console.error("Error fetching inventory:", err));
    }
  }, [activePage]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!name || !quantity) return;

    const res = await fetch("https://vaultrex-backend.onrender.com/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity: parseInt(quantity) }),
    });

    if (res.ok) {
      const newItem = await res.json();
      setItems([...items, newItem]);
      setName("");
      setQuantity("");
      setActiveTab("list");
    } else {
      alert("Kunde inte lägga till item");
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1 className="logo">VAULTREX</h1>
        <ul className="nav-links">
          <li
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activePage === "inventory" ? "active" : ""}
            onClick={() => setActivePage("inventory")}
          >
            Inventory
          </li>
          <li
            className={activePage === "settings" ? "active" : ""}
            onClick={() => setActivePage("settings")}
          >
            Settings
          </li>
        </ul>
      </nav>

      <div className="page-content">
        {activePage === "dashboard" && <Dashboard />}

        {activePage === "inventory" && (
          <div className="inventory">
            <div className="tabs">
              <button
                className={activeTab === "list" ? "tab active" : "tab"}
                onClick={() => setActiveTab("list")}
              >
                List
              </button>
              <button
                className={activeTab === "add" ? "tab active" : "tab"}
                onClick={() => setActiveTab("add")}
              >
                Add
              </button>
            </div>

            {activeTab === "list" && (
              <div className="item-list">
                {items.length === 0 ? (
                  <p>No items yet</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "add" && (
              <form className="item-form" onSubmit={addItem}>
                <input
                  type="text"
                  placeholder="Item name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <button type="submit">Add Item</button>
              </form>
            )}
          </div>
        )}

        {activePage === "settings" && (
          <div className="settings">
            <h2>Settings</h2>
            <p>Here you can adjust your Vaultrex settings in the future.</p>
          </div>
        )}
      </div>
    </div>
  );
}
