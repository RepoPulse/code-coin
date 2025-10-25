"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code2, Users } from "lucide-react"

interface RoleSelectorProps {
  onRoleSelect: (role: "user" | "maintainer") => void
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<"user" | "maintainer" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSelect = (role: "user" | "maintainer") => {
    setSelectedRole(role)
    setIsAnimating(true)
    setTimeout(() => {
      onRoleSelect(role)
    }, 600)
  }

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
          <p className="text-xl md:text-2xl text-slate-400 font-light">Fork the future. Build the community.</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contributor Card */}
          <button
            onClick={() => handleSelect("user")}
            className={`group relative p-8 md:p-12 rounded-2xl border-2 transition-all duration-500 transform ${
              selectedRole === "user"
                ? "border-red-700 bg-gradient-to-br from-red-900/30 to-red-800/20 scale-105 shadow-2xl shadow-red-900/40"
                : "border-slate-700 bg-slate-900/50 hover:border-red-700/50 hover:scale-102 hover:shadow-xl hover:shadow-red-900/20"
            } ${isAnimating && selectedRole === "user" ? "animate-pulse" : ""}`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-700/0 to-red-700/0 group-hover:from-red-700/10 group-hover:to-red-700/5 transition-all duration-500" />

            <div className="relative z-10">
              <div className="mb-6 inline-block p-4 rounded-xl bg-gradient-to-br from-red-800/40 to-red-700/30 group-hover:from-red-800/60 group-hover:to-red-700/50 transition-all">
                <Code2 className="w-8 h-8 text-red-400" />
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-3 text-white">Contributor</h3>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Dive into projects. Write code. Make an impact. Get rewarded.
              </p>

              <ul className="space-y-3 mb-8">
                {["Find amazing projects", "Submit pull requests", "Earn USDC rewards", "Build your portfolio"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-600 to-red-700" />
                      {item}
                    </li>
                  ),
                )}
              </ul>

              <div className="text-sm font-bold text-red-500 group-hover:text-red-400 transition-colors">
                {selectedRole === "user" ? "✓ SELECTED" : "SELECT THIS"}
              </div>
            </div>
          </button>

          {/* Maintainer Card */}
          <button
            onClick={() => handleSelect("maintainer")}
            className={`group relative p-8 md:p-12 rounded-2xl border-2 transition-all duration-500 transform ${
              selectedRole === "maintainer"
                ? "border-blue-700 bg-gradient-to-br from-blue-900/30 to-blue-800/20 scale-105 shadow-2xl shadow-blue-900/40"
                : "border-slate-700 bg-slate-900/50 hover:border-blue-700/50 hover:scale-102 hover:shadow-xl hover:shadow-blue-900/20"
            } ${isAnimating && selectedRole === "maintainer" ? "animate-pulse" : ""}`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-700/0 to-blue-700/0 group-hover:from-blue-700/10 group-hover:to-blue-700/5 transition-all duration-500" />

            <div className="relative z-10">
              <div className="mb-6 inline-block p-4 rounded-xl bg-gradient-to-br from-blue-800/40 to-blue-700/30 group-hover:from-blue-800/60 group-hover:to-blue-700/50 transition-all">
                <Users className="w-8 h-8 text-blue-400" />
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-3 text-white">Maintainer</h3>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Lead projects. Build communities. Shape the future of open source.
              </p>

              <ul className="space-y-3 mb-8">
                {["Manage your projects", "Review contributions", "Build your community", "Track impact metrics"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700" />
                      {item}
                    </li>
                  ),
                )}
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
              className="relative px-12 py-6 text-lg font-black rounded-xl bg-gradient-to-r from-red-700 to-blue-700 hover:from-red-600 hover:to-blue-600 text-white shadow-2xl shadow-red-900/50 hover:shadow-blue-900/50 transition-all duration-300 transform hover:scale-105 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">{selectedRole === "user" ? "Start Contributing" : "Start Maintaining"}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
