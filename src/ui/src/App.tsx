import ConfigPanel from "./components/ConfigPanel"

function App(): React.JSX.Element {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
            <ConfigPanel />
        </div>
    )
}

export default App
