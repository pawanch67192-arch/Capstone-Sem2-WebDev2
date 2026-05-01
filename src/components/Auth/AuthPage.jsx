import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { storage } from '../../utils/gameLogic'

const AVATARS = ['🧙', '⚔️', '🛡️', '🏹', '🔮', '🐉', '🌟', '⚡']

export default function AuthPage() {
  const { actions } = useApp()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({ username: '', email: '', password: '', avatar: '🧙' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'signup') {
      if (!form.username.trim() || form.username.length < 3) return setError('Username must be at least 3 characters.')
      if (!form.email.includes('@')) return setError('Enter a valid email.')
      if (form.password.length < 6) return setError('Password must be 6+ characters.')
      const users = storage.get('questboard_users', [])
      if (users.find(u => u.email === form.email)) return setError('Email already registered.')
      const newUser = { id: crypto.randomUUID(), username: form.username, email: form.email, password: form.password, avatar: form.avatar }
      storage.set('questboard_users', [...users, newUser])
      actions.login({ id: newUser.id, username: newUser.username, email: newUser.email, avatar: newUser.avatar })
    } else {
      const users = storage.get('questboard_users', [])
      const user = users.find(u => u.email === form.email && u.password === form.password)
      if (!user) return setError('Invalid email or password.')
      actions.login({ id: user.id, username: user.username, email: user.email, avatar: user.avatar })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-quest-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">⚔️</div>
          <h1 className="font-display text-4xl font-bold text-white tracking-wider">QUESTBOARD</h1>
          <p className="text-gray-400 text-sm mt-1 font-body">Level up your productivity</p>
        </div>

        <div className="card border-gray-700/50 shadow-2xl">
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-800 p-1 mb-6">
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 rounded-md text-sm font-display font-semibold transition-all ${mode === m ? 'bg-quest-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                {m === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 font-display tracking-wide uppercase mb-1 block">Username</label>
                  <input className="input" placeholder="Your hero name..." value={form.username}
                    onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-display tracking-wide uppercase mb-1 block">Choose Avatar</label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATARS.map(av => (
                      <button key={av} type="button" onClick={() => setForm(p => ({ ...p, avatar: av }))}
                        className={`text-2xl p-2 rounded-lg border-2 transition-all ${form.avatar === av ? 'border-quest-500 bg-quest-500/10' : 'border-gray-700 hover:border-gray-500'}`}>
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs text-gray-400 font-display tracking-wide uppercase mb-1 block">Email</label>
              <input className="input" type="email" placeholder="hero@questboard.io" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-display tracking-wide uppercase mb-1 block">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>

            {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" className="btn-primary w-full py-3 text-base mt-2">
              {mode === 'login' ? '⚔️ Enter the Quest' : '🌟 Begin Your Journey'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-xs text-gray-500 mt-4">
              Demo: Create an account first via Sign Up
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
