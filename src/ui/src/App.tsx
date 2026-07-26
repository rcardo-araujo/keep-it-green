import ConfigPanel from "./components/ConfigPanel"

function App(): React.JSX.Element {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h1 style={{ color: 'var(--accent-green)', fontSize: '2.5rem' }}>Keep It Green</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Sync your commits.</p>
            </div>

            <ConfigPanel />
        </div>
    )
}

export default App
