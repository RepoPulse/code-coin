"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, BookOpen, Bug, Zap, Palette, FileText, ArrowRight } from "lucide-react"

interface ContributionSelectorProps {
  role: "user" | "maintainer"
  onContinue: (contributions: string[]) => void
}

export function ContributionSelector({ role, onContinue }: ContributionSelectorProps) {
  const [selectedContributions, setSelectedContributions] = useState<string[]>([])

  const contributionTypes = {
    user: [
      { id: "code", label: "Write Code", icon: Code, description: "Contribute features and fixes" },
      { id: "docs", label: "Documentation", icon: BookOpen, description: "Improve project docs" },
      { id: "bugs", label: "Bug Reports", icon: Bug, description: "Report and fix issues" },
      { id: "design", label: "Design", icon: Palette, description: "UI/UX improvements" },
    ],
    maintainer: [
      { id: "manage", label: "Project Management", icon: Zap, description: "Oversee project direction" },
      { id: "review", label: "Code Review", icon: Code, description: "Review contributions" },
      { id: "community", label: "Community", icon: BookOpen, description: "Build community" },
      { id: "docs", label: "Documentation", icon: FileText, description: "Maintain docs" },
    ],
  }

  const types = contributionTypes[role]

  const toggleContribution = (id: string) => {
    setSelectedContributions((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  return (
    <div className="w-full py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">How Do You Want to Contribute?</h2>
          <p className="text-lg text-muted-foreground">
            Select all that apply to help us match you with the right projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {types.map((type) => {
            const Icon = type.icon
            const isSelected = selectedContributions.includes(type.id)

            return (
              <Card
                key={type.id}
                className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                    : "border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                }`}
                onClick={() => toggleContribution(type.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg transition-all ${isSelected ? "bg-primary/20" : "bg-card"}`}>
                      <Icon className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{type.label}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-background" />
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {selectedContributions.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={() => onContinue(selectedContributions)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 group"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
