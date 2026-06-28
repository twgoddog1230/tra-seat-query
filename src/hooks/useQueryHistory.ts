'use client'

import { useState, useEffect } from 'react'
import { TrainType } from '@/data/trainRules'

export interface QueryRecord {
  id: string
  fromStation: string
  toStation: string
  trainType: TrainType
  carNumber: number
  seatNumber: number
  timestamp: number
}

export interface FavoriteRecord {
  id: string
  fromStation: string
  toStation: string
}

const HISTORY_KEY = 'tra-seat-history'
const FAVORITES_KEY = 'tra-seat-favorites'
const MAX_HISTORY = 6
const MAX_FAVORITES = 6

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function useQueryHistory() {
  const [history, setHistory] = useState<QueryRecord[]>([])
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([])
  const [loaded, setLoaded] = useState(false)

  // 初始化 - 從 localStorage 讀取
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY)
      const savedFavorites = localStorage.getItem(FAVORITES_KEY)
      setHistory(savedHistory ? JSON.parse(savedHistory) : [])
      setFavorites(savedFavorites ? JSON.parse(savedFavorites) : [])
    } catch (e) {
      console.error('Failed to load history:', e)
    }
    setLoaded(true)
  }, [])

  // 新增查詢記錄
  const addQueryRecord = (
    fromStation: string,
    toStation: string,
    trainType: TrainType,
    carNumber: number,
    seatNumber: number
  ) => {
    const newRecord: QueryRecord = {
      id: generateId(),
      fromStation,
      toStation,
      trainType,
      carNumber,
      seatNumber,
      timestamp: Date.now(),
    }
    const updated = [newRecord, ...history].slice(0, MAX_HISTORY)
    setHistory(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
    }
  }

  // 從查詢記錄新增到最愛
  const addFavoriteFromRecord = (record: QueryRecord) => {
    addFavorite(record.fromStation, record.toStation)
  }

  // 新增最愛
  const addFavorite = (fromStation: string, toStation: string) => {
    const exists = favorites.some(
      (f) => f.fromStation === fromStation && f.toStation === toStation
    )
    if (exists) return

    const newFavorite: FavoriteRecord = {
      id: generateId(),
      fromStation,
      toStation,
    }
    const updated = [...favorites, newFavorite].slice(0, MAX_FAVORITES)
    setFavorites(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
    }
  }

  // 移除最愛
  const removeFavorite = (id: string) => {
    const updated = favorites.filter((f) => f.id !== id)
    setFavorites(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
    }
  }

  // 清空所有查詢記錄
  const clearHistory = () => {
    setHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(HISTORY_KEY)
    }
  }

  return {
    history,
    favorites,
    loaded,
    addQueryRecord,
    addFavorite,
    addFavoriteFromRecord,
    removeFavorite,
    clearHistory,
  }
}
