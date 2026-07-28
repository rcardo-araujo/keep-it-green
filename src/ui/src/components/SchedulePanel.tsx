import { useState } from "react";

interface SchedulePanelProps {
    onBack?: () => void,
    onNext?: () => void
}

export default function SchedulePanel({ onBack, onNext }: SchedulePanelProps) {
    const [syncInterval, setSyncInterval] = useState("daily")

    const handleBack = () => {
        if (onBack) onBack();
    }

    const handleNext = () => {
        if (onNext) onNext();
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
