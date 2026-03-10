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
                background: "var(--pulse-color-bg-canvas)"
            }}
        >
            <div
                style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid var(--pulse-color-border-subtle)",
                    borderTopColor: "var(--pulse-color-accent-purple)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }}
            />
            <p style={{ color: "var(--pulse-color-text-muted)", fontSize: "14px", fontWeight: 500 }}>
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
