"use client"

import type React from "react"

import { motion } from "framer-motion"
import { CreditCard, Lock, Zap, Package } from "lucide-react"

const FILECOIN_BLUE = "#0090FF"

const features = [
  {
    title: "Pay-As-You-Go",
    desc: "Only pay for what you use with Filecoin Pay.",
    Icon: CreditCard,
  },
  {
    title: "Verifiable Storage",
    desc: "Prove Data Possession (PDP) ensures trustless storage.",
    Icon: Lock,
  },
  {
    title: "Fast Retrieval",
    desc: "FilCDN delivers instant, reliable content retrieval.",
    Icon: Zap,
  },
  {
    title: "Developer SDK",
    desc: "Synapse SDK for easy integration.",
    Icon: Package,
  },
] as const

export function Features() {
  return (
    <section aria-labelledby="features-title" className="relative">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-14 md:py-16">
        <div className="mb-6 text-center">
          <h2 id="features-title" className="text-xl sm:text-2xl font-semibold">
            Why ProofFlow
          </h2>
          <p className="mt-2 text-neutral-700 text-sm">
            Pay-as-you-go storage with streaming payments, PDP-verified integrity, CDN-fast retrieval, and a plug-and-play SDK—bringing cloud-like DX to Filecoin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
              className="group rounded-2xl bg-white/60 backdrop-blur border border-white/50 shadow-md p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className="rounded-xl border border-white/60 bg-white/70 p-3 shadow-sm group-hover:ring-2 group-hover:ring-(--brand) group-hover:ring-offset-0 transition"
                  style={{ ["--brand" as any]: FILECOIN_BLUE } as React.CSSProperties}
                >
                  <f.Icon aria-hidden className="h-5 w-5" color={FILECOIN_BLUE} />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
