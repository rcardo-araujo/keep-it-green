import React, { useState } from "react"
import ConfigPanel from "./components/ConfigPanel"
import SchedulePanel from "./components/SchedulePanel";
import PrivacyPanel from "./components/PrivacyPanel";
import type { SyncProfile } from "../../main/models/SyncProfile"

function App(): React.JSX.Element {
    const [currentScreen, setCurrentScreen] = useState("config");
    const [syncProfileDto, setSyncProfileDto] = useState<Partial<SyncProfile>>({});

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
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
                        onBack={() => setCurrentScreen("schedule")}
                        onNext={() => alert("Building screen!")}
                    />
                )
            }
        </div>
    )
}

export default App
