"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, TrendingUp, Shield, ZapIcon } from "lucide-react"

export function StellarPaymentSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0
      const scrollProgress = 1 - rect.top / window.innerHeight

      if (isVisible) {
        containerRef.current.style.opacity = Math.min(scrollProgress + 0.3, 1).toString()
        containerRef.current.style.transform = `translateY(${Math.max(0, 50 - scrollProgress * 50)}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="w-full py-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Powered by Stellar</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Efficient Code Rewards with
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                USDC on Stellar
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Get rewarded instantly for your contributions. USDC payments on Stellar provide fast, low-cost
              transactions that make it easy to monetize your open source work globally.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: TrendingUp, title: "Instant Payouts", description: "Receive USDC rewards in seconds" },
                { icon: Shield, title: "Secure & Transparent", description: "Blockchain-backed transactions" },
                { icon: ZapIcon, title: "Low Fees", description: "Minimal transaction costs" },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
            >
              Learn About Stellar Payments
            </Button>
          </div>

          {/* Right side - Visual */}
          <div className="relative h-96 md:h-full min-h-96">
            <Card className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 p-8 flex flex-col items-center justify-center overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl animate-float" />
                <div
                  className="absolute bottom-10 right-10 w-40 h-40 bg-accent rounded-full blur-3xl animate-float"
                  style={{ animationDelay: "1s" }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/50">
                  <Zap className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">USDC Stellar</h3>
                <p className="text-muted-foreground mb-6">Fast, secure, global payments</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Sub-second settlements</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>{"<"} 1% transaction fees</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Available worldwide</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
