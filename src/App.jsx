import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  // Hämta inventory från backend
  useEffect(() => {
    fetch("https://vaultrex-backend.onrender.com/inventory")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching inventory:", err));
  }, []);

  // Lägg till nytt item
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
    } else {
      alert("Kunde inte lägga till item");
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Vaultrex Inventory</h1>

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
    </div>
  );
}
