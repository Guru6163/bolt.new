"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

import { BackgroundBeams } from "@/components/ui/background-beams"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import SiriOrb from "@/components/smoothui/ui/SiriOrb"

const companyLogos = [
  "Accenture",
  "Google",
  "Intel",
  "Meta",
  "Salesforce",
  "Shopify",
  "Stripe",
]

export default function HomePage() {
  const [inputValue, setInputValue] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      // Navigate to builder page with the prompt
      router.push(`/builder?prompt=${encodeURIComponent(inputValue)}`)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Beams */}
      <BackgroundBeams className="absolute inset-0" />

      {/* Background SiriOrb */}
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="flex h-96 w-full items-end justify-center">
          <SiriOrb
            size="800px"
            className="opacity-20"
            colors={{
              bg: "oklch(95% 0.02 264.695)",
              c1: "oklch(75% 0.15 350)",
              c2: "oklch(80% 0.12 200)",
              c3: "oklch(78% 0.14 280)",
            }}
            animationDuration={20}
          />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
              <span className="text-xs font-bold text-white">b</span>
            </div>
            Introducing Bolt V2
          </div>

          <h1 className="font-poppins mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            What will you <span className="text-blue-600">build</span> today?
          </h1>
          <p className="font-poppins mx-auto max-w-2xl text-xl font-medium text-slate-600 md:text-2xl">
            Create stunning apps & websites by chatting with AI.
          </p>
        </div>

        {/* Main Input Section */}
        <div className="mx-auto mb-16 max-w-4xl">
          {/* Orb above input */}
          <div className="mb-8 flex justify-center">
            <SiriOrb
              size="200px"
              className="drop-shadow-2xl"
              colors={{
                bg: "oklch(95% 0.02 264.695)",
                c1: "oklch(75% 0.15 350)",
                c2: "oklch(80% 0.12 200)",
                c3: "oklch(78% 0.14 280)",
              }}
              animationDuration={15}
            />
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Let's build a prototype"
                rows={3}
                className="font-poppins min-h-[120px] w-full resize-none rounded-2xl border-2 border-slate-200 bg-white/90 px-6 py-4 pr-32 text-lg font-medium shadow-xl backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <div className="absolute right-2 top-2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  +
                </Button>
                <Button
                  type="submit"
                  className="font-poppins flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700"
                  disabled={!inputValue.trim()}
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Build now
                </Button>
              </div>
            </div>
          </form>

          {/* Example Chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setInputValue("Build a landing page for Amazon")}
              className="rounded-full border border-slate-300 bg-white/50 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm transition-all hover:border-blue-400 hover:bg-blue-50"
            >
              Build a landing page for Amazon
            </button>
            <button
              onClick={() => setInputValue("Create a dashboard with charts")}
              className="rounded-full border border-slate-300 bg-white/50 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm transition-all hover:border-blue-400 hover:bg-blue-50"
            >
              Create a dashboard with charts
            </button>
            <button
              onClick={() => setInputValue("Design a modern blog layout")}
              className="rounded-full border border-slate-300 bg-white/50 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm transition-all hover:border-blue-400 hover:bg-blue-50"
            >
              Design a modern blog layout
            </button>
          </div>

          {/* Import Options */}
          <div className="mt-6 text-center">
            <p className="font-poppins mb-4 text-sm text-slate-500">
              or import from
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="font-poppins rounded-full border-slate-200 px-6 py-2 font-medium hover:bg-slate-50"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Figma
              </Button>
              <Button
                variant="outline"
                className="font-poppins rounded-full border-slate-200 px-6 py-2 font-medium hover:bg-slate-50"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </div>
        </div>

        {/* Company Logos Section */}
        <div className="text-center">
          <p className="font-poppins mb-8 text-sm font-medium uppercase tracking-wider text-slate-500">
            THE #1 PROFESSIONAL VIBE CODING TOOL TRUSTED BY
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {companyLogos.map((company, index) => (
              <div
                key={index}
                className="font-poppins text-lg font-semibold text-slate-400"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
