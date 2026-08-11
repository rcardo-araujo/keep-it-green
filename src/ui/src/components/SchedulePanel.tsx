import { useState, useRef } from "react";
import { SyncProfile } from "../../../main/models/SyncProfile";

interface SchedulePanelProps {
    onBack?: () => void,
    onNext?: (data: Pick<SyncProfile, "initialSyncDate" | "syncInterval">) => void
}

export default function SchedulePanel({ onBack, onNext }: SchedulePanelProps) {
    const [syncInterval, setSyncInterval] = useState("daily")
    const [sinceDate, setSinceDate] = useState("2026-06-01")

    const sinceDateInputRef = useRef<HTMLInputElement>(null);

    const handleBack = () => {
        if (onBack) onBack();
    }

    const handleNext = () => {
        if (onNext) onNext({
            initialSyncDate: sinceDate,
            syncInterval: syncInterval
        });
    }

    const handleOpenCalendar = async () => {
        sinceDateInputRef.current?.showPicker();
    }

    const handleClearSinceDate = (event: React.MouseEvent) => {
        event.stopPropagation();
        setSinceDate("");
    }

    return (
        <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "0.5rem", textAlign: "left", fontWeight: 600, fontSize: "1.75rem" }}>
                Schedule
            </h2>
            <p style={{ color: "var(--text-secondary)", textAlign: "left", marginBottom: "2.5rem", fontSize: "0.9rem" }}>
                Define the synchronization frequency and starting dates.
            </p>

            <div className="form-group">
                <label>Since Date</label>
                <input 
                    type="date" 
                    ref={sinceDateInputRef} 
                    onChange={(event) => setSinceDate(event.target.value)}
                    style={{ width: 0, height: 0, opacity: 0, position: "absolute", zIndex: -1 }} 
                />
                <button
                    type="button"
                    onClick={handleOpenCalendar}
                    style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        background: "var(--surface-bg)",
                        border: sinceDate ? "1px solid var(--border-light)" : "1px dashed var(--border-light)",
                        borderRadius: "8px",
                        height: "50px",
                        color: "var(--text-primary)", 
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "left",
                        gap: "0.75rem",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        transition: "all 0.2s ease"
                    }}
                    onMouseOver={(event) =>
                        (event.currentTarget.style.borderColor = "var(--accent-green)")
                    }
                    onMouseOut={(event) => (event.currentTarget.style.borderColor = "var(--border-light)")}
                >
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "24px",
                            height: "24px",
                            color: sinceDate ? "var(--accent-green)" : "var(--border-medium)",
                            border: sinceDate ? "1px solid var(--accent-green)" : "1px solid var(--border-medium)",
                            background: sinceDate ? "var(--accent-green-light)" : "transparent",
                            borderRadius: "4px"
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </span>
                    
                    <span style={{ 
                        flex: 1, 
                        textAlign: "left",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden" 
                    }}>
                        {sinceDate ? sinceDate : "Select Date"}
                    </span>

                    {sinceDate && (
                        <div
                            className="btn-remove"
                            title="Clear date"
                            onClick={handleClearSinceDate}
                            style={{
                                color: "var(--border-medium)",
                                cursor: "pointer",
                                padding: "0.2rem 0.5rem"
                            }}
                        >
                            X
                        </div>
                    )}
                </button>
            </div>

            <div className="form-group">
                <label>Sync Interval</label>
                <select
                    className="form-input form-select"
                    value={syncInterval}
                    onChange={(event) => setSyncInterval(event.target.value)}
                    style={{ cursor: "pointer" }}
                >
                    <option value="hourly">Every hour</option>
                    <option value="3hours">Every 3h</option>
                    <option value="12hours">Every 12h</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3rem", gap: "0.6rem" }}>
                <button 
                    className="btn-secondary" 
                    style={{ minWidth: "140px" }}
                    onClick={handleBack}
                >
                    {" <"} Back
                </button>
                <button
                    className="btn-primary"
                    style={{ minWidth: "140px" }}
                    onClick={handleNext}
                >
                    Next {" >"}
                </button>
            </div>
        </div>
    );
}
