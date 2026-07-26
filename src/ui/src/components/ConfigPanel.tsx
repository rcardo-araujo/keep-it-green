import React, { useState, useEffect } from "react";

export default function ConfigPanel() {
    const [email, setEmail] = useState("");
    const [destinationRepo, setDestinationRepo] = useState("");

    const [sourceRepos, setSourceRepos] = useState<string[]>([]);
    const [sourceRepoInput, setSourceRepoInput] = useState("");

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
    }, [])

    const handleAddSourceRepo = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && sourceRepoInput.trim() !== "") {
            setSourceRepos([...sourceRepos, sourceRepoInput.trim()]);
            setSourceRepoInput("");
        }
    }

    const handleRemoveRourceRepo = (indexToRemove: number) => {
        setSourceRepos(sourceRepos.filter((_, i) => i !== indexToRemove));
    }

    const handleSaveConfig = async () => {
        // @ts-ignore
        await window.api.saveSyncProfile(email, destinationRepo, sourceRepos);
        alert("Config saved with success!");
    }

    return (
        <div className="glass-panel" style={{ padding: '2rem', width: '100%' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Configurations</h2>

            <div className="form-group">
                <label>Email (Commits Author)</label>
                <input 
                    type="email" 
                    className="form-input" 
                    placeholder="your.name@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Destination Repository (Personal Git)</label>
                <input 
                    type="text" 
                    className="form-input" 
                    placeholder="C:/Projetos/my-github-green"
                    value={destinationRepo}
                    onChange={(event) => setDestinationRepo(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Source Repositories (Press Enter to Add)</label>
                <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Add a path and press enter..."
                    value={sourceRepoInput}
                    onChange={(event) => setSourceRepoInput(event.target.value)}
                    onKeyDown={handleAddSourceRepo}
                />
                
                {sourceRepos.length > 0 && (
                    <div className="repo-list">
                        {sourceRepos.map((path, index) => (
                            <div key={index} className="repo-chip">
                                <span>{path}</span>
                                <button className="btn-remove" onClick={() => handleRemoveRourceRepo(index)}>X</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleSaveConfig}>
                Save Configurations
            </button>
        </div>
    )
}
