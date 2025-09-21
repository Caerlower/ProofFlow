"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { WalletConnectButton } from "@/components/WalletConnectButton"

function Logo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="ProofFlow home">
      <img src="/proofflow.png" alt="ProofFlow logo" className={className} height={28} width={28} />
      <span className="font-semibold tracking-tight">ProofFlow</span>
    </Link>
  )
}

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#architecture", label: "Architecture" },
  { href: "/#use-cases", label: "Use Cases" },
  { href: "/#get-started", label: "Get Started" },
] as const

const normalize = (h: string) => (h.startsWith("/#") ? h.slice(1) : h)

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [activeHash, setActiveHash] = useState<string>("#hero")

  useEffect(() => {
    const ids = ["hero", "features", "architecture", "use-cases", "get-started"]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`)
          }
        })
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    const onHash = () => setActiveHash(window.location.hash || "#hero")
    window.addEventListener("hashchange", onHash)
    return () => {
      observer.disconnect()
      window.removeEventListener("hashchange", onHash)
    }
  }, [])

  const handleAnchorClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const id = href.replace("/#", "").replace("#", "")
    const el = document.getElementById(id)
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", `/#${id}`)
      setOpen(false)
    }
  }

  const isActive = (href: string) => normalize(activeHash) === normalize(href)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={handleAnchorClick(l.href)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`text-sm transition-colors ${
                  isActive(l.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <WalletConnectButton />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/dashboard" className="bg-[#0090FF] hover:bg-[#0078CC] text-white">
              Dashboard
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo className="h-7 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-3">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={handleAnchorClick(l.href)}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`rounded px-2 py-2 transition-colors ${
                      isActive(l.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="mt-2 space-y-2">
                  <WalletConnectButton />
                  <Button asChild className="w-full">
                    <Link href="/dashboard">
                      Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
