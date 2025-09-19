import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [services, setServices] = useState([]);
    const [activeTab, setActiveTab] = useState("inventory");
    const [error, setError] = useState("");

    // ---------- LOGIN ----------
    const handleLogin = async () => {
        setError("");
        try {
            const res = await fetch("https://vaultrex-backend.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                fetchInventory(data.user.id);
                fetchServices();
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Server error");
        }
    };

    // ---------- FETCH INVENTORY ----------
    const fetchInventory = async (userId) => {
        try {
            const res = await fetch(`https://vaultrex-backend.onrender.com/inventory/${userId}`);
            const data = await res.json();
            if (res.ok) setInventory(data);
        } catch (err) {
            console.error(err);
        }
    };

    // ---------- FETCH SERVICES ----------
    const fetchServices = async () => {
        try {
            const res = await fetch("https://vaultrex-backend.onrender.com/services");
            const data = await res.json();
            if (res.ok) setServices(data);
        } catch (err) {
            console.error(err);
        }
    };

    // ---------- SUBSCRIBE TO SERVICE ----------
    const subscribeService = async (serviceId) => {
        try {
            const res = await fetch(`https://vaultrex-backend.onrender.com/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, serviceId }),
            });
            const data = await res.json();
            if (res.ok) alert("Subscribed!");
        } catch (err) {
            console.error(err);
        }
    };

    // ---------- QR-SCAN STUB ----------
    const handleQRScan = (itemId) => {
        alert(`Scanned item ID: ${itemId} (implement QR reader)`);
    };

    if (!user) {
        return (
            <div className="login-container">
                <h1>Vaultrex Inventory</h1>
                {error && <div className="error">{error}</div>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h1>Welcome, {user.email}</h1>

            <div className="tabs">
                <button onClick={() => setActiveTab("inventory")}>Inventory</button>
                <button onClick={() => setActiveTab("services")}>Services</button>
            </div>

            {activeTab === "inventory" && (
                <div>
                    <h2>Your Inventory</h2>
                    <ul>
                        {inventory.map((item) => (
                            <li key={item.id}>
                                {item.name} ({item.quantity})
                                <button onClick={() => handleQRScan(item.id)}>Scan QR</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === "services" && (
                <div>
                    <h2>Available Services</h2>
                    <ul>
                        {services.map((s) => (
                            <li key={s.id}>
                                {s.name} - {s.price}€
                                <button onClick={() => subscribeService(s.id)}>Subscribe</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
