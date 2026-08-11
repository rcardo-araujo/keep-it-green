import { useState, useEffect, useRef } from "react";
import type { SyncProfile } from "../../../main/models/SyncProfile";

export default function SettingsPanel() {
    const [profile, setProfile] = useState<Partial<SyncProfile>>({
        authorEmail: "",
        destinationRepoPath: "",
        sourceRepoPaths: [],
        repoPrivacies: {},
        initialSyncDate: "2026-06-01",
        syncInterval: "daily"
    });
    
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const sinceDateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadConfig() {
            try {
                // @ts-ignore
                const syncProfile = await window.api.getSyncProfile();
                if (syncProfile) {
                    setProfile(syncProfile);
                }
            } catch (error) {
                console.error("Failed to load profile:", error);
            }
        }
        loadConfig();
    }, []);

    const handleChange = (key: keyof SyncProfile, value: any) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    const handleSelectDestinationRepo = async () => {
        // @ts-ignore
        const selectedDirectory = await window.api.selectDirectory();
        if (selectedDirectory) {
            handleChange("destinationRepoPath", selectedDirectory);
        }
    }

    const handleAddSourceRepo = async () => {
        // @ts-ignore
        const selectedDirectory = await window.api.selectDirectory();
        if (selectedDirectory) {
            const currentRepos = profile.sourceRepoPaths || [];
            if (!currentRepos.includes(selectedDirectory)) {
                handleChange("sourceRepoPaths", [...currentRepos, selectedDirectory]);
                // Default privacy for new repo is false (don't preserve)
                handleChange("repoPrivacies", {
                    ...(profile.repoPrivacies || {}),
                    [selectedDirectory]: false
                });
            }
        }
    };

    const handleRemoveSourceRepo = (repoToRemove: string) => {
        const newRepos = (profile.sourceRepoPaths || []).filter(r => r !== repoToRemove);
        const newPrivacies = { ...(profile.repoPrivacies || {}) };
        delete newPrivacies[repoToRemove];
        
        setProfile(prev => ({
            ...prev,
            sourceRepoPaths: newRepos,
            repoPrivacies: newPrivacies
        }));
    };

    const handleTogglePrivacy = (repo: string) => {
        const privacies = profile.repoPrivacies || {};
        handleChange("repoPrivacies", {
            ...privacies,
            [repo]: !privacies[repo]
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // @ts-ignore
            await window.api.saveSyncProfile(profile as SyncProfile);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto", paddingBottom: "4rem" }}>
            <h2 style={{ marginBottom: "0.5rem", textAlign: "left", fontWeight: 600, fontSize: "1.75rem" }}>
                Settings
            </h2>
            <p style={{ color: "var(--text-secondary)", textAlign: "left", marginBottom: "2.5rem", fontSize: "0.9rem" }}>
                Update your synchronization profile and preferences.
            </p>

            <div style={{ marginBottom: "3rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border-light)" }}>
                <h3 style={{ fontWeight: 600, fontSize: "1.25rem", marginBottom: "1.5rem", color: "var(--text-primary)" }}>Git Configuration</h3>
                
                <div className="form-group">
                    <label>Email (commits author)</label>
                    <input
                        type="email"
                        className="form-input"
                        placeholder="your.name@email.com"
                        value={profile.authorEmail || ""}
                        onChange={(e) => handleChange("authorEmail", e.target.value)}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Destination Repository (personal git)</label>
                    <button
                        type="button"
                        onClick={handleSelectDestinationRepo}
                        onMouseOver={(event) => (event.currentTarget.style.borderColor = "var(--accent-green)")}
                        onMouseOut={(event) => (event.currentTarget.style.borderColor = "var(--border-light)")}
                        style={{
                            width: "100%", padding: "0.75rem 1rem", background: "var(--surface-bg)",
                            border: profile.destinationRepoPath ? "1px solid var(--border-light)" : "1px dashed var(--border-light)",
                            borderRadius: "8px", height: "50px", color: "var(--text-primary)", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "left", gap: "0.75rem",
                            fontWeight: 500, fontSize: "0.95rem", transition: "all 0.2s ease"
                        }}
                    >
                        <span style={{
                            display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px",
                            color: profile.destinationRepoPath ? "var(--accent-green)" : "var(--border-medium)",
                            border: profile.destinationRepoPath ? "1px solid var(--accent-green)" : "1px solid var(--border-medium)",
                            background: profile.destinationRepoPath ? "var(--accent-green-light)" : "transparent",
                            borderRadius: "4px"
                        }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </span>
                        
                        <span style={{ flex: 1, textAlign: "left", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                            {profile.destinationRepoPath || "Select Repository"}
                        </span>

                        {profile.destinationRepoPath && (
                            <div className="btn-remove" title="Clear selection" onClick={(e) => { e.stopPropagation(); handleChange("destinationRepoPath", ""); }} style={{ color: "var(--border-medium)", padding: "0.2rem 0.5rem" }}>
                                X
                            </div>
                        )}
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: "3rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border-light)" }}>
                <h3 style={{ fontWeight: 600, fontSize: "1.25rem", marginBottom: "1.5rem", color: "var(--text-primary)" }}>Source Repositories</h3>
                
                <button
                    type="button"
                    onClick={handleAddSourceRepo}
                    onMouseOver={(event) => (event.currentTarget.style.borderColor = "var(--accent-green)")}
                    onMouseOut={(event) => (event.currentTarget.style.borderColor = "var(--border-light)")}
                    style={{
                        width: "100%", padding: "0.75rem 1rem", background: "var(--surface-bg)",
                        border: "1px dashed var(--border-light)", borderRadius: "8px", height: "50px",
                        color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center",
                        justifyContent: "left", gap: "0.75rem", fontWeight: 500, fontSize: "0.95rem", transition: "all 0.2s ease",
                        marginBottom: "1rem"
                    }}
                >
                    <span style={{
                        display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px",
                        color: "var(--border-medium)", border: "1px solid var(--border-medium)", borderRadius: "4px"
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </span>
                    Add Repository
                </button>

                {(profile.sourceRepoPaths && profile.sourceRepoPaths.length > 0) && (
                    <div style={{ background: "var(--surface-bg)", border: "1px solid var(--border-light)", borderRadius: "8px", overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border-light)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                            <span>Repository Path</span>
                            <span style={{ width: "120px", textAlign: "center" }}>Preserve Msg?</span>
                        </div>
                        {profile.sourceRepoPaths.map((repo, index) => {
                            const isPreserved = (profile.repoPrivacies || {})[repo];
                            return (
                                <div key={repo} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderBottom: index === profile.sourceRepoPaths!.length - 1 ? "none" : "1px solid var(--border-light)", background: isPreserved ? "#ffffff" : "transparent", transition: "all 0.2s ease" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, overflow: "hidden" }}>
                                        <button className="btn-remove" title="Remove" onClick={() => handleRemoveSourceRepo(repo)} style={{ padding: "0 0.2rem", fontSize: "0.8rem", cursor: "pointer" }}>X</button>
                                        <span style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontSize: "0.9rem", color: "var(--text-primary)" }}>{repo}</span>
                                    </div>
                                    <div style={{ width: "120px", display: "flex", justifyContent: "center" }} onClick={() => handleTogglePrivacy(repo)}>
                                        <button type="button" style={{ width: "22px", height: "22px", borderRadius: "50%", border: isPreserved ? "none" : "2px solid var(--border-medium)", background: isPreserved ? "var(--accent-green)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {isPreserved && (
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontWeight: 600, fontSize: "1.25rem", marginBottom: "1.5rem", color: "var(--text-primary)" }}>Schedule</h3>
                
                <div className="form-group">
                    <label>Start Syncing From</label>
                    <input type="date" ref={sinceDateInputRef} value={profile.initialSyncDate || ""} onChange={(e) => handleChange("initialSyncDate", e.target.value)} style={{ width: 0, height: 0, opacity: 0, position: "absolute", zIndex: -1 }} />
                    <button type="button" onClick={() => sinceDateInputRef.current?.showPicker()} 
                        onMouseOver={(event) => (event.currentTarget.style.borderColor = "var(--accent-green)")}
                        onMouseOut={(event) => (event.currentTarget.style.borderColor = "var(--border-light)")}
                        style={{ width: "100%", padding: "0.75rem 1rem", background: "var(--surface-bg)", border: profile.initialSyncDate ? "1px solid var(--border-light)" : "1px dashed var(--border-light)", borderRadius: "8px", height: "50px", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "left", gap: "0.75rem", fontWeight: 500, fontSize: "0.95rem", transition: "all 0.2s ease" }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", color: profile.initialSyncDate ? "var(--accent-green)" : "var(--border-medium)", border: profile.initialSyncDate ? "1px solid var(--accent-green)" : "1px solid var(--border-medium)", background: profile.initialSyncDate ? "var(--accent-green-light)" : "transparent", borderRadius: "4px" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </span>
                        <span style={{ flex: 1, textAlign: "left", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{profile.initialSyncDate || "Select Date"}</span>
                        {profile.initialSyncDate && <div className="btn-remove" title="Clear date" onClick={(e) => { e.stopPropagation(); handleChange("initialSyncDate", ""); }} style={{ color: "var(--border-medium)", cursor: "pointer", padding: "0.2rem 0.5rem" }}>X</div>}
                    </button>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Sync Interval</label>
                    <select className="form-input form-select" value={profile.syncInterval || "daily"} onChange={(e) => handleChange("syncInterval", e.target.value)} style={{ cursor: "pointer" }}>
                        <option value="hourly">Every hour</option>
                        <option value="3hours">Every 3h</option>
                        <option value="12hours">Every 12h</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", alignItems: "center" }}>
                {saveSuccess && <span style={{ color: "var(--accent-green)", fontWeight: 600 }}>Saved successfully!</span>}
                <button className="btn-primary" style={{ minWidth: "150px" }} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
