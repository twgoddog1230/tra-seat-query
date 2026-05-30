export type LineType = 'east' | 'west-mountain' | 'west-coast' | 'south-link'

export interface Station {
  name: string
  line: LineType
  seq: number // 越大越南（往台東/高雄方向）
}

// 東部幹線：北迴線 + 花東線（seq 0–100）
// 西部幹線山線（seq 0–100）
// 西部幹線海線（seq 20–65，銜接山線的竹南~彰化段）
// 南迴線（seq 100–130，台東往枋寮）

export const STATIONS: Station[] = [
  // ── 東部幹線 ──────────────────────────────────────
  { name: '台北', line: 'east', seq: 0 },
  { name: '松山', line: 'east', seq: 1 },
  { name: '南港', line: 'east', seq: 2 },
  { name: '汐止', line: 'east', seq: 3 },
  { name: '汐科', line: 'east', seq: 4 },
  { name: '七堵', line: 'east', seq: 5 },
  { name: '百福', line: 'east', seq: 6 },
  { name: '五堵', line: 'east', seq: 7 },
  { name: '暖暖', line: 'east', seq: 8 },
  { name: '四腳亭', line: 'east', seq: 9 },
  { name: '瑞芳', line: 'east', seq: 10 },
  { name: '猴硐', line: 'east', seq: 11 },
  { name: '三貂嶺', line: 'east', seq: 12 },
  { name: '牡丹', line: 'east', seq: 13 },
  { name: '雙溪', line: 'east', seq: 14 },
  { name: '貢寮', line: 'east', seq: 15 },
  { name: '福隆', line: 'east', seq: 16 },
  { name: '石城', line: 'east', seq: 17 },
  { name: '大里', line: 'east', seq: 18 },
  { name: '大溪', line: 'east', seq: 19 },
  { name: '龜山', line: 'east', seq: 20 },
  { name: '外澳', line: 'east', seq: 21 },
  { name: '頭城', line: 'east', seq: 22 },
  { name: '礁溪', line: 'east', seq: 23 },
  { name: '四城', line: 'east', seq: 24 },
  { name: '宜蘭', line: 'east', seq: 25 },
  { name: '二結', line: 'east', seq: 26 },
  { name: '中里', line: 'east', seq: 27 },
  { name: '羅東', line: 'east', seq: 28 },
  { name: '冬山', line: 'east', seq: 29 },
  { name: '新馬', line: 'east', seq: 30 },
  { name: '蘇澳', line: 'east', seq: 31 },
  { name: '蘇澳新站', line: 'east', seq: 32 },
  { name: '東澳', line: 'east', seq: 33 },
  { name: '南澳', line: 'east', seq: 34 },
  { name: '武塔', line: 'east', seq: 35 },
  { name: '漢本', line: 'east', seq: 36 },
  { name: '和仁', line: 'east', seq: 37 },
  { name: '和平', line: 'east', seq: 38 },
  { name: '崇德', line: 'east', seq: 39 },
  { name: '新城', line: 'east', seq: 40 },
  { name: '花蓮', line: 'east', seq: 41 },
  { name: '吉安', line: 'east', seq: 42 },
  { name: '志學', line: 'east', seq: 43 },
  { name: '平和', line: 'east', seq: 44 },
  { name: '壽豐', line: 'east', seq: 45 },
  { name: '豐田', line: 'east', seq: 46 },
  { name: '林榮新光', line: 'east', seq: 47 },
  { name: '南平', line: 'east', seq: 48 },
  { name: '光復', line: 'east', seq: 49 },
  { name: '萬榮', line: 'east', seq: 50 },
  { name: '鳳林', line: 'east', seq: 51 },
  { name: '北林', line: 'east', seq: 52 },
  { name: '瑞穗', line: 'east', seq: 53 },
  { name: '三民', line: 'east', seq: 54 },
  { name: '玉里', line: 'east', seq: 55 },
  { name: '東里', line: 'east', seq: 56 },
  { name: '東竹', line: 'east', seq: 57 },
  { name: '富里', line: 'east', seq: 58 },
  { name: '池上', line: 'east', seq: 59 },
  { name: '海端', line: 'east', seq: 60 },
  { name: '關山', line: 'east', seq: 61 },
  { name: '瑞和', line: 'east', seq: 62 },
  { name: '瑞源', line: 'east', seq: 63 },
  { name: '鹿野', line: 'east', seq: 64 },
  { name: '山里', line: 'east', seq: 65 },
  { name: '台東', line: 'east', seq: 66 },

  // ── 南迴線（接台東往枋寮，視為east延伸）─────────────
  { name: '康樂', line: 'south-link', seq: 67 },
  { name: '知本', line: 'south-link', seq: 68 },
  { name: '太麻里', line: 'south-link', seq: 69 },
  { name: '金崙', line: 'south-link', seq: 70 },
  { name: '瀧溪', line: 'south-link', seq: 71 },
  { name: '大武', line: 'south-link', seq: 72 },
  { name: '古莊', line: 'south-link', seq: 73 },
  { name: '枋山', line: 'south-link', seq: 74 },
  { name: '枋寮', line: 'south-link', seq: 75 },

  // ── 西部幹線山線（seq 0–100）──────────────────────
  { name: '基隆', line: 'west-mountain', seq: 0 },
  { name: '三坑', line: 'west-mountain', seq: 1 },
  { name: '八堵', line: 'west-mountain', seq: 2 },
  { name: '七堵', line: 'west-mountain', seq: 3 },
  { name: '百福', line: 'west-mountain', seq: 4 },
  { name: '五堵', line: 'west-mountain', seq: 5 },
  { name: '暖暖', line: 'west-mountain', seq: 6 },
  { name: '四腳亭', line: 'west-mountain', seq: 7 },
  { name: '瑞芳', line: 'west-mountain', seq: 8 },
  { name: '台北', line: 'west-mountain', seq: 9 },
  { name: '桃園', line: 'west-mountain', seq: 10 },
  { name: '內壢', line: 'west-mountain', seq: 11 },
  { name: '中壢', line: 'west-mountain', seq: 12 },
  { name: '埔心', line: 'west-mountain', seq: 13 },
  { name: '楊梅', line: 'west-mountain', seq: 14 },
  { name: '富岡', line: 'west-mountain', seq: 15 },
  { name: '新富', line: 'west-mountain', seq: 16 },
  { name: '北湖', line: 'west-mountain', seq: 17 },
  { name: '湖口', line: 'west-mountain', seq: 18 },
  { name: '新豐', line: 'west-mountain', seq: 19 },
  { name: '竹北', line: 'west-mountain', seq: 20 },
  { name: '新竹', line: 'west-mountain', seq: 21 },
  { name: '北新竹', line: 'west-mountain', seq: 22 },
  { name: '千甲', line: 'west-mountain', seq: 23 },
  { name: '竹中', line: 'west-mountain', seq: 24 },
  { name: '關西新', line: 'west-mountain', seq: 25 },
  { name: '六家', line: 'west-mountain', seq: 26 },
  { name: '竹東', line: 'west-mountain', seq: 27 },
  { name: '九讚頭', line: 'west-mountain', seq: 28 },
  { name: '竹南', line: 'west-mountain', seq: 30 }, // 山線海線分歧點
  { name: '造橋', line: 'west-mountain', seq: 31 },
  { name: '豐富', line: 'west-mountain', seq: 32 },
  { name: '苗栗', line: 'west-mountain', seq: 33 },
  { name: '南勢', line: 'west-mountain', seq: 34 },
  { name: '銅鑼', line: 'west-mountain', seq: 35 },
  { name: '三義', line: 'west-mountain', seq: 36 },
  { name: '泰安', line: 'west-mountain', seq: 37 },
  { name: '后里', line: 'west-mountain', seq: 38 },
  { name: '豐原', line: 'west-mountain', seq: 39 },
  { name: '栗林', line: 'west-mountain', seq: 40 },
  { name: '潭子', line: 'west-mountain', seq: 41 },
  { name: '頭家厝', line: 'west-mountain', seq: 42 },
  { name: '松竹', line: 'west-mountain', seq: 43 },
  { name: '太原', line: 'west-mountain', seq: 44 },
  { name: '精武', line: 'west-mountain', seq: 45 },
  { name: '台中', line: 'west-mountain', seq: 46 },
  { name: '五權', line: 'west-mountain', seq: 47 },
  { name: '大慶', line: 'west-mountain', seq: 48 },
  { name: '烏日', line: 'west-mountain', seq: 49 },
  { name: '新烏日', line: 'west-mountain', seq: 50 },
  { name: '彰化', line: 'west-mountain', seq: 51 }, // 山線海線匯合點
  { name: '花壇', line: 'west-mountain', seq: 52 },
  { name: '大村', line: 'west-mountain', seq: 53 },
  { name: '員林', line: 'west-mountain', seq: 54 },
  { name: '永靖', line: 'west-mountain', seq: 55 },
  { name: '社頭', line: 'west-mountain', seq: 56 },
  { name: '田中', line: 'west-mountain', seq: 57 },
  { name: '二水', line: 'west-mountain', seq: 58 },
  { name: '林內', line: 'west-mountain', seq: 59 },
  { name: '石榴', line: 'west-mountain', seq: 60 },
  { name: '斗六', line: 'west-mountain', seq: 61 },
  { name: '斗南', line: 'west-mountain', seq: 62 },
  { name: '石龜', line: 'west-mountain', seq: 63 },
  { name: '大林', line: 'west-mountain', seq: 64 },
  { name: '民雄', line: 'west-mountain', seq: 65 },
  { name: '嘉北', line: 'west-mountain', seq: 66 },
  { name: '嘉義', line: 'west-mountain', seq: 67 },
  { name: '水上', line: 'west-mountain', seq: 68 },
  { name: '南靖', line: 'west-mountain', seq: 69 },
  { name: '後壁', line: 'west-mountain', seq: 70 },
  { name: '新營', line: 'west-mountain', seq: 71 },
  { name: '柳營', line: 'west-mountain', seq: 72 },
  { name: '林鳳營', line: 'west-mountain', seq: 73 },
  { name: '隆田', line: 'west-mountain', seq: 74 },
  { name: '拔林', line: 'west-mountain', seq: 75 },
  { name: '善化', line: 'west-mountain', seq: 76 },
  { name: '南科', line: 'west-mountain', seq: 77 },
  { name: '新市', line: 'west-mountain', seq: 78 },
  { name: '永康', line: 'west-mountain', seq: 79 },
  { name: '台南', line: 'west-mountain', seq: 80 },
  { name: '保安', line: 'west-mountain', seq: 81 },
  { name: '仁德', line: 'west-mountain', seq: 82 },
  { name: '中洲', line: 'west-mountain', seq: 83 },
  { name: '大湖', line: 'west-mountain', seq: 84 },
  { name: '路竹', line: 'west-mountain', seq: 85 },
  { name: '岡山', line: 'west-mountain', seq: 86 },
  { name: '橋頭', line: 'west-mountain', seq: 87 },
  { name: '楠梓', line: 'west-mountain', seq: 88 },
  { name: '新左營', line: 'west-mountain', seq: 89 },
  { name: '左營', line: 'west-mountain', seq: 90 },
  { name: '高雄', line: 'west-mountain', seq: 91 },
  { name: '鳳山', line: 'west-mountain', seq: 92 },
  { name: '後庄', line: 'west-mountain', seq: 93 },
  { name: '九曲堂', line: 'west-mountain', seq: 94 },
  { name: '六塊厝', line: 'west-mountain', seq: 95 },
  { name: '屏東', line: 'west-mountain', seq: 96 },
  { name: '歸來', line: 'west-mountain', seq: 97 },
  { name: '麟洛', line: 'west-mountain', seq: 98 },
  { name: '西勢', line: 'west-mountain', seq: 99 },
  { name: '竹田', line: 'west-mountain', seq: 100 },

  // ── 西部幹線海線（竹南～彰化）─────────────────────
  { name: '談文', line: 'west-coast', seq: 31 },
  { name: '大山', line: 'west-coast', seq: 32 },
  { name: '後龍', line: 'west-coast', seq: 33 },
  { name: '龍港', line: 'west-coast', seq: 34 },
  { name: '福興', line: 'west-coast', seq: 35 },
  { name: '日南', line: 'west-coast', seq: 36 },
  { name: '大甲', line: 'west-coast', seq: 37 },
  { name: '台中港', line: 'west-coast', seq: 38 },
  { name: '清水', line: 'west-coast', seq: 39 },
  { name: '沙鹿', line: 'west-coast', seq: 40 },
  { name: '龍井', line: 'west-coast', seq: 41 },
  { name: '大肚', line: 'west-coast', seq: 42 },
  { name: '追分', line: 'west-coast', seq: 43 },
]

// 台北同時在東部/西部，用 getStationByName 搜尋時以第一筆為準
// 跨線旅程由 detectLine 另行處理

export function getStationByName(name: string): Station | undefined {
  return STATIONS.find((s) => s.name === name)
}

function normalize(str: string): string {
  return str.replace(/臺/g, '台')
}

export function searchStations(query: string): Station[] {
  if (!query) return []
  const q = normalize(query)
  return STATIONS.filter((s) => normalize(s.name).includes(q)).slice(0, 10)
}

// 同名站（台北在東西線都存在），回傳全部
export function getAllByName(name: string): Station[] {
  return STATIONS.filter((s) => s.name === name)
}

export function getStationByNameNormalized(name: string): Station | undefined {
  const n = normalize(name)
  return STATIONS.find((s) => normalize(s.name) === n)
}
