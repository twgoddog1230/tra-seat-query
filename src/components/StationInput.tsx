'use client'

import { useState, useRef, useEffect } from 'react'
import { searchStations } from '@/data/stations'

interface Props {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function StationInput({ label, value, onChange, placeholder }: Props) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const suggestions = searchStations(query)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleInput(v: string) {
    setQuery(v)
    onChange(v)
    setOpen(true)
  }

  function handleSelect(name: string) {
    setQuery(name)
    onChange(name)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative flex flex-col gap-1">
      <label className="text-xs font-semibold text-rail-gold tracking-wider uppercase">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rail-gold text-sm">
          🚉
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder={placeholder ?? '輸入站名'}
          className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-rail-gold focus:bg-white/15 transition text-base"
        />
      </div>
      {open && suggestions.length > 0 && (
        <ul className="absolute top-full mt-1 left-0 right-0 z-50 bg-[#1a2a40] border border-white/20 rounded-xl overflow-hidden shadow-xl">
          {suggestions.map((s) => (
            <li
              key={`${s.name}-${s.line}`}
              onMouseDown={() => handleSelect(s.name)}
              className="px-4 py-2.5 cursor-pointer hover:bg-rail-gold/20 text-white text-sm flex justify-between items-center"
            >
              <span>{s.name}</span>
              <span className="text-xs text-white/40">{lineLabel(s.line)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function lineLabel(line: string) {
  switch (line) {
    case 'east': return '東部幹線'
    case 'west-mountain': return '西部山線'
    case 'west-coast': return '西部海線'
    case 'south-link': return '南迴線'
    default: return ''
  }
}
