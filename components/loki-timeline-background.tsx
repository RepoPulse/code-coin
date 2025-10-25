"use client"

import { useEffect, useRef } from "react"

export function LokiTimelineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const branches: Branch[] = []
    let animationId: number

    interface Branch {
      x: number
      y: number
      vx: number
      vy: number
      angle: number
      length: number
      life: number
      maxLife: number
      children: Branch[]
      depth: number
    }

    class Branch {
      constructor(x: number, y: number, angle: number, depth = 0) {
        this.x = x
        this.y = y
        this.angle = angle
        this.vx = Math.cos(angle) * 2
        this.vy = Math.sin(angle) * 2
        this.length = Math.random() * 100 + 50
        this.life = 0
        this.maxLife = Math.random() * 200 + 150
        this.children = []
        this.depth = depth
      }

      update() {
        this.life++
        this.x += this.vx
        this.y += this.vy
        this.vy += 0.1 // gravity

        if (this.life > this.maxLife * 0.7 && this.children.length === 0 && this.depth < 3) {
          // Create child branches (fork)
          const childCount = Math.random() > 0.5 ? 2 : 1
          for (let i = 0; i < childCount; i++) {
            const newAngle = this.angle + (Math.random() - 0.5) * 0.8
            this.children.push(new Branch(this.x, this.y, newAngle, this.depth + 1))
          }
        }

        this.children.forEach((child) => child.update())
      }

      draw(ctx: CanvasRenderingContext2D) {
        const progress = this.life / this.maxLife
        const opacity = Math.max(0, 1 - Math.abs(progress - 0.5) * 2)

        // Draw main branch line
        ctx.strokeStyle = `rgba(220, 38, 38, ${opacity * 0.6})`
        ctx.lineWidth = Math.max(1, 3 - this.depth)
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        const startX = this.x - this.vx * 10
        const startY = this.y - this.vy * 10

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(this.x, this.y)
        ctx.stroke()

        // Draw glow effect
        ctx.strokeStyle = `rgba(220, 38, 38, ${opacity * 0.3})`
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(this.x, this.y)
        ctx.stroke()

        // Draw node
        ctx.fillStyle = `rgba(220, 38, 38, ${opacity * 0.8})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, 3 + this.depth, 0, Math.PI * 2)
        ctx.fill()

        // Draw outer glow
        ctx.strokeStyle = `rgba(220, 38, 38, ${opacity * 0.4})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(this.x, this.y, 6 + this.depth * 2, 0, Math.PI * 2)
        ctx.stroke()

        this.children.forEach((child) => child.draw(ctx))
      }
    }

    const createNewBranch = () => {
      const angle = Math.random() * Math.PI * 2
      branches.push(new Branch(canvas.width / 2, canvas.height / 2, angle))
    }

    // Create initial branches
    for (let i = 0; i < 3; i++) {
      createNewBranch()
    }

    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw branches
      branches.forEach((branch, index) => {
        branch.update()
        branch.draw(ctx)

        if (branch.life > branch.maxLife) {
          branches.splice(index, 1)
        }
      })

      // Create new branches periodically
      if (Math.random() < 0.02) {
        createNewBranch()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ background: "transparent" }} />
}
