import React, { useState, useEffect } from "react";

export default function ConfigPanel() {
    const [email, setEmail] = useState("");
    const [destinationRepo, setDestinationRepo] = useState("");

    const [sourceRepos, setSourceRepos] = useState<string[]>([]);
    const [sourceRepoInput, setSourceRepoInput] = useState("");
    const [isAddingSourceRepo, setIsAddingSourceRepo] = useState(false);
    const [isListCollapsed, setIsListCollapsed] = useState(true);

    useEffect(() => {
        async function loadConfig() {
            // @ts-ignore
            const syncProfile = await window.api.getSyncProfile();

            if (syncProfile) {
                setEmail(syncProfile.authorEmail || "");
                setDestinationRepo(syncProfile.destinationRepoPath || "");
                setSourceRepos(syncProfile.sourceRepoPaths || []);
            }
        }

        loadConfig();
    }, []);

    const handleSelectDestinationRepo = async () => {
        // @ts-ignore
        const selectedDirectory = await window.api.selectDirectory();

        if (selectedDirectory) {
            setDestinationRepo(selectedDirectory);
        }
    }

    const handleAddSourceRepo = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && sourceRepoInput.trim() !== "") {
            setSourceRepos([...sourceRepos, sourceRepoInput.trim()]);
            setSourceRepoInput("");
            setIsAddingSourceRepo(false);
        }
    };

    const handleCancleAddSourcerepo = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setSourceRepoInput("");
            setIsAddingSourceRepo(false);
        }
    };

    const handleRemoveRourceRepo = (indexToRemove: number) => {
        setSourceRepos(sourceRepos.filter((_, i) => i !== indexToRemove));
    };

    const handleSaveConfig = async () => {
        // @ts-ignore
        await window.api.saveSyncProfile(email, destinationRepo, sourceRepos);
        alert("Config saved with success!");
    };

    const handleResetConfig = () => {
        setEmail("");
        setDestinationRepo("");
        setSourceRepos([]);
    }

    return (
        <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
            <h2
                style={{
                    marginBottom: "0.5rem",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "1.75rem"
                }}
            >
                Settings
            </h2>
            <p
                style={{
                    color: "var(--text-secondary)",
                    textAlign: "left",
                    marginBottom: "2.5rem",
                    fontSize: "0.9rem"
                }}
            >
                Set up your synchronization preferences.
            </p>

            <div className="form-group">
                <label>Email (commits author)</label>
                <input
                    type="email"
                    className="form-input"
                    placeholder="your.name@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Destination Repository (personal git)</label>
                <button
                    type="button"
                    onClick={handleSelectDestinationRepo}
                    style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        background: "var(--surface-bg)",
                        border: destinationRepo ? "1px solid var(--border-light)" : "1px dashed var(--border-light)",
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
                            color: destinationRepo ? "var(--accent-green)" : "var(--border-medium)",
                            border: destinationRepo ? "1px solid var(--accent-green)" : "1px solid var(--border-medium)",
                            background: destinationRepo ? "var(--accent-green-light)" : "transparent",
                            borderRadius: "4px"
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </span>
                    
                    <span style={{ 
                        flex: 1, 
                        textAlign: "left",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden" 
                    }}>
                        {destinationRepo ? destinationRepo : "Select Repository"}
                    </span>

                    {destinationRepo && (
                        <div
                            className="btn-remove"
                            title="Clear selection"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDestinationRepo("");
                            }}
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
                <label>Source Repositories</label>

                {!isAddingSourceRepo ? (
                    <button
                        type="button"
                        onClick={() => setIsAddingSourceRepo(true)}
                        style={{
                            width: "100%",
                            padding: "0.75rem 1rem",
                            background: "var(--surface-bg)",
                            border: "1px dashed var(--border-light)",
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
                                color: "var(--border-medium)",
                                border: "1px solid var(--border-medium)",
                                borderRadius: "4px"
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </span>
                        Add Repository
                    </button>
                ) : (
                    <input
                        autoFocus 
                        type="text"
                        className="form-input"
                        placeholder="Type the path and press Enter..."
                        value={sourceRepoInput}
                        onChange={(event) => setSourceRepoInput(event.target.value)}
                        onKeyDown={(event) => {
                            handleAddSourceRepo(event);
                            handleCancleAddSourcerepo(event);
                        }}
                        onBlur={() => {
                            if (sourceRepoInput.trim() === "") setIsAddingSourceRepo(false);
                        }}
                    />
                )}

                {sourceRepos.length > 0 && (
                    <div style={{ marginTop: "1rem" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                                userSelect: "none"
                            }}
                            onClick={() => setIsListCollapsed(!isListCollapsed)}
                        >
                            <label
                                style={{
                                    fontSize: "0.9rem",
                                    fontWeight: 500,
                                    color: "var(--accent-green)",
                                    cursor: "pointer"
                                }}
                            >
                                Added repositories ({sourceRepos.length})
                            </label>
                            <span
                                style={{
                                    fontSize: "0.8rem",
                                    fontWeight: 500,
                                    color: "var(--text-secondary)",
                                    marginTop: "-2px"
                                }}
                            >
                                {isListCollapsed ? "+ Show" : "− Hide"}
                            </span>
                        </div>

                        {!isListCollapsed && (
                            <div className="repo-list" style={{ marginTop: "0.4rem" }}>
                                {sourceRepos.map((path, index) => (
                                    <div key={index} className="repo-chip">
                                        <span>{path}</span>
                                        <button
                                            className="btn-remove"
                                            style={{ color: "var(--border-medium)" }}
                                            onClick={() => handleRemoveRourceRepo(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "3rem",
                    gap: "0.6rem"
                }}
            >
                <button 
                    className="btn-secondary" 
                    style={{ minWidth: "140px" }}
                    onClick={handleResetConfig}
                >
                    Reset
                </button>
                <button
                    className="btn-primary"
                    style={{ minWidth: "140px" }}
                    onClick={handleSaveConfig}
                >
                    Save Settings {" >"}
                </button>
            </div>
        </div>
    );
}
