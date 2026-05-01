// ─── XP & Leveling ───────────────────────────────────────────────────────────
export const XP_VALUES = { easy: 10, medium: 20, hard: 50 }

export function xpForLevel(level) {
  // Formula: XP = level^2 * 100
  return level * level * 100
}

export function calcLevel(totalXP) {
  let level = 1
  while (totalXP >= xpForLevel(level + 1)) level++
  return level
}

export function xpProgress(totalXP) {
  const level = calcLevel(totalXP)
  const currentFloor = xpForLevel(level)
  const nextCeil = xpForLevel(level + 1)
  const progress = ((totalXP - currentFloor) / (nextCeil - currentFloor)) * 100
  return { level, progress: Math.min(progress, 100), current: totalXP - currentFloor, needed: nextCeil - currentFloor }
}

export const LEVEL_TITLES = [
  '', 'Novice', 'Apprentice', 'Journeyman', 'Adept', 'Expert',
  'Master', 'Grandmaster', 'Champion', 'Legend', 'Mythic'
]
export function getLevelTitle(level) {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)] || 'Mythic'
}

// ─── Streaks ─────────────────────────────────────────────────────────────────
export function calcStreak(lastActiveDate, currentStreak) {
  if (!lastActiveDate) return { streak: 1, reset: false }
  const last = new Date(lastActiveDate)
  const now = new Date()
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return { streak: currentStreak, reset: false }
  if (diffDays === 1) return { streak: currentStreak + 1, reset: false }
  return { streak: 0, reset: true } // missed a day
}

// ─── Badges ──────────────────────────────────────────────────────────────────
export const ALL_BADGES = [
  {
    id: 'first_task',
    name: 'First Quest',
    desc: 'Complete your first task',
    icon: '⚔️',
    rarity: 'common',
    check: (stats) => stats.totalCompleted >= 1,
  },
  {
    id: 'tasks_10',
    name: 'Adventurer',
    desc: 'Complete 10 tasks',
    icon: '🗺️',
    rarity: 'common',
    check: (stats) => stats.totalCompleted >= 10,
  },
  {
    id: 'tasks_50',
    name: 'Veteran',
    desc: 'Complete 50 tasks',
    icon: '🛡️',
    rarity: 'rare',
    check: (stats) => stats.totalCompleted >= 50,
  },
  {
    id: 'tasks_100',
    name: 'Centurion',
    desc: 'Complete 100 tasks',
    icon: '👑',
    rarity: 'epic',
    check: (stats) => stats.totalCompleted >= 100,
  },
  {
    id: 'streak_3',
    name: 'On Fire',
    desc: '3-day streak',
    icon: '🔥',
    rarity: 'common',
    check: (stats) => stats.streak >= 3,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    desc: '7-day streak',
    icon: '💎',
    rarity: 'rare',
    check: (stats) => stats.streak >= 7,
  },
  {
    id: 'streak_30',
    name: 'Unstoppable',
    desc: '30-day streak',
    icon: '🌟',
    rarity: 'legendary',
    check: (stats) => stats.streak >= 30,
  },
  {
    id: 'hard_task',
    name: 'Daredevil',
    desc: 'Complete a hard task',
    icon: '💀',
    rarity: 'rare',
    check: (stats) => stats.hardCompleted >= 1,
  },
  {
    id: 'level_5',
    name: 'Expert',
    desc: 'Reach level 5',
    icon: '🏆',
    rarity: 'epic',
    check: (stats) => stats.level >= 5,
  },
  {
    id: 'xp_500',
    name: 'XP Grinder',
    desc: 'Earn 500 total XP',
    icon: '⚡',
    rarity: 'rare',
    check: (stats) => stats.totalXP >= 500,
  },
]

export const RARITY_STYLES = {
  common:    { border: 'border-gray-600', bg: 'bg-gray-800',        text: 'text-gray-300',   glow: '' },
  rare:      { border: 'border-blue-500', bg: 'bg-blue-950',        text: 'text-blue-300',   glow: 'shadow-blue-500/30' },
  epic:      { border: 'border-purple-500', bg: 'bg-purple-950',    text: 'text-purple-300', glow: 'shadow-purple-500/40' },
  legendary: { border: 'border-orange-500', bg: 'bg-orange-950',    text: 'text-orange-300', glow: 'shadow-orange-500/50' },
}

export function checkNewBadges(stats, earnedBadgeIds) {
  return ALL_BADGES.filter(b => !earnedBadgeIds.includes(b.id) && b.check(stats))
}

// ─── Sound Effects (Web Audio API) ───────────────────────────────────────────
export function playXPSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(523, ctx.currentTime)
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start(); osc.stop(ctx.currentTime + 0.5)
  } catch {}
}

export function playLevelUpSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.3)
    })
  } catch {}
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────
export function isOverdue(dueDate) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

export function formatDueDate(dueDate) {
  if (!dueDate) return null
  const d = new Date(dueDate)
  const now = new Date()
  const diffMs = d - now
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  return `Due in ${diffDays}d`
}

// ─── Weekly Stats ─────────────────────────────────────────────────────────────
export function getWeeklyData(completedTasks) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const data = days.map(day => ({ day, tasks: 0, xp: 0 }))
  const now = new Date()
  completedTasks.forEach(task => {
    if (!task.completedAt) return
    const d = new Date(task.completedAt)
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    if (diffDays <= 6) {
      const idx = d.getDay()
      data[idx].tasks += 1
      data[idx].xp += XP_VALUES[task.priority] || 0
    }
  })
  return data
}

// ─── Local Storage helpers ────────────────────────────────────────────────────
export const storage = {
  get: (key, fallback = null) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
  },
  set: (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
  },
  remove: (key) => { try { localStorage.removeItem(key) } catch {} },
}
