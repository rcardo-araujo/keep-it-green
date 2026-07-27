import React, { useState } from "react"
import ConfigPanel from "./components/ConfigPanel"
import SchedulePanel from "./components/SchedulePanel";

function App(): React.JSX.Element {
    const [currentScreen, setCurrentScreen] = useState("config");

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
            {
                currentScreen === "config" && (
                    <ConfigPanel onNext={() => setCurrentScreen("schedule")} />
                )
            }
            {
                currentScreen === "schedule" && (
                    <SchedulePanel 
                        onBack={() => setCurrentScreen("config")}
                        onNext={() => alert("Building screen!")}
                    />
                )
            }
        </div>
    )
}

export default App
