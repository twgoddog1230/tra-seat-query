'use client'

interface Props {
  carNumber: string
  seatNumber: string
  maxCar: number
  onCarChange: (v: string) => void
  onSeatChange: (v: string) => void
}

export default function CarSeatInput({
  carNumber,
  seatNumber,
  maxCar,
  onCarChange,
  onSeatChange,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-rail-gold tracking-wider uppercase">
          車廂號
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rail-gold text-sm">
            🚃
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={maxCar || 99}
            value={carNumber}
            onChange={(e) => onCarChange(e.target.value)}
            placeholder={`1–${maxCar || '?'}`}
            className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-rail-gold transition text-base"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-rail-gold tracking-wider uppercase">
          座位號
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rail-gold text-sm">
            💺
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={seatNumber}
            onChange={(e) => onSeatChange(e.target.value)}
            placeholder="如：15"
            className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-rail-gold transition text-base"
          />
        </div>
      </div>
    </div>
  )
}
