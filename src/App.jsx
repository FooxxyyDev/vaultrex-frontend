// App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("services");
  const [inventory, setInventory] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.user) setUser(data.user);
    else alert("Fel email eller lösenord");
  };

  const fetchInventory = async () => {
    if (!user) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/inventory/${user.id}`);
    const data = await res.json();
    setInventory(data);
  };

  const scanItem = async (id) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/inventory/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: id }),
    });
    const data = await res.json();
    if (data.success) fetchInventory();
    else alert(data.error);
  };

  useEffect(() => { fetchInventory(); }, [user]);

  if (!user) {
    return (
      <div className="login-container">
        <h1>Vaultrex Login</h1>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={login}>Logga in</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Vaultrex Dashboard</h1>
        <button onClick={()=>setUser(null)}>Logga ut</button>
      </header>

      <nav>
        <button className={tab==="services"?"active":""} onClick={()=>setTab("services")}>Mina tjänster</button>
        <button className={tab==="inventory"?"active":""} onClick={()=>setTab("inventory")}>Inventory</button>
      </nav>

      <main>
        {tab==="services" && (
          <div>
            <h2>Mina tjänster</h2>
            <p>Här kan du visa alla tjänster, abonnera, och se QR-koder för att skanna artiklar.</p>
          </div>
        )}

        {tab==="inventory" && (
          <div>
            <h2>Inventory</h2>
            {inventory.map(item=>(
              <div key={item.id} className="inventory-item">
                <span>{item.name} ({item.quantity})</span>
                <button onClick={()=>scanItem(item.id)}>Skanna</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
