import { useState } from "react";

interface PrivacyPanelProps {
    onBack?: () => void;
    onNext?: () => void;
}

export default function PrivacyPanel({ onBack, onNext }: PrivacyPanelProps) {
    const [repoPrivacies, setRepoPrivacies] = useState<Record<string, boolean>>({});

    const handleToggleRepo = (repoPath: string) => {
        setRepoPrivacies(prevState => ({
            ...prevState,
            [repoPath]: !prevState[repoPath]
        }))
    }

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

            <div style={{ 
                background: "var(--surface-bg)", 
                border: "1px solid var(--border-light)", 
                borderRadius: "8px",
                overflow: "hidden"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    background: "rgba(0,0,0,0.02)",
                    borderBottom: "1px solid var(--border-light)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--text-secondary)"
                }}>
                    <span>Source Repository</span>
                    <span style={{ width: "150px", textAlign: "center" }}>Preserve message?</span>
                </div>

                {Object.entries(repoPrivacies).map(([repo, isPreserved], index) => (
                    <div 
                        key={repo}
                        style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "space-between",
                            padding: "1rem",
                            borderBottom: index === Object.keys(repoPrivacies).length - 1 ? "none" : "1px solid var(--border-light)",
                            background: isPreserved ? "#ffffff" : "rgba(0, 0, 0, 0.02)",
                            opacity: isPreserved ? 1 : 0.5,
                            gap: "1rem",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                        onClick={() => handleToggleRepo(repo)}
                    >
                        <div style={{ 
                            flex: 1, 
                            textAlign: "left",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            userSelect: "none",
                            color: isPreserved ? "var(--text-primary)" : "var(--text-secondary)"
                        }}>
                            {repo}
                        </div>
                        
                        <div style={{ width: "150px", display: "flex", justifyContent: "center" }}>
                            <button
                                type="button"
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    border: isPreserved ? "none" : "2px solid var(--border-medium)",
                                    background: isPreserved ? "var(--accent-green)" : "transparent",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                {isPreserved && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
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
