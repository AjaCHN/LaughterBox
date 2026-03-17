// components/joke-card.tsx v4.0.0
import { motion } from "motion/react"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface JokeCardProps {
  content: string
  index: number
}

export function JokeCard({ content, index }: JokeCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <motion.div
      id={`joke-card-item-${index}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group relative flex flex-col justify-between rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <p id={`joke-text-${index}`} className="text-neutral-800 dark:text-neutral-200 leading-snug text-2xl font-serif">
        {content}
      </p>
      
      <div id={`joke-footer-${index}`} className="mt-3 flex items-center justify-between">
        <span id={`joke-index-${index}`} className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
          #{index + 1}
        </span>
        <button
          id={`btn-copy-${index}`}
          onClick={handleCopy}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-all hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-50"
          aria-label="Copy joke"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </motion.div>
  )
}

