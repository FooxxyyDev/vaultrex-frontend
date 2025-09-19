import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0, category: "" });

  useEffect(() => {
    fetch("https://vaultrex-backend.onrender.com/api/items")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || newItem.quantity <= 0 || !newItem.category) return;

    try {
      const res = await fetch("https://vaultrex-backend.onrender.com/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });
      const added = await res.json();
      setItems([...items, added]);
      setNewItem({ name: "", quantity: 0, category: "" });
    } catch (err) {
      console.error("Fel vid tillägg:", err);
    }
  };

  return (
    <div className="container">
      <h1>Vaultrex Inventory</h1>

      <div className="cards-container">
        {items.length === 0 ? (
          <p className="no-items">No items yet</p>
        ) : (
          items.map(item => (
            <div className="item-card" key={item.id}>
              <div className="item-name">{item.name}</div>
              <div className="item-info">
                <span>Qty: {item.quantity}</span>
                <span>Category: {item.category}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <h2>Add New Item</h2>
      <form onSubmit={addItem} className="item-form">
        <input
          placeholder="Name"
          value={newItem.name}
          onChange={e => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          required
        />
        <input
          placeholder="Category"
          value={newItem.category}
          onChange={e => setNewItem({ ...newItem, category: e.target.value })}
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}
