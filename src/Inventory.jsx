import React, { useEffect, useState, Suspense } from "react";
const LazyQrScanner = React.lazy(() =>
  import("@yudiel/react-qr-scanner").then((m) => ({ default: m.QrScanner }))
);

export default function Inventory() {
  const [scanResult, setScanResult] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <h2>Inventory</h2>
      {isClient ? (
        <Suspense fallback={<div>Loading scanner…</div>}>
          <LazyQrScanner
            onDecode={(result) => {
              if (result) setScanResult(result);
            }}
            onError={(error) => {
              if (error) console.error(error);
            }}
            constraints={{ facingMode: "environment" }}
            style={{ width: "100%" }}
          />
        </Suspense>
      ) : (
        <div>Preparing camera…</div>
      )}
      <p>Senast skannade: {scanResult}</p>
    </div>
  );
}

