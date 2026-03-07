export default function Loading() {
    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                minHeight: "calc(100vh - 200px)",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "16px",
                background: "#ffffff"
            }}
        >
            <div
                style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid #E5E7EB",
                    borderTopColor: "#7C3AED",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }}
            />
            <p style={{ color: "#6B7280", fontSize: "14px", fontWeight: 500 }}>
                Loading Pulse Database...
            </p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
