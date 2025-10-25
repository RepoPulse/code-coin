"use client"

import { useEffect, useRef } from "react"

export function DevAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create floating code elements
    const codeSnippets = ["const", "function", "async", "await", "git", "commit", "push", "merge"]

    for (let i = 0; i < 6; i++) {
      const element = document.createElement("div")
      element.className = "absolute text-violet-500/30 font-mono text-sm animate-matrix-rain"
      element.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
      element.style.left = Math.random() * 100 + "%"
      element.style.top = "-20px"
      element.style.animationDelay = Math.random() * 2 + "s"
      element.style.animationDuration = 3 + Math.random() * 2 + "s"
      container.appendChild(element)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent animate-scan-line" />
    </div>
  )
}
