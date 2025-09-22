import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";

export default function Inventory() {
  const [scanResult, setScanResult] = useState("");

  return (
    <div>
      <h2>Inventory</h2>
      <QrScanner
        onDecode={(result) => {
          if (result) setScanResult(result);
        }}
        onError={(error) => {
          if (error) console.error(error);
        }}
        constraints={{ facingMode: "environment" }}
        style={{ width: "100%" }}
      />
      <p>Senast skannade: {scanResult}</p>
    </div>
  );
}

