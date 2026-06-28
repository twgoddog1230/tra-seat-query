'use client'

import { QueryRecord, FavoriteRecord } from '@/hooks/useQueryHistory'
import { TRAIN_TYPES } from '@/data/trainRules'

interface Props {
  favorites: FavoriteRecord[]
  history: QueryRecord[]
  onSelectFavorite: (fromStation: string, toStation: string) => void
  onSelectHistory: (
    fromStation: string,
    toStation: string,
    trainType: string,
    carNumber: number,
    seatNumber: number
  ) => void
  onAddFavoriteFromHistory: (record: QueryRecord) => void
  onRemoveFavorite: (id: string) => void
}

export default function QueryHistory({
  favorites,
  history,
  onSelectFavorite,
  onSelectHistory,
  onAddFavoriteFromHistory,
  onRemoveFavorite,
}: Props) {
  return (
    <div className="space-y-4">
      {/* 我的最愛 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-rail-gold text-lg">⭐</span>
          <h3 className="text-white font-semibold text-sm tracking-wide">
            我的最愛 ({favorites.length}/{6})
          </h3>
        </div>
        {favorites.length === 0 ? (
          <div className="text-white/40 text-xs px-3 py-2">
            還沒有最愛。從最近查詢中標星或手動新增。
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {favorites.map((fav) => (
              <button
                key={fav.id}
                onClick={() => onSelectFavorite(fav.fromStation, fav.toStation)}
                className="px-3 py-2 rounded-lg bg-rail-gold/20 border border-rail-gold/40 text-rail-gold text-xs font-medium hover:bg-rail-gold/30 transition flex items-center gap-2 group"
              >
                <span>
                  {fav.fromStation} ↔ {fav.toStation}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveFavorite(fav.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition text-rail-gold/70 hover:text-rail-gold"
                  title="移除最愛"
                >
                  ✕
                </button>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 最近查詢 */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/60 text-lg">🕐</span>
            <h3 className="text-white font-semibold text-sm tracking-wide">
              最近查詢 ({history.length}/{6})
            </h3>
          </div>
          <div className="space-y-1.5">
            {history.map((record) => {
              const trainLabel =
                TRAIN_TYPES.find((t) => t.id === record.trainType)?.label || record.trainType
              return (
                <button
                  key={record.id}
                  onClick={() =>
                    onSelectHistory(
                      record.fromStation,
                      record.toStation,
                      record.trainType,
                      record.carNumber,
                      record.seatNumber
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-xs hover:bg-white/10 hover:border-white/20 transition text-left flex items-center justify-between group"
                >
                  <span>
                    <span className="text-white/60">{record.fromStation}</span>
                    <span className="text-white/40 mx-1">→</span>
                    <span className="text-white">{record.toStation}</span>
                    <span className="text-white/40 mx-1.5">|</span>
                    <span className="text-white/70">{trainLabel}</span>
                    <span className="text-white/40 mx-1.5">|</span>
                    <span className="text-white/60">
                      {record.carNumber}車 {record.seatNumber}號
                    </span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddFavoriteFromHistory(record)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition text-white/40 hover:text-rail-gold"
                    title="加入最愛"
                  >
                    ⭐
                  </button>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
