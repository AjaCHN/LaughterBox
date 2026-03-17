// app/page.tsx v5.5.0
"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sparkles, Shuffle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { JOKES_DATA } from "@/lib/jokes-data"

export default function Page() {
  const [jokes] = useState<string[]>(JOKES_DATA)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      if (JOKES_DATA.length > 0) {
        setCurrentIndex(Math.floor(Math.random() * JOKES_DATA.length))
      } else {
        setCurrentIndex(0)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleRandom = useCallback(() => {
    if (jokes.length <= 1) return
    setCurrentIndex(prev => {
      let nextIndex = prev
      while (nextIndex === prev) {
        nextIndex = Math.floor(Math.random() * jokes.length)
      }
      return nextIndex
    })
  }, [jokes.length])

  return (
    <div id="page-wrapper" className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <header id="main-header" className="sticky top-0 z-10 border-b border-neutral-200/50 bg-white/90 backdrop-blur-sm dark:border-neutral-800/50 dark:bg-neutral-950/90">
        <div id="header-content" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-8 md:py-3">
          <div id="brand-logo" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-neutral-900 dark:text-neutral-50 md:h-6 md:w-6" />
            <h1 className="text-lg font-bold dark:text-neutral-50 md:text-xl">LaughterBox</h1>
          </div>
          <div id="header-actions" className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main-content" className="flex flex-1 flex-col items-center justify-center px-4 py-6 md:px-12 lg:px-24">
        <div id="joke-viewer-container" className="relative w-full max-w-3xl lg:max-w-4xl">
          <AnimatePresence mode="wait">
            {mounted && (
              <motion.div
                id={`joke-card-${currentIndex}`}
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex min-h-[350px] flex-col justify-center rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-12 md:min-h-[450px] md:p-16 lg:p-20"
              >
                <p id="joke-text" className="text-center font-serif text-3xl leading-relaxed text-neutral-800 dark:text-neutral-200 sm:text-4xl md:text-5xl lg:text-6xl">
                  {jokes.length > 0 ? jokes[currentIndex] : "暂无笑话"}
                </p>
              </motion.div>
            )}
            {!mounted && (
              <div className="flex min-h-[350px] flex-col justify-center rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-12 md:min-h-[450px] md:p-16 lg:p-20">
                <div className="h-12 w-3/4 animate-pulse self-center rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              </div>
            )}
          </AnimatePresence>

          <div id="nav-controls" className="mt-10 flex items-center justify-center md:mt-12">
            <button
              id="btn-random"
              onClick={handleRandom}
              className="flex h-16 w-full max-w-[200px] items-center justify-center gap-3 rounded-full border border-neutral-200 bg-white text-lg font-bold text-neutral-900 shadow-sm transition-all hover:bg-neutral-100 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800 md:h-20 md:max-w-[240px] md:text-xl"
            >
              <Shuffle className="h-6 w-6 md:h-7 md:w-7" />
              <span>换一个</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}


