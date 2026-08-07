import React, { useEffect, useState } from "react"
import ConfigPanel from "./components/ConfigPanel"
import SchedulePanel from "./components/SchedulePanel";
import PrivacyPanel from "./components/PrivacyPanel";
import type { SyncProfile } from "../../main/models/SyncProfile"
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";

function App(): React.JSX.Element {
    const [currentScreen, setCurrentScreen] = useState("");
    const [syncProfileDto, setSyncProfileDto] = useState<Partial<SyncProfile>>({});

    useEffect(() => {
        const loadInitialScreen = async () => {
            try {
                // @ts-ignore
                const profile = await window.api.getSyncProfile();

                if (profile !== null) setCurrentScreen("dashboard");
                else setCurrentScreen("config");
            } catch (error) {
                console.log("Failed to load profile: ", error);
                setCurrentScreen("config");
            }
        };

        loadInitialScreen();
    }, []);

    return (
        <div className="app-layout">
            {(currentScreen === "dashboard" || currentScreen === "settings") && (
                <Sidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
            )}

            <main className="main-content">
                <div className="wizard-container">
                    {
                        currentScreen === "config" && (
                            <ConfigPanel 
                                onNext={(configData) => { 
                                    setSyncProfileDto(prevState => ({ ...prevState, ...configData }))
                                    setCurrentScreen("schedule");
                                }} 
                            />
                        )
                    }
                    {
                        currentScreen === "schedule" && (
                            <SchedulePanel 
                                onBack={() => setCurrentScreen("config")}
                                onNext={(scheduleData) => {
                                    setSyncProfileDto(prevState => ({ ...prevState, ...scheduleData }))
                                    setCurrentScreen("privacy");
                                }}
                            />
                        )
                    }
                    {
                        currentScreen === "privacy" && (
                            <PrivacyPanel
                                sourceRepos={syncProfileDto.sourceRepoPaths}
                                onBack={() => setCurrentScreen("schedule")}
                                onSave={async (privacyData) => {
                                    const syncProfileToSave = { ...syncProfileDto, ...privacyData };
                                    setSyncProfileDto(prevState => ({ ...prevState, ...syncProfileToSave }));

                                    // @ts-ignore
                                    await window.api.saveSyncProfile(syncProfileToSave);

                                    setCurrentScreen("dashboard");
                                }}
                            />
                        )
                    }
                    {
                        currentScreen === "dashboard" && (
                            <Dashboard />
                        )
                    }
                    {
                        currentScreen === "settings" && (
                            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                                <h2>Settings Screen</h2>
                                <p>This screen is under construction based on the new unified layout.</p>
                                <button className="btn-secondary" onClick={() => setCurrentScreen('dashboard')}>Back to Dashboard</button>
                            </div>
                        )
                    }
                </div>
            </main>
        </div>
    )
}

export default App
