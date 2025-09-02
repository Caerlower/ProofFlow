"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const FILECOIN_BLUE = "#0090FF"

export function CallToAction() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden">
      {/* Blue gradient to white fade background */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,144,255,0.15) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center"
        >
          <h2 id="cta-title" className="text-pretty text-2xl font-semibold sm:text-3xl">
            Ready to build with ProofFlow?
          </h2>
          <p className="mt-2 text-neutral-700">Launch your first decentralized storage app in minutes.</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              asChild
              className="text-white hover:brightness-95"
              style={
                {
                  backgroundImage: "linear-gradient(90deg, #0090FF 0%, #33B1FF 100%)",
                } as React.CSSProperties
              }
            >
              <Link href="#demo">Launch Demo</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white border-(--brand) text-(--brand) hover:brightness-95"
              style={{ ["--brand" as any]: FILECOIN_BLUE } as React.CSSProperties}
            >
              <Link href="#cohort">Join Cohort</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
