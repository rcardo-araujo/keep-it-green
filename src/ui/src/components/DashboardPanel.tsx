export default function DashboardPanel() {
    return (
        <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", paddingBottom: "4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                <h2 style={{ textAlign: "left", fontWeight: 600, fontSize: "1.75rem", margin: 0, color: "var(--text-primary)" }}>
                    Dashboard
                </h2>

                <button
                    className="btn-primary"
                    style={{ minWidth: "140px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    Sync
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
                <div className="metric-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line></svg>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Commits Synced</span>
                    </div>
                    <span style={{ fontSize: "2rem", fontWeight: 600, color: "var(--accent-green)" }}>1,248</span>
                </div>
                
                <div className="metric-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Source Repos</span>
                    </div>
                    <span style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-primary)" }}>4</span>
                </div>
                
                <div className="metric-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Last Update</span>
                    </div>
                    <span style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "auto", marginBottom: "0.25rem" }}>2 hours ago</span>
                </div>
                
                <div className="metric-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Next Sync</span>
                    </div>
                    <span style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "auto", marginBottom: "0.25rem" }}>In 4 hours</span>
                </div>
            </div>
        </div>
    );
}
