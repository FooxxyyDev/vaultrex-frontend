import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function Inventory() {
  const [scanResult, setScanResult] = useState("");

  return (
    <div>
      <h2>Inventory</h2>
      <div style={{ maxWidth: 480 }}>
        <Scanner
          onDecode={(result) => setScanResult(result || "")}
          onError={(error) => console.error(error?.message || error)}
          constraints={{ facingMode: "environment" }}
        />
      </div>
      <p>Senast skannade: {scanResult}</p>
    </div>
  );
}

