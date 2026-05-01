import { useApp } from '../../context/AppContext'
import { xpProgress, getLevelTitle, getWeeklyData, XP_VALUES, ALL_BADGES } from '../../utils/gameLogic'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { CheckCircle, Zap, Star, Flame, Trophy, Target } from 'lucide-react'

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="card-glow flex items-center gap-4">
      <div className={`p-3 rounded-xl ${accent}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-xs font-display uppercase tracking-wide">{label}</p>
        <p className="text-white font-display text-2xl font-bold">{value}</p>
        {sub && <p className="text-gray-500 text-xs">{sub}</p>}
      </div>
    </div>
  )
}

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#f9fafb', '#f3f4f6']

export default function Dashboard() {
  const { state } = useApp()
  const { level, progress, current, needed } = xpProgress(state.totalXP)
  const weekData = getWeeklyData(state.completedTasks)
  const earnedBadges = ALL_BADGES.filter(b => state.badges.includes(b.id))
  const totalCompleted = state.completedTasks.length
  const pendingTasks = state.tasks.length
  const hardTasks = state.completedTasks.filter(t => t.priority === 'hard').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-bold text-white">
          Welcome back, <span className="text-quest-400">{state.user?.avatar} {state.user?.username}</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">Your adventure continues. Complete tasks to earn XP!</p>
      </div>

      {/* Level Hero Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-quest-900/30 border border-quest-500/20 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-quest-500/5 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gray-800 border-2 border-quest-500/50 flex items-center justify-center text-4xl">
                {state.user?.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-quest-500 text-white text-xs font-display font-bold px-2 py-0.5 rounded-full">
                Lv.{level}
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-display uppercase tracking-widest">{getLevelTitle(level)}</p>
              <p className="font-display text-3xl font-bold text-white">{state.user?.username}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="xp-badge">⚡ {state.totalXP} XP</span>
                {state.streak > 0 && <span className="xp-badge bg-orange-500/20 text-orange-400 border-orange-500/30">🔥 {state.streak}d</span>}
              </div>
            </div>
          </div>
          <div className="flex-1 md:ml-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400 font-display">Progress to Level {level + 1}</span>
              <span className="text-quest-400 font-bold font-display">{current}/{needed} XP</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div className="shimmer-bar h-full rounded-full transition-all duration-700 relative" style={{ width: `${progress}%` }}>
                <div className="absolute inset-0 bg-white/20 rounded-full" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<CheckCircle size={22} className="text-quest-400" />} label="Completed" value={totalCompleted} sub="all time" accent="bg-quest-500/10" />
        <StatCard icon={<Target size={22} className="text-blue-400" />} label="Pending" value={pendingTasks} sub="tasks remaining" accent="bg-blue-500/10" />
        <StatCard icon={<Flame size={22} className="text-orange-400" />} label="Streak" value={`${state.streak}d`} sub="current streak" accent="bg-orange-500/10" />
        <StatCard icon={<Trophy size={22} className="text-purple-400" />} label="Badges" value={`${earnedBadges.length}/${ALL_BADGES.length}`} sub="earned" accent="bg-purple-500/10" />
      </div>

      {/* Weekly Chart */}
      <div className="card">
        <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-xp-400" />
          Weekly Performance
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'Exo 2' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', fontFamily: 'Exo 2' }}
              labelStyle={{ color: '#e5e7eb' }}
              formatter={(v, n) => [v, n === 'xp' ? 'XP Earned' : 'Tasks Done']}
            />
            <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
              {weekData.map((_, i) => <Cell key={i} fill={`rgba(16,185,129,${0.3 + (i / weekData.length) * 0.7})`} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Badges */}
      {earnedBadges.length > 0 && (
        <div className="card">
          <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Star size={18} className="text-xp-400" />
            Recent Achievements
          </h3>
          <div className="flex flex-wrap gap-3">
            {earnedBadges.slice(-6).map(badge => (
              <div key={badge.id} className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-2 border border-gray-700 animate-badge-pop">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="text-white text-sm font-display font-semibold">{badge.name}</p>
                  <p className="text-gray-400 text-xs">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* XP Breakdown */}
      <div className="card">
        <h3 className="font-display text-lg font-bold text-white mb-4">XP Reward Chart</h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(XP_VALUES).map(([priority, xp]) => (
            <div key={priority} className={`rounded-xl p-4 border text-center priority-${priority}`}>
              <p className="font-display text-2xl font-bold">+{xp}</p>
              <p className="text-xs uppercase tracking-wider mt-1 capitalize">{priority}</p>
              <p className="text-xs opacity-70 mt-1">XP per task</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
