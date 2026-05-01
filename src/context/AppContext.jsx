import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { storage, calcLevel, checkNewBadges, XP_VALUES, playXPSound, playLevelUpSound } from '../utils/gameLogic'

const AppContext = createContext(null)

const INITIAL_STATE = {
  user: null,           // { id, username, email, avatar }
  tasks: [],            // task objects
  totalXP: 0,
  streak: 0,
  lastActiveDate: null,
  badges: [],           // earned badge ids
  completedTasks: [],   // completed task history (last 100)
  leaderboard: [],      // mock leaderboard data
  darkMode: true,
  notification: null,   // { type, message } — transient
  xpFloats: [],         // floating XP animations
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE': return { ...state, ...action.payload }

    case 'LOGIN': return {
      ...state,
      user: action.payload,
    }
    case 'LOGOUT': return { ...INITIAL_STATE }

    case 'ADD_TASK': return {
      ...state,
      tasks: [action.payload, ...state.tasks],
    }
    case 'UPDATE_TASK': return {
      ...state,
      tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
    }
    case 'DELETE_TASK': return {
      ...state,
      tasks: state.tasks.filter(t => t.id !== action.payload),
    }
    case 'REORDER_TASKS': return {
      ...state,
      tasks: action.payload,
    }
    case 'COMPLETE_TASK': {
      const task = state.tasks.find(t => t.id === action.payload)
      if (!task) return state
      const xpGain = XP_VALUES[task.priority] || 10
      const newXP = state.totalXP + xpGain
      const oldLevel = calcLevel(state.totalXP)
      const newLevel = calcLevel(newXP)
      const completedTask = { ...task, completed: true, completedAt: new Date().toISOString() }
      const newCompleted = [completedTask, ...state.completedTasks].slice(0, 100)
      
      // Check badges
      const stats = {
        totalCompleted: newCompleted.length,
        totalXP: newXP,
        streak: state.streak,
        hardCompleted: newCompleted.filter(t => t.priority === 'hard').length,
        level: newLevel,
      }
      const newBadges = checkNewBadges(stats, state.badges)

      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
        totalXP: newXP,
        completedTasks: newCompleted,
        badges: [...state.badges, ...newBadges.map(b => b.id)],
        lastActiveDate: new Date().toISOString(),
        notification: newBadges.length
          ? { type: 'badge', message: `New badge: ${newBadges[0].name} ${newBadges[0].icon}`, levelUp: newLevel > oldLevel }
          : newLevel > oldLevel
          ? { type: 'levelup', message: `Level Up! You reached Level ${newLevel}! 🎉` }
          : null,
        xpFloats: [...state.xpFloats, { id: Date.now(), xp: xpGain, x: action.x || 0, y: action.y || 0 }],
      }
    }

    case 'REMOVE_XP_FLOAT': return {
      ...state,
      xpFloats: state.xpFloats.filter(f => f.id !== action.payload),
    }

    case 'UPDATE_STREAK': return {
      ...state,
      streak: action.payload.streak,
      lastActiveDate: new Date().toISOString(),
    }

    case 'CLEAR_NOTIFICATION': return { ...state, notification: null }

    case 'TOGGLE_DARK': return { ...state, darkMode: !state.darkMode }

    case 'UPDATE_LEADERBOARD': return { ...state, leaderboard: action.payload }

    default: return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = storage.get('questboard_state')
    if (saved) dispatch({ type: 'LOAD_STATE', payload: saved })

    // Seed mock leaderboard
    const mockLeaderboard = [
      { id: 'mock1', username: 'DragonSlayer', totalXP: 4200, streak: 15, level: 6, avatar: '🐉' },
      { id: 'mock2', username: 'ShadowHunter', totalXP: 3800, streak: 9,  level: 6, avatar: '🌑' },
      { id: 'mock3', username: 'StarForge',    totalXP: 2900, streak: 22, level: 5, avatar: '⭐' },
      { id: 'mock4', username: 'IronWill',     totalXP: 1500, streak: 5,  level: 4, avatar: '⚙️' },
    ]
    dispatch({ type: 'UPDATE_LEADERBOARD', payload: mockLeaderboard })
  }, [])

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (state.user) {
      storage.set('questboard_state', {
        user: state.user,
        tasks: state.tasks,
        totalXP: state.totalXP,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        badges: state.badges,
        completedTasks: state.completedTasks,
        darkMode: state.darkMode,
      })
    }
  }, [state])

  // Sound effects
  useEffect(() => {
    if (state.xpFloats.length > 0) playXPSound()
  }, [state.xpFloats.length])

  useEffect(() => {
    if (state.notification?.type === 'levelup') playLevelUpSound()
  }, [state.notification])

  // Apply dark mode to html
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode)
  }, [state.darkMode])

  const actions = {
    login: (userData) => dispatch({ type: 'LOGIN', payload: userData }),
    logout: () => { storage.remove('questboard_state'); dispatch({ type: 'LOGOUT' }) },
    addTask: (task) => dispatch({ type: 'ADD_TASK', payload: { ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString(), completed: false } }),
    updateTask: (task) => dispatch({ type: 'UPDATE_TASK', payload: task }),
    deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
    completeTask: (id, e) => dispatch({ type: 'COMPLETE_TASK', payload: id, x: e?.clientX, y: e?.clientY }),
    reorderTasks: (tasks) => dispatch({ type: 'REORDER_TASKS', payload: tasks }),
    clearNotification: () => dispatch({ type: 'CLEAR_NOTIFICATION' }),
    removeXpFloat: (id) => dispatch({ type: 'REMOVE_XP_FLOAT', payload: id }),
    toggleDark: () => dispatch({ type: 'TOGGLE_DARK' }),
    updateStreak: (data) => dispatch({ type: 'UPDATE_STREAK', payload: data }),
  }

  return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
