"use client";

import { useAuth } from "../../lib/contexts/AuthContext";
import { useState } from "react";

export default function DebugPage() {
  const { clearAuth, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  const handleClearAuth = () => {
    clearAuth();
    setResult("Cleared all authentication data");
  };

  const handleLogin = async () => {
    try {
      const success = await login(email, password);
      setResult(success ? "Login successful!" : "Login failed!");
    } catch (error) {
      setResult(`Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const checkToken = () => {
    const token = localStorage.getItem('auth_token');
    setResult(`Current token: ${token || 'No token found'}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Authentication</h1>
      
      <div className="space-y-4">
        <div>
          <button 
            onClick={handleClearAuth}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear All Auth Data
          </button>
        </div>

        <div>
          <button 
            onClick={checkToken}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Check Current Token
          </button>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Test Login</h3>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button 
              onClick={handleLogin}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test Login
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
