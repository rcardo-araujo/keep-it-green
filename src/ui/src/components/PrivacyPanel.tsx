interface PrivacyPanelProps {
    onBack?: () => void;
    onNext?: () => void;
}

export default function PrivacyPanel({ onBack, onNext }: PrivacyPanelProps) {
    const handleBack = () => {
        if (onBack) onBack();
    }

    const handleNext = () => {
        if (onNext) onNext();
    }

    return (
        <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "0.5rem", textAlign: "left", fontWeight: 600, fontSize: "1.75rem" }}>
                Privacy
            </h2>
            <p style={{ color: "var(--text-secondary)", textAlign: "left", marginBottom: "2.5rem", fontSize: "0.9rem" }}>
                Choose which repositories will have their original commit messages preserved.
            </p>

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
