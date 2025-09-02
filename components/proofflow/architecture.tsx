"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const FILECOIN_BLUE = "#0090FF"

export function Architecture() {
  return (
    <section aria-labelledby="arch-title" className="relative">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-14 md:py-16">
        <div className="mb-6 text-center">
          <h2 id="arch-title" className="text-xl sm:text-2xl font-semibold">
            Architecture
          </h2>
          <p className="mt-2 text-neutral-700 text-sm">A verifiable, pay-as-you-go flow on Filecoin.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl bg-white/60 backdrop-blur border border-white/50 shadow-md p-6"
          style={{
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          {/* Horizontal flow diagram */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-2">
            <Card label="User" />
            <Arrow color={FILECOIN_BLUE} />

            <Card label="ProofFlow SDK" />
            <Arrow color={FILECOIN_BLUE} />

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Card label="Warm Storage" subtle />
              <Arrow color={FILECOIN_BLUE} />
              <Card label="Filecoin Pay" subtle />
              <Arrow color={FILECOIN_BLUE} />
              <Card label="FilCDN" subtle />
            </div>

            <Arrow color={FILECOIN_BLUE} />
            <Card label="Verifiable Access" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Card({ label, subtle = false }: { label: string; subtle?: boolean }) {
  return (
    <div
      className="rounded-xl px-4 py-3 border text-sm shadow-sm"
      style={{
        background: subtle ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.9)",
        borderColor: "rgba(255,255,255,0.65)",
      }}
      aria-label={label}
      role="group"
    >
      <span className="text-neutral-800">{label}</span>
    </div>
  )
}

function Arrow({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center" aria-hidden>
      <ArrowRight className="h-5 w-5" color={color} />
    </div>
  )
}
