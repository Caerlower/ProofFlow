import type React from "react"
const FILECOIN_BLUE = "#0090FF"
const SLATE = "#1B1F23"

export function SiteFooter() {
  return (
    <footer className="mt-8" style={{ backgroundColor: SLATE }} aria-labelledby="footer-title">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <div aria-hidden className="h-6 w-6 rounded-full" style={{ backgroundColor: FILECOIN_BLUE }} />
            <span id="footer-title" className="text-white font-semibold">
              ProofFlow
            </span>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-4">
              <li>
                <a
                  href="#docs"
                  className="text-white hover:text-(--brand) transition-colors"
                  style={{ ["--brand" as any]: FILECOIN_BLUE } as React.CSSProperties}
                >
                  Docs
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  className="text-white hover:text-(--brand) transition-colors"
                  style={{ ["--brand" as any]: FILECOIN_BLUE } as React.CSSProperties}
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  className="text-white hover:text-(--brand) transition-colors"
                  style={{ ["--brand" as any]: FILECOIN_BLUE } as React.CSSProperties}
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-white hover:text-(--brand) transition-colors"
                  style={{ ["--brand" as any]: FILECOIN_BLUE } as React.CSSProperties}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
