import { useState, useEffect } from 'react';

interface HealthStatus {
    success: boolean;
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
}

function App() {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await fetch('/api/health');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                setHealth(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to connect');
                setHealth(null);
            } finally {
                setLoading(false);
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="app">
            <header className="header">
                <h1>🎓 UpGrad Learning</h1>
                <p className="subtitle">Fullstack Monorepo</p>
            </header>

            <main className="main">
                <div className="card">
                    <h2>Backend Status</h2>
                    {loading ? (
                        <div className="status loading">⏳ Connecting...</div>
                    ) : error ? (
                        <div className="status error">
                            <span className="dot red"></span>
                            ❌ Disconnected: {error}
                        </div>
                    ) : health ? (
                        <div className="status success">
                            <span className="dot green"></span>
                            ✅ Connected
                            <div className="details">
                                <p><strong>Status:</strong> {health.status}</p>
                                <p><strong>Environment:</strong> {health.environment}</p>
                                <p><strong>Uptime:</strong> {Math.floor(health.uptime)}s</p>
                                <p><strong>Last check:</strong> {new Date(health.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="card">
                    <h2>Tech Stack</h2>
                    <ul className="stack-list">
                        <li>⚛️ React 18 + TypeScript</li>
                        <li>⚡ Vite</li>
                        <li>🚀 Express.js</li>
                        <li>🗄️ Prisma + SQLite</li>
                        <li>📦 pnpm Workspaces</li>
                        <li>🔧 Turborepo</li>
                    </ul>
                </div>
            </main>

            <footer className="footer">
                <p>Built with ❤️ for learning</p>
            </footer>
        </div>
    );
}

export default App;
