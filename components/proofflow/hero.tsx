"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const FILECOIN_BLUE = "#0090FF"
const SLATE = "#1B1F23"

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      {/* Subtle blue accent background with abstract nodes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* soft radial blue glow */}
        <div
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full"
          style={{
            background: "radial-gradient(closest-side, rgba(0,144,255,0.18), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full"
          style={{
            background: "radial-gradient(closest-side, rgba(0,144,255,0.15), transparent 70%)",
          }}
        />
        {/* subtle dot grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-24 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <h1 id="hero-title" className="text-balance text-3xl font-semibold sm:text-4xl md:text-5xl">
            Verifiable, Pay-As-You-Go Storage on Filecoin
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-foreground/80">
            ProofFlow brings cloud-like flexibility, cryptographic verifiability, and blazing-fast retrieval to Filecoin
            storage.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              asChild
              className="text-white bg-(--brand) hover:brightness-95 transition-colors"
              style={
                {
                  ["--brand" as any]: FILECOIN_BLUE,
                } as React.CSSProperties
              }
            >
              <Link href="#get-started">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-(--brand) text-(--brand) hover:brightness-95 bg-transparent"
              style={{ ["--brand" as any]: FILECOIN_BLUE } as React.CSSProperties}
            >
              <Link href="#docs">View Docs</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
