// components/theme-toggle.tsx v5.3.2
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 md:h-10 md:w-10" />
    )
  }

  return (
    <button
      id="btn-theme-toggle"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-900 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 md:h-10 md:w-10"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 md:h-5 md:w-5" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 md:h-5 md:w-5" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
