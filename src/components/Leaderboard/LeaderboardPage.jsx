import { useApp } from '../../context/AppContext'
import { calcLevel, getLevelTitle } from '../../utils/gameLogic'
import { Crown, Flame } from 'lucide-react'

const RANK_STYLES = [
  'from-yellow-500/20 to-yellow-900/20 border-yellow-500/40',
  'from-gray-400/20 to-gray-600/20 border-gray-400/40',
  'from-orange-600/20 to-orange-900/20 border-orange-600/40',
]

export default function LeaderboardPage() {
  const { state } = useApp()

  // Combine real user with mock leaderboard
  const me = state.user ? {
    id: state.user.id,
    username: state.user.username,
    totalXP: state.totalXP,
    streak: state.streak,
    level: calcLevel(state.totalXP),
    avatar: state.user.avatar,
    isMe: true,
  } : null

  const combined = me
    ? [...state.leaderboard.filter(u => u.id !== me.id), me].sort((a, b) => b.totalXP - a.totalXP)
    : state.leaderboard

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold text-white">Leaderboard</h2>
        <p className="text-gray-400 text-sm">Top adventurers ranked by XP</p>
      </div>

      <div className="space-y-3">
        {combined.map((player, i) => {
          const rank = i + 1
          const style = RANK_STYLES[i] || 'from-gray-900 to-gray-900 border-gray-800'
          return (
            <div key={player.id}
              className={`relative rounded-xl border bg-gradient-to-r ${style} p-4 flex items-center gap-4 transition-all
                ${player.isMe ? 'ring-2 ring-quest-500/50' : ''}`}>
              {/* Rank */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg flex-shrink-0
                ${rank === 1 ? 'bg-yellow-500/20 text-yellow-400' : rank === 2 ? 'bg-gray-400/20 text-gray-300' : rank === 3 ? 'bg-orange-600/20 text-orange-400' : 'bg-gray-800 text-gray-500'}`}>
                {rank <= 3 ? <Crown size={20} /> : rank}
              </div>

              {/* Avatar */}
              <div className="text-3xl bg-gray-800/50 rounded-xl p-2 flex-shrink-0">{player.avatar || '🧙'}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display font-bold text-white">{player.username}</p>
                  {player.isMe && <span className="text-xs text-quest-400 font-display bg-quest-500/10 border border-quest-500/20 px-2 py-0.5 rounded-full">You</span>}
                </div>
                <p className="text-xs text-gray-400">Lv.{player.level} {getLevelTitle(player.level)}</p>
              </div>

              {/* Stats */}
              <div className="text-right flex-shrink-0 space-y-1">
                <p className="font-display font-bold text-xp-400">⚡ {player.totalXP} XP</p>
                {player.streak > 0 && (
                  <p className="text-xs text-orange-400 flex items-center gap-1 justify-end">
                    <Flame size={12} /> {player.streak}d streak
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card text-center py-4">
        <p className="text-gray-500 text-sm">🌐 Live leaderboard — complete more tasks to climb the ranks!</p>
      </div>
    </div>
  )
}
