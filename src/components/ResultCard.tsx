'use client'

import { AnalysisResult, Direction } from '@/lib/analyzeSeat'
import { LineType } from '@/data/stations'
import { TrainType, TRAIN_TYPES } from '@/data/trainRules'

interface Props {
  result: AnalysisResult
  trainType: TrainType
  fromStation: string
  toStation: string
}

function directionLabel(d: Direction) {
  return d === 'southbound' ? '南下（往台東／高雄方向）' : '北上（往台北方向）'
}

function lineLabel(l: LineType) {
  switch (l) {
    case 'east': return '東部幹線'
    case 'west-mountain': return '西部山線'
    case 'west-coast': return '西部海線'
    case 'south-link': return '南迴線'
  }
}

export default function ResultCard({ result, trainType, fromStation, toStation }: Props) {
  if (result.error) {
    return (
      <div className="rounded-2xl border border-red-400/40 bg-red-900/20 p-5 text-center text-red-300 text-sm">
        ⚠ {result.error}
      </div>
    )
  }

  const trainLabel = TRAIN_TYPES.find((t) => t.id === trainType)?.label ?? trainType

  return (
    <div className="rounded-2xl border border-rail-gold/40 bg-white/5 overflow-hidden shadow-xl">
      {/* 票頭 */}
      <div className="bg-gradient-to-r from-rail-dark to-[#0d2137] px-5 py-3 flex items-center justify-between border-b border-rail-gold/30">
        <div className="flex items-center gap-2">
          <TrainIcon />
          <span className="text-rail-gold font-bold text-sm tracking-wide">{trainLabel}</span>
        </div>
        <span className="text-white/50 text-xs">
          {fromStation} → {toStation}
        </span>
      </div>

      {/* 主要資訊 */}
      <div className="px-5 py-5 flex flex-col gap-4">
        {/* 路線 + 方向 */}
        <div className="flex flex-wrap gap-2">
          <Chip color="blue">{lineLabel(result.primaryLine)}</Chip>
          <Chip color="slate">{directionLabel(result.direction)}</Chip>
        </div>

        {/* 車廂座位 */}
        <div className="text-white/60 text-sm">
          第 <span className="text-white font-semibold text-lg">{result.carNumber}</span> 車廂・
          第 <span className="text-white font-semibold text-lg">{result.seatNumber}</span> 號座位
        </div>

        {/* 結果標籤 */}
        <div className="flex flex-wrap gap-3 items-center">
          <ResultBadge
            icon={result.isWindow ? '🪟' : '🚶'}
            label={result.isWindow ? '靠窗' : '靠走道'}
            positive={result.isWindow}
          />
          {result.isWindow && (
            <ResultBadge
              icon={result.facesOcean ? '🌊' : '🏔'}
              label={
                result.facesOcean
                  ? `靠海（${result.oceanName}）`
                  : result.primaryLine === 'west-mountain'
                  ? '無特定靠海側'
                  : '靠山側'
              }
              positive={result.facesOcean}
              highlight={result.facesOcean}
            />
          )}
        </div>

        {/* 跨線提示 */}
        {result.isCrossLine && result.segments.length > 1 && (
          <CrossLineNotice segments={result.segments} />
        )}
      </div>

      {/* 票底鋸齒效果 */}
      <TicketEdge />
    </div>
  )
}

function Chip({ children, color }: { children: React.ReactNode; color: 'blue' | 'slate' }) {
  const cls =
    color === 'blue'
      ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
      : 'bg-slate-500/20 text-slate-300 border-slate-400/30'
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cls}`}>
      {children}
    </span>
  )
}

function ResultBadge({
  icon,
  label,
  positive,
  highlight,
}: {
  icon: string
  label: string
  positive: boolean
  highlight?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition ${
        highlight
          ? 'bg-rail-gold/20 border-rail-gold text-rail-gold'
          : positive
          ? 'bg-white/10 border-white/20 text-white'
          : 'bg-white/5 border-white/10 text-white/60'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function CrossLineNotice({
  segments,
}: {
  segments: Array<{ line: LineType; from: string; to: string; hasOcean: boolean; oceanName: string }>
}) {
  return (
    <div className="rounded-xl bg-amber-900/20 border border-amber-400/30 p-3 text-xs text-amber-200 flex flex-col gap-2">
      <p className="font-semibold text-amber-300">⚠ 跨路線旅程</p>
      {segments.map((seg, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-white/60">
            {seg.from} → {seg.to}
          </span>
          <span className="ml-auto">
            {seg.hasOcean ? `可見${seg.oceanName} 🌊` : '無海景'}
          </span>
        </div>
      ))}
    </div>
  )
}

function TrainIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-rail-gold" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8 2 4 3.5 4 7v10a2 2 0 0 0 2 2l-1 1v1h14v-1l-1-1a2 2 0 0 0 2-2V7c0-3.5-4-5-8-5Zm0 2c3.5 0 6 1.1 6 3v1H6V7c0-1.9 2.5-3 6-3ZM6 10h12v6H6v-6Zm1.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
    </svg>
  )
}

function TicketEdge() {
  return (
    <div className="flex items-center px-2 py-1 border-t border-dashed border-rail-gold/20">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="flex-1 h-px bg-rail-gold/10" />
      ))}
    </div>
  )
}
