'use client'

import { useState } from 'react'
import StationInput from '@/components/StationInput'
import TrainTypeSelector from '@/components/TrainTypeSelector'
import CarSeatInput from '@/components/CarSeatInput'
import ResultCard from '@/components/ResultCard'
import QueryHistory from '@/components/QueryHistory'
import { analyzeSeat, AnalysisResult } from '@/lib/analyzeSeat'
import { TrainType, TRAIN_TYPES } from '@/data/trainRules'
import { useQueryHistory } from '@/hooks/useQueryHistory'

export default function Home() {
  const [fromStation, setFromStation] = useState('')
  const [toStation, setToStation] = useState('')
  const [trainType, setTrainType] = useState<TrainType | ''>('')
  const [carNumber, setCarNumber] = useState('')
  const [seatNumber, setSeatNumber] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const { history, favorites, loaded, addQueryRecord, addFavoriteFromRecord, addFavorite, removeFavorite } = useQueryHistory()

  const maxCar = trainType ? (TRAIN_TYPES.find((t) => t.id === trainType)?.totalCars ?? 0) : 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fromStation || !toStation || !trainType || !carNumber || !seatNumber) return

    const r = analyzeSeat({
      fromStation,
      toStation,
      trainType: trainType as TrainType,
      carNumber: parseInt(carNumber),
      seatNumber: parseInt(seatNumber),
    })
    setResult(r)

    // 記錄查詢歷史
    addQueryRecord(
      fromStation,
      toStation,
      trainType as TrainType,
      parseInt(carNumber),
      parseInt(seatNumber)
    )

    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function handleSelectFavorite(from: string, to: string) {
    setFromStation(from)
    setToStation(to)
    setResult(null)
  }

  function handleSelectHistory(from: string, to: string, train: string, car: number, seat: number) {
    setFromStation(from)
    setToStation(to)
    setTrainType(train as TrainType)
    setCarNumber(String(car))
    setSeatNumber(String(seat))
    setResult(null)
  }

  function handleAddFavoriteFromHistory(fromStation: string, toStation: string) {
    addFavorite(fromStation, toStation)
  }

  function handleSwap() {
    setFromStation(toStation)
    setToStation(fromStation)
    setResult(null)
  }

  const canSubmit = fromStation && toStation && trainType && carNumber && seatNumber

  return (
    <div className="min-h-screen bg-rail-dark flex flex-col">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#0b1d30] to-rail-dark border-b border-rail-gold/20 px-4 py-8">
        <TrainHeaderBg />
        <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center gap-1">
          <p className="text-rail-gold/70 text-xs tracking-[0.3em] uppercase">Taiwan Railways</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">臺鐵座位查詢</h1>
          <p className="text-white/40 text-xs mt-1">輸入車站、車種與座位，即可查詢靠窗或靠海</p>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full flex flex-col gap-6">
        {/* 歷史記錄與最愛 */}
        {loaded && (history.length > 0 || favorites.length > 0) && (
          <QueryHistory
            favorites={favorites}
            history={history}
            onSelectFavorite={handleSelectFavorite}
            onSelectHistory={handleSelectHistory}
            onAddFavoriteFromHistory={(record) =>
              handleAddFavoriteFromHistory(record.fromStation, record.toStation)
            }
            onRemoveFavorite={removeFavorite}
          />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 起訖站 */}
          <div className="relative flex flex-col gap-3">
            <StationInput
              label="起站"
              value={fromStation}
              onChange={(v) => { setFromStation(v); setResult(null) }}
              placeholder="例：台北"
            />
            <button
              type="button"
              onClick={handleSwap}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-rail-gold/20 border border-rail-gold/40 text-rail-gold hover:bg-rail-gold/30 transition text-base font-bold"
              title="交換起訖站"
            >
              ⇅
            </button>
            <StationInput
              label="訖站"
              value={toStation}
              onChange={(v) => { setToStation(v); setResult(null) }}
              placeholder="例：花蓮"
            />
          </div>

          {/* 車種 */}
          <TrainTypeSelector
            value={trainType}
            onChange={(v) => { setTrainType(v); setResult(null) }}
          />

          {/* 車廂 + 座位 */}
          <CarSeatInput
            carNumber={carNumber}
            seatNumber={seatNumber}
            maxCar={maxCar}
            onCarChange={(v) => { setCarNumber(v); setResult(null) }}
            onSeatChange={(v) => { setSeatNumber(v); setResult(null) }}
          />

          {/* 查詢按鈕 */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 rounded-2xl font-bold text-lg tracking-wide transition
              bg-rail-gold text-rail-dark shadow-lg shadow-rail-gold/20
              hover:brightness-110 active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            查詢座位
          </button>
        </form>

        {/* 結果 */}
        {result && (
          <div id="result">
            <ResultCard
              result={result}
              trainType={trainType as TrainType}
              fromStation={fromStation}
              toStation={toStation}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-white/20 text-xs border-t border-white/5">
        資料僅供參考，實際情況以臺鐵公告為準
      </footer>
    </div>
  )
}

function TrainHeaderBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg
        viewBox="0 0 400 80"
        className="absolute bottom-0 left-0 right-0 w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="70" x2="400" y2="70" stroke="#c9a84c" strokeWidth="3" />
        <line x1="0" y1="76" x2="400" y2="76" stroke="#c9a84c" strokeWidth="3" />
        {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
          <rect key={x} x={x} y="67" width="25" height="12" fill="#c9a84c" opacity="0.6" />
        ))}
        <rect x="10" y="42" width="120" height="26" rx="4" fill="#c9a84c" />
        <rect x="14" y="38" width="30" height="8" rx="2" fill="#c9a84c" />
        <rect x="50" y="38" width="30" height="8" rx="2" fill="#c9a84c" />
        <rect x="86" y="38" width="30" height="8" rx="2" fill="#c9a84c" />
        <circle cx="30" cy="70" r="5" fill="#c9a84c" />
        <circle cx="60" cy="70" r="5" fill="#c9a84c" />
        <circle cx="90" cy="70" r="5" fill="#c9a84c" />
        <circle cx="120" cy="70" r="5" fill="#c9a84c" />
      </svg>
    </div>
  )
}
