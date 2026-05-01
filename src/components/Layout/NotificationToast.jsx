import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'

export default function NotificationToast() {
  const { state, actions } = useApp()

  useEffect(() => {
    if (!state.notification) return
    const t = setTimeout(actions.clearNotification, 4000)
    return () => clearTimeout(t)
  }, [state.notification])

  if (!state.notification) return null

  const isLevelUp = state.notification.type === 'levelup'
  const isBadge = state.notification.type === 'badge'

  return (
    <div className={`fixed top-6 right-6 z-50 animate-badge-pop max-w-sm
      ${isLevelUp ? 'bg-gradient-to-r from-quest-600 to-emerald-500 text-white' : ''}
      ${isBadge ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-800 text-white'}
      rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3`}>
      <span className="text-3xl">{isLevelUp ? '🎉' : '🏅'}</span>
      <div>
        <p className="font-display font-bold text-base">{isLevelUp ? 'LEVEL UP!' : 'BADGE UNLOCKED!'}</p>
        <p className="text-sm opacity-90">{state.notification.message}</p>
      </div>
      <button onClick={actions.clearNotification} className="ml-auto text-white/70 hover:text-white text-lg leading-none">×</button>
    </div>
  )
}
