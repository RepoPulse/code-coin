"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // CORRECT import for App Router
import { Button } from "@/components/ui/button";
import { Code2, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export function RoleSelector() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<
    "user" | "maintainer" | null
  >(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const searchParams = useSearchParams();
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugLogs(prev => [...prev, logMessage]);
  };

  // Debug: Log session data when component mounts or session changes
  useEffect(() => {
    addLog(`Session status: ${status}`);
    addLog(`Session data: ${JSON.stringify(session, null, 2)}`);
  }, [session, status]);

  const handleSelect = async (role: "user" | "maintainer") => {
    addLog("=== STARTING ROLE SELECTION ===");
    addLog(`Role clicked: ${role}`);
    
    // Check session
    if (!session) {
      addLog("❌ ERROR: No session object!");
      alert("No session found! Please log in first.");
      return;
    }

    if (!session.user) {
      addLog("❌ ERROR: No session.user object!");
      addLog(`Session structure: ${JSON.stringify(Object.keys(session))}`);
      alert("No user in session! Check session structure.");
      return;
    }

    addLog(`✓ Session user exists`);
    addLog(`User object keys: ${Object.keys(session.user).join(", ")}`);

    setSelectedRole(role);
    setIsAnimating(true);

    try {
      const installation_id = searchParams.get("installation_id");
      addLog(`Installation ID from URL: ${installation_id || "none"}`);

      // Build user data with all possible session fields
      const userData = {
        id: session.user.id || (session.user as any).sub || "no-id",
        login: (session.user as any).login || session.user.name || "no-login",
        name: session.user.name || "No Name",
        email: session.user.email || "no-email@example.com",
        avatar_url: session.user.image || "",
        role: role,
        installation_id: installation_id,
      };

      addLog("📦 User data to send:");
      addLog(JSON.stringify(userData, null, 2));

      // Use local API route to avoid CORS issues
      const url = "/api/users/auth";
      addLog(`🌐 Calling API: ${url} (proxying to backend)`);

      // Add detailed fetch debugging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      addLog("🚀 Sending fetch request...");

      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      addLog(`✓ Response received!`);
      addLog(`Response status: ${res.status} ${res.statusText}`);
      addLog(`Response headers: ${JSON.stringify([...res.headers.entries()])}`);

      // Try to read response body
      const contentType = res.headers.get("content-type");
      addLog(`Content-Type: ${contentType}`);

      let responseData;
      if (contentType?.includes("application/json")) {
        responseData = await res.json();
        addLog(`Response body (JSON): ${JSON.stringify(responseData, null, 2)}`);
      } else {
        const textData = await res.text();
        addLog(`Response body (text): ${textData}`);
        responseData = textData;
      }

      if (!res.ok) {
        addLog(`❌ API Error: ${res.status}`);
        throw new Error(`Failed to upsert user: ${res.status}`);
      }

      addLog("✅ SUCCESS: User upserted successfully!");
      addLog(`Final role set to: ${role}`);
      
      // Success - redirect to appropriate page
      if (role === "user") {
        addLog("🔄 Redirecting to /user");
        router.push("/user");
      } else if (role === "maintainer") {
        addLog("🔄 Redirecting to /maintainer");
        router.push("/maintainer");
      }
      
    } catch (err: any) {
      addLog("❌ ERROR CAUGHT:");
      if (err.name === 'AbortError') {
        addLog("Request timed out after 10 seconds");
        alert("Request timed out. Check if backend is running.");
      } else {
        addLog(`Error type: ${err.name}`);
        addLog(`Error message: ${err.message}`);
        addLog(`Error stack: ${err.stack}`);
        alert(`Error: ${err.message}`);
      }
      
      setSelectedRole(null);
    } finally {
      setIsAnimating(false);
      addLog("=== ROLE SELECTION COMPLETE ===\n");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-900/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-900/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-balance leading-tight">
            <span className="bg-gradient-to-r from-red-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent">
              Choose Your Path
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 font-light">
            Fork the future. Build the community.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contributor Card */}
          <button
            onClick={() => handleSelect("user")}
            disabled={status === "loading" || isAnimating}
            className={`group relative p-8 md:p-12 rounded-2xl border-2 transition-all duration-500 transform ${
              selectedRole === "user"
                ? "border-red-700 bg-gradient-to-br from-red-900/30 to-red-800/20 scale-105 shadow-2xl shadow-red-900/40"
                : "border-slate-700 bg-slate-900/50 hover:border-red-700/50 hover:scale-102 hover:shadow-xl hover:shadow-red-900/20"
            } ${isAnimating && selectedRole === "user" ? "animate-pulse" : ""} ${
              status === "loading" || isAnimating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-700/0 to-red-700/0 group-hover:from-red-700/10 group-hover:to-red-700/5 transition-all duration-500" />

            <div className="relative z-10">
              <div className="mb-6 inline-block p-4 rounded-xl bg-gradient-to-br from-red-800/40 to-red-700/30 group-hover:from-red-800/60 group-hover:to-red-700/50 transition-all">
                <Code2 className="w-8 h-8 text-red-400" />
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-3 text-white">
                Contributor
              </h3>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Dive into projects. Write code. Make an impact. Get rewarded.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Find amazing projects",
                  "Submit pull requests",
                  "Earn USDC rewards",
                  "Build your portfolio",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-600 to-red-700" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="text-sm font-bold text-red-500 group-hover:text-red-400 transition-colors">
                {selectedRole === "user" ? "✓ SELECTED" : "SELECT THIS"}
              </div>
            </div>
          </button>

          {/* Maintainer Card */}
          <button
            onClick={() => handleSelect("maintainer")}
            disabled={status === "loading" || isAnimating}
            className={`group relative p-8 md:p-12 rounded-2xl border-2 transition-all duration-500 transform ${
              selectedRole === "maintainer"
                ? "border-blue-700 bg-gradient-to-br from-blue-900/30 to-blue-800/20 scale-105 shadow-2xl shadow-blue-900/40"
                : "border-slate-700 bg-slate-900/50 hover:border-blue-700/50 hover:scale-102 hover:shadow-xl hover:shadow-blue-900/20"
            } ${isAnimating && selectedRole === "maintainer" ? "animate-pulse" : ""} ${
              status === "loading" || isAnimating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-700/0 to-blue-700/0 group-hover:from-blue-700/10 group-hover:to-blue-700/5 transition-all duration-500" />

            <div className="relative z-10">
              <div className="mb-6 inline-block p-4 rounded-xl bg-gradient-to-br from-blue-800/40 to-blue-700/30 group-hover:from-blue-800/60 group-hover:to-blue-700/50 transition-all">
                <Users className="w-8 h-8 text-blue-400" />
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-3 text-white">
                Maintainer
              </h3>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Lead projects. Build communities. Shape the future of open
                source.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Manage your projects",
                  "Review contributions",
                  "Build your community",
                  "Track impact metrics",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="text-sm font-bold text-blue-500 group-hover:text-blue-400 transition-colors">
                {selectedRole === "maintainer" ? "✓ SELECTED" : "SELECT THIS"}
              </div>
            </div>
          </button>
        </div>

        {/* CTA Button */}
        {selectedRole && (
          <div className="flex justify-center">
            <Button
              onClick={() => handleSelect(selectedRole)}
              disabled={isAnimating || status === "loading"}
              className="relative px-12 py-6 text-lg font-black rounded-xl bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 text-white shadow-2xl shadow-red-900/50 hover:shadow-blue-900/50 transition-all duration-300 transform hover:scale-105 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">
                {isAnimating
                  ? "Processing..."
                  : selectedRole === "user"
                  ? "Start Contributing"
                  : "Start Maintaining"}
              </span>
            </Button>
          </div>
        )}

       
      </div>
    </div>
  );
}