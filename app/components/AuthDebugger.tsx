// components/AuthDebugger.tsx (Safe Version)
"use client"
import { useEffect, useState } from 'react';

export function AuthDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(`[AuthDebug] ${message}`);
    setLogs(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { fetchAuthSession, getCurrentUser } = await import('aws-amplify/auth');
        const session = await fetchAuthSession();
        const user = await getCurrentUser();
        
        addLog(`Session: ${session.tokens ? 'Valid' : 'Invalid'}, User: ${user.username}`);
        setDebugInfo({
          session: session.tokens ? 'Valid' : 'No tokens',
          user: user.username,
          route: window.location.pathname
        });
      } catch (error: any) {
        addLog(`Error: ${error.message}`);
        setDebugInfo({ error: error.message });
      }
    };

    checkAuth();
    
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 p-4 rounded-lg max-w-md z-50 shadow-lg">
      <h3 className="font-bold text-blue-800 mb-2">🔍 Auth Debugger</h3>
      <div className="space-y-1 text-sm">
        <div><strong>Route:</strong> {window.location.pathname}</div>
        <div><strong>Session:</strong> {debugInfo.session}</div>
        <div><strong>User:</strong> {debugInfo.user || 'None'}</div>
      </div>
      <div className="mt-3 max-h-24 overflow-y-auto">
        <h4 className="font-semibold text-blue-700 text-xs">Logs:</h4>
        {logs.map((log, index) => (
          <div key={index} className="text-xs font-mono border-b border-blue-200 py-1">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}