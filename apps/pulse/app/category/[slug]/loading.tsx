import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--pulse-color-bg-canvas)" }}>
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "var(--pulse-color-text-primary)", letterSpacing: "-0.02em" }}>Loading Pulse Articles...</h2>
            <p style={{ color: "var(--pulse-color-text-muted)", marginTop: "8px" }}>Fetching real-time insights from the database.</p>
        </div>
    );
}
