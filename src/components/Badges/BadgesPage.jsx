import { useApp } from '../../context/AppContext'
import { ALL_BADGES, RARITY_STYLES } from '../../utils/gameLogic'
import clsx from 'clsx'

export default function BadgesPage() {
  const { state } = useApp()
  const earned = state.badges
  const earnedCount = earned.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold text-white">Achievements</h2>
        <p className="text-gray-400 text-sm">{earnedCount}/{ALL_BADGES.length} badges unlocked</p>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-400 font-display">Collection Progress</span>
          <span className="text-quest-400 font-bold font-display">{earnedCount}/{ALL_BADGES.length}</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div className="shimmer-bar h-full rounded-full transition-all duration-700"
            style={{ width: `${(earnedCount / ALL_BADGES.length) * 100}%` }} />
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_BADGES.map(badge => {
          const isEarned = earned.includes(badge.id)
          const style = RARITY_STYLES[badge.rarity]
          return (
            <div key={badge.id}
              className={clsx('rounded-xl border p-5 transition-all duration-300 relative overflow-hidden',
                style.border, style.bg,
                isEarned ? `shadow-lg ${style.glow}` : 'opacity-40 grayscale',
              )}>
              {isEarned && <div className="absolute top-2 right-2 text-xs font-display font-bold text-quest-400 bg-quest-500/20 px-2 py-0.5 rounded-full border border-quest-500/30">Earned</div>}
              <div className="text-5xl mb-3 block">{badge.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className={clsx('font-display font-bold text-base', style.text)}>{badge.name}</p>
                </div>
                <p className="text-gray-400 text-xs">{badge.desc}</p>
                <span className={clsx('inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-bold capitalize',
                  badge.rarity === 'common' && 'bg-gray-700 text-gray-300',
                  badge.rarity === 'rare' && 'bg-blue-900/50 text-blue-300',
                  badge.rarity === 'epic' && 'bg-purple-900/50 text-purple-300',
                  badge.rarity === 'legendary' && 'bg-orange-900/50 text-orange-300',
                )}>
                  {badge.rarity}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
