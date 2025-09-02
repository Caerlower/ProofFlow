import { Hero } from "@/components/proofflow/hero"
import { Features } from "@/components/proofflow/features"
import { Architecture } from "@/components/proofflow/architecture"
import { UseCases } from "@/components/proofflow/use-cases"
import { CallToAction } from "@/components/proofflow/cta"
import { SiteFooter } from "@/components/proofflow/site-footer"

export default function Page() {
  return (
    <main className="flex flex-col">
      <section id="hero" aria-label="Hero" className="scroll-mt-24 md:scroll-mt-28">
        <Hero />
      </section>
      <section id="features" aria-label="Features" className="scroll-mt-24 md:scroll-mt-28">
        <Features />
      </section>
      <section id="architecture" aria-label="Architecture" className="scroll-mt-24 md:scroll-mt-28">
        <Architecture />
      </section>
      <section id="use-cases" aria-label="Use Cases" className="scroll-mt-24 md:scroll-mt-28">
        <UseCases />
      </section>
      <section id="get-started" aria-label="Get Started" className="scroll-mt-24 md:scroll-mt-28">
        <CallToAction />
      </section>
      <SiteFooter />
    </main>
  )
}
