interface SchedulePanelProps {
    onBack?: () => void,
    onNext?: () => void
}

export default function SchedulePanel({ onBack, onNext }: SchedulePanelProps) {
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
