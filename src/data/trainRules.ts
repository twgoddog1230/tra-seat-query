export type TrainType = 'EMU3000' | 'Puyuma' | 'Taroko' | 'PP' | 'Chuguang'

export interface TrainInfo {
  id: TrainType
  label: string
  totalCars: number
}

export const TRAIN_TYPES: TrainInfo[] = [
  { id: 'EMU3000', label: '新自強號（EMU3000）', totalCars: 12 },
  { id: 'Puyuma', label: '普悠瑪號', totalCars: 8 },
  { id: 'Taroko', label: '太魯閣號', totalCars: 8 },
  { id: 'PP', label: '自強號（PP推拉式）', totalCars: 12 },
  { id: 'Chuguang', label: '莒光號', totalCars: 0 }, // 無固定節數
]

// 南下（往台東/高雄）時，哪一側靠海
// 'even' = 雙號靠海；'odd' = 單號靠海
type OceanSide = 'even' | 'odd'

interface CarRule {
  from: number
  to: number
  southbound: OceanSide
}

const RULES: Record<TrainType, CarRule[]> = {
  EMU3000: [
    { from: 1, to: 8, southbound: 'even' },
    { from: 9, to: 12, southbound: 'odd' },
  ],
  Puyuma: [
    { from: 1, to: 4, southbound: 'even' },
    { from: 5, to: 8, southbound: 'odd' },
  ],
  Taroko: [
    { from: 1, to: 4, southbound: 'even' },
    { from: 5, to: 8, southbound: 'odd' },
  ],
  PP: [
    { from: 1, to: 1, southbound: 'odd' },
    { from: 2, to: 6, southbound: 'even' },
    { from: 7, to: 7, southbound: 'odd' },
    { from: 8, to: 11, southbound: 'even' },
    { from: 12, to: 12, southbound: 'odd' },
  ],
  Chuguang: [
    { from: 1, to: 99, southbound: 'odd' },
  ],
}

// 判斷某車廂南下時靠海的奇偶
export function getSouthboundOceanSide(
  trainType: TrainType,
  carNumber: number
): OceanSide | null {
  const rules = RULES[trainType]
  for (const rule of rules) {
    if (carNumber >= rule.from && carNumber <= rule.to) {
      return rule.southbound
    }
  }
  return null
}

// 判斷某座位是靠窗還是靠走道
export function isWindowSeat(seatNumber: number): boolean {
  const r = seatNumber % 4
  return r === 1 || r === 2
}

// 判斷某座位是奇號還是偶號
export function getSeatParity(seatNumber: number): 'odd' | 'even' {
  return seatNumber % 2 === 0 ? 'even' : 'odd'
}
