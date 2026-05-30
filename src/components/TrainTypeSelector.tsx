'use client'

import { TRAIN_TYPES, TrainType } from '@/data/trainRules'

interface Props {
  value: TrainType | ''
  onChange: (v: TrainType) => void
}

export default function TrainTypeSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-rail-gold tracking-wider uppercase">
        車種
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TRAIN_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition ${
              value === t.id
                ? 'bg-rail-gold text-rail-dark border-rail-gold'
                : 'bg-white/10 text-white border-white/20 hover:border-rail-gold/60 hover:bg-white/15'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
