import { STATIONS, LineType, Station } from '@/data/stations'
import {
  TrainType,
  getSouthboundOceanSide,
  isWindowSeat,
  getSeatParity,
} from '@/data/trainRules'

export type Direction = 'southbound' | 'northbound'

export interface LineSegment {
  line: LineType
  from: string
  to: string
  hasOcean: boolean
  oceanName: string
}

export interface AnalysisResult {
  isWindow: boolean
  facesOcean: boolean
  oceanName: string
  direction: Direction
  primaryLine: LineType
  routeLabel: string          // 如「南迴線（往台東方向）」「北迴線（往花蓮方向）」
  isCrossLine: boolean
  segments: LineSegment[]
  carNumber: number
  seatNumber: number
  error?: string
}

const HUALIEN_SEQ = 41 // 花蓮在東部幹線的序號

function computeRouteLabel(
  line: LineType,
  direction: Direction,
  fromSeq: number,
  toSeq: number
): string {
  if (line === 'south-link') {
    return direction === 'northbound'
      ? '南迴線（往台東方向）'
      : '南迴線（往枋寮方向）'
  }
  if (line === 'east') {
    const minSeq = Math.min(fromSeq, toSeq)
    const maxSeq = Math.max(fromSeq, toSeq)
    if (maxSeq <= HUALIEN_SEQ) {
      return direction === 'southbound' ? '北迴線（往花蓮方向）' : '北迴線（往台北方向）'
    }
    if (minSeq >= HUALIEN_SEQ) {
      return direction === 'southbound' ? '花東線（往台東方向）' : '花東線（往花蓮方向）'
    }
    return direction === 'southbound' ? '南下（往台東方向）' : '北上（往台北方向）'
  }
  if (line === 'west-coast') {
    return direction === 'southbound' ? '海線（往彰化方向）' : '海線（往竹南方向）'
  }
  return direction === 'southbound' ? '南下（往高雄方向）' : '北上（往台北方向）'
}

// 取得有靠海名稱的路線
function getOceanName(line: LineType): string {
  if (line === 'east') return '太平洋'
  if (line === 'west-coast') return '台灣海峽'
  if (line === 'south-link') return '太平洋'
  return ''
}

// 靠海座位由座位在車廂中的物理位置決定，與行駛方向無關
function getOceanParityForLine(
  line: LineType,
  _direction: Direction,
  trainType: TrainType,
  carNumber: number
): 'even' | 'odd' | null {
  if (line === 'west-mountain') return null
  return getSouthboundOceanSide(trainType, carNumber)
}

function normalize(str: string): string {
  return str.replace(/臺/g, '台')
}

// 取得某站的所有對應 Station 物件（同名站可能在多條線）
function findStations(name: string): Station[] {
  const n = normalize(name)
  return STATIONS.filter((s) => normalize(s.name) === n)
}

// 判斷兩站是否在同一條線，並回傳共同線別
function commonLine(
  fromStations: Station[],
  toStations: Station[]
): LineType | null {
  for (const f of fromStations) {
    for (const t of toStations) {
      if (f.line === t.line) return f.line
    }
  }
  return null
}

// 跨線旅程的區段分割
// 目前支援：西部 → 東部（經台北）、東部 → 南迴
function buildCrossLineSegments(
  fromName: string,
  toName: string,
  fromStations: Station[],
  toStations: Station[]
): LineSegment[] | null {
  const fromLines = new Set(fromStations.map((s) => s.line))
  const toLines = new Set(toStations.map((s) => s.line))

  // 西部山線 → 東部幹線（分段：山線到台北、台北到終點）
  if (fromLines.has('west-mountain') && toLines.has('east')) {
    return [
      { line: 'west-mountain', from: fromName, to: '台北', hasOcean: false, oceanName: '' },
      { line: 'east', from: '台北', to: toName, hasOcean: true, oceanName: '太平洋' },
    ]
  }
  if (fromLines.has('east') && toLines.has('west-mountain')) {
    return [
      { line: 'east', from: fromName, to: '台北', hasOcean: true, oceanName: '太平洋' },
      { line: 'west-mountain', from: '台北', to: toName, hasOcean: false, oceanName: '' },
    ]
  }
  // 東部幹線 → 南迴線（兩段：東部到台東 + 南迴台東到終點）
  if (fromLines.has('east') && !fromLines.has('south-link') && toLines.has('south-link')) {
    return [
      { line: 'east', from: fromName, to: '台東', hasOcean: true, oceanName: '太平洋' },
      { line: 'south-link', from: '台東', to: toName, hasOcean: true, oceanName: '太平洋' },
    ]
  }
  // 南迴線 → 東部幹線（兩段：南迴到台東 + 東部台東到終點）
  if (fromLines.has('south-link') && !toLines.has('south-link') && toLines.has('east')) {
    return [
      { line: 'south-link', from: fromName, to: '台東', hasOcean: true, oceanName: '太平洋' },
      { line: 'east', from: '台東', to: toName, hasOcean: true, oceanName: '太平洋' },
    ]
  }
  return null
}

export function analyzeSeat(params: {
  fromStation: string
  toStation: string
  trainType: TrainType
  carNumber: number
  seatNumber: number
}): AnalysisResult {
  const { fromStation, toStation, trainType, carNumber, seatNumber } = params

  const fromList = findStations(fromStation)
  const toList = findStations(toStation)

  if (fromList.length === 0) {
    return makeError(`找不到車站「${fromStation}」`)
  }
  if (toList.length === 0) {
    return makeError(`找不到車站「${toStation}」`)
  }
  if (fromStation === toStation) {
    return makeError('起站與訖站相同')
  }

  const sharedLine = commonLine(fromList, toList)

  // ── 同線旅程 ──────────────────────────────────────
  if (sharedLine) {
    const fromSeq = fromList.find((s) => s.line === sharedLine)!.seq
    const toSeq = toList.find((s) => s.line === sharedLine)!.seq
    const direction: Direction = toSeq > fromSeq ? 'southbound' : 'northbound'
    const oceanName = getOceanName(sharedLine)
    const window = isWindowSeat(seatNumber)
    const parity = getSeatParity(seatNumber)
    const oceanParity = getOceanParityForLine(sharedLine, direction, trainType, carNumber)
    const facesOcean = window && !!oceanParity && parity === oceanParity

    const routeLabel = computeRouteLabel(sharedLine, direction, fromSeq, toSeq)
    return {
      isWindow: window,
      facesOcean,
      oceanName: facesOcean ? oceanName : '',
      direction,
      primaryLine: sharedLine,
      routeLabel,
      isCrossLine: false,
      segments: [
        {
          line: sharedLine,
          from: fromStation,
          to: toStation,
          hasOcean: !!oceanName,
          oceanName,
        },
      ],
      carNumber,
      seatNumber,
    }
  }

  // ── 跨線旅程 ──────────────────────────────────────
  const crossSegments = buildCrossLineSegments(fromStation, toStation, fromList, toList)
  if (!crossSegments) {
    return makeError('無法判斷行駛路線，請確認起訖站')
  }

  // 以主要乘車路段（里程較長的那段）決定分析方向
  // 簡化：以最後一段為主（通常是目的地所在線）
  const primarySeg = crossSegments[crossSegments.length - 1]
  const primaryLine = primarySeg.line

  // 方向：由起站→訖站，從第一段判斷
  const firstSegFrom = findStations(crossSegments[0].from)
  const firstSegTo = findStations(crossSegments[0].to)
  const commonFirst = commonLine(firstSegFrom, firstSegTo) ?? crossSegments[0].line
  const fromSeqFirst = firstSegFrom.find((s) => s.line === commonFirst)?.seq ?? 0
  const toSeqFirst = firstSegTo.find((s) => s.line === commonFirst)?.seq ?? 1
  const direction: Direction = toSeqFirst > fromSeqFirst ? 'southbound' : 'northbound'

  const window = isWindowSeat(seatNumber)
  const parity = getSeatParity(seatNumber)
  const oceanParity = getOceanParityForLine(primaryLine, direction, trainType, carNumber)
  const facesOcean = window && !!oceanParity && parity === oceanParity
  const oceanName = getOceanName(primaryLine)

  const primaryFromSeq = findStations(primarySeg.from).find((s) => s.line === primaryLine)?.seq ?? 0
  const primaryToSeq = findStations(primarySeg.to).find((s) => s.line === primaryLine)?.seq ?? 1
  const routeLabel = computeRouteLabel(primaryLine, direction, primaryFromSeq, primaryToSeq)

  return {
    isWindow: window,
    facesOcean,
    oceanName: facesOcean ? oceanName : '',
    direction,
    primaryLine,
    routeLabel,
    isCrossLine: true,
    segments: crossSegments,
    carNumber,
    seatNumber,
  }
}

function makeError(msg: string): AnalysisResult {
  return {
    isWindow: false,
    facesOcean: false,
    oceanName: '',
    direction: 'southbound',
    primaryLine: 'east',
    routeLabel: '',
    isCrossLine: false,
    segments: [],
    carNumber: 0,
    seatNumber: 0,
    error: msg,
  }
}
