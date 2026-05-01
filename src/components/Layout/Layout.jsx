import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { xpProgress, getLevelTitle } from '../../utils/gameLogic'
import { LayoutDashboard, CheckSquare, Trophy, Users, Moon, Sun, LogOut, Menu, X, Flame } from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/badges', icon: Trophy, label: 'Badges' },
  { to: '/leaderboard', icon: Users, label: 'Leaderboard' },
]

export default function Layout({ children }) {
  const { state, actions } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { level, progress, current, needed } = xpProgress(state.totalXP)
  const title = getLevelTitle(level)

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-30 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚔️</span>
            <div>
              <h1 className="font-display text-xl font-bold text-white tracking-widest">QUESTBOARD</h1>
              <p className="text-xs text-gray-500">Task RPG</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl bg-gray-800 rounded-xl p-2">{state.user?.avatar || '🧙'}</div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-white truncate">{state.user?.username}</p>
              <p className="text-xs text-quest-400">Lv.{level} {title}</p>
            </div>
          </div>

          {/* XP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span className="font-display text-xp-400 font-bold">⚡ {state.totalXP} XP</span>
              <span>{current}/{needed} to Lv.{level + 1}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="shimmer-bar h-full rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Streak */}
          {state.streak > 0 && (
            <div className="mt-2 flex items-center gap-1.5 bg-xp-500/10 border border-xp-500/30 rounded-lg px-3 py-1.5 animate-streak-glow">
              <Flame size={14} className="text-orange-400" />
              <span className="text-xs font-display font-bold text-xp-400">{state.streak} Day Streak!</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-display font-semibold transition-all
                ${isActive ? 'bg-quest-500/20 text-quest-400 border border-quest-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-gray-800 flex gap-2">
          <button onClick={actions.toggleDark} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm transition-all">
            {state.darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={actions.logout} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-sm transition-all">
            <LogOut size={16} />
            <span className="font-display text-xs">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-10 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <span className="font-display font-bold text-white">⚔️ QUESTBOARD</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <main className="p-4 lg:p-8 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
