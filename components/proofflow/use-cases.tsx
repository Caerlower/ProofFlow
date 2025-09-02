"use client"

import { motion } from "framer-motion"

const FILECOIN_BLUE = "#0090FF"

const cases = [
  {
    title: "dApps & Games",
    desc: "Secure, fast asset retrieval.",
    imgAlt: "dApps and games",
    imgQuery: "blockchain gaming assets",
  },
  {
    title: "Media Platforms",
    desc: "Decentralized streaming + pay-as-you-go.",
    imgAlt: "Media platform",
    imgQuery: "decentralized media streaming",
  },
  {
    title: "Enterprises",
    desc: "Compliance + verifiable storage.",
    imgAlt: "Enterprise data",
    imgQuery: "enterprise compliance storage",
  },
  {
    title: "IoT & DePIN",
    desc: "Device data storage with proofs.",
    imgAlt: "IoT devices",
    imgQuery: "iot device data storage",
  },
] as const

export function UseCases() {
  return (
    <section aria-labelledby="use-cases-title" className="relative">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-14 md:py-16">
        <div className="mb-6 text-center">
          <h2 id="use-cases-title" className="text-xl sm:text-2xl font-semibold">
            Use Cases
          </h2>
          <p className="mt-2 text-neutral-700 text-sm">
            Built for developers and organizations that need verifiable storage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {cases.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border bg-white shadow-sm hover:scale-[1.01] hover:shadow-md transition"
              style={{ borderColor: FILECOIN_BLUE }}
            >
              <div className="p-5">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/60 bg-white/70">
                  {i === 0 && (
                    <img
                      src="/blockchain-gaming-assets.png"
                      alt="dApps and games"
                      className="h-full w-full object-cover"
                    />
                  )}
                  {i === 1 && (
                    <img src="/decentralized-media-streaming.png" alt="Media platform" className="h-full w-full object-cover" />
                  )}
                  {i === 2 && (
                    <img
                      src="/enterprise-compliance-storage.png"
                      alt="Enterprise data"
                      className="h-full w-full object-cover"
                    />
                  )}
                  {i === 3 && (
                    <img src="/iot-device-data-storage.png" alt="IoT devices" className="h-full w-full object-cover" />
                  )}
                </div>
                <h3 className="mt-4 text-base font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{c.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
