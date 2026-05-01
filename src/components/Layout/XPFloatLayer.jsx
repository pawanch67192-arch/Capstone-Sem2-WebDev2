import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'

export default function XPFloatLayer() {
  const { state, actions } = useApp()

  useEffect(() => {
    state.xpFloats.forEach(f => {
      const timer = setTimeout(() => actions.removeXpFloat(f.id), 1200)
      return () => clearTimeout(timer)
    })
  }, [state.xpFloats])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {state.xpFloats.map(f => (
        <div key={f.id} className="xp-float-text" style={{ left: f.x || '50%', top: f.y || '50%' }}>
          +{f.xp} XP ⚡
        </div>
      ))}
    </div>
  )
}
