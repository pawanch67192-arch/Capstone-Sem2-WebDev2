import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout/Layout'
import AuthPage from './components/Auth/AuthPage'
import Dashboard from './components/Dashboard/Dashboard'
import TasksPage from './components/Tasks/TasksPage'
import BadgesPage from './components/Badges/BadgesPage'
import LeaderboardPage from './components/Leaderboard/LeaderboardPage'
import XPFloatLayer from './components/Layout/XPFloatLayer'
import NotificationToast from './components/Layout/NotificationToast'

function AppRoutes() {
  const { state } = useApp()
  if (!state.user) return <AuthPage />
  return (
    <Layout>
      <XPFloatLayer />
      <NotificationToast />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
