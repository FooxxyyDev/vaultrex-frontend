import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

export default function Services() {
  const [scanResult, setScanResult] = useState("");

  return (
    <div>
      <h2>Services</h2>
      <QrReader
        onResult={(result, error) => {
          if (!!result) setScanResult(result?.text);
          if (!!error) console.error(error);
        }}
        constraints={{ facingMode: "environment" }}
        style={{ width: "100%" }}
      />
      <p>Senast skannade: {scanResult}</p>
    </div>
  );
}

