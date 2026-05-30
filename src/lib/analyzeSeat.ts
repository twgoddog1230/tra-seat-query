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
  facesOcean: boolean        // 只有靠窗+靠海才為 true
  oceanName: string          // '太平洋' | '台灣海峽' | ''
  direction: Direction
  primaryLine: LineType
  isCrossLine: boolean
  segments: LineSegment[]    // 跨線時有多段
  carNumber: number
  seatNumber: number
  error?: string
}

// 取得有靠海名稱的路線
function getOceanName(line: LineType): string {
  if (line === 'east') return '太平洋'
  if (line === 'west-coast') return '台灣海峽'
  if (line === 'south-link') return '太平洋'
  return ''
}

// 給定路線+方向，判斷靠海的是奇還是偶
// 東部幹線/南迴線/西部海線：南下時右側（偶號）靠海；北上時左側（單號）靠海
function getOceanParityForLine(
  line: LineType,
  direction: Direction,
  trainType: TrainType,
  carNumber: number
): 'even' | 'odd' | null {
  if (line === 'west-mountain') return null // 山線無靠海

  const southboundSide = getSouthboundOceanSide(trainType, carNumber)
  if (!southboundSide) return null

  if (direction === 'southbound') return southboundSide
  // 北上時翻轉
  return southboundSide === 'even' ? 'odd' : 'even'
}

// 取得某站的所有對應 Station 物件（同名站可能在多條線）
function findStations(name: string): Station[] {
  return STATIONS.filter((s) => s.name === name)
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
  // 東部幹線 → 南迴線（同為太平洋側，視為連續）
  if (
    (fromLines.has('east') && toLines.has('south-link')) ||
    (fromLines.has('south-link') && toLines.has('east'))
  ) {
    return [
      { line: 'east', from: fromName, to: toName, hasOcean: true, oceanName: '太平洋' },
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

    return {
      isWindow: window,
      facesOcean,
      oceanName: facesOcean ? oceanName : '',
      direction,
      primaryLine: sharedLine,
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

  return {
    isWindow: window,
    facesOcean,
    oceanName: facesOcean ? oceanName : '',
    direction,
    primaryLine,
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
    isCrossLine: false,
    segments: [],
    carNumber: 0,
    seatNumber: 0,
    error: msg,
  }
}
