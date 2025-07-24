"use client"

import type React from "react"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./lib/auth"
import { Sidebar } from "./components/layout/sidebar"
import { LoginPage } from "./pages/login"
import { DashboardPage } from "./pages/dashboard"
import { ConversasPage } from "./pages/conversas"
import { ConversaDetalhesPage } from "./pages/conversa-detalhes"
import { AgentesPage } from "./pages/agentes"
import { ContatosPage } from "./pages/contatos"
import "./globals.css"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AppContent() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Sidebar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversas"
          element={
            <ProtectedRoute>
              <ConversasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversas/:id"
          element={
            <ProtectedRoute>
              <ConversaDetalhesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agentes"
          element={
            <ProtectedRoute>
              <AgentesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contatos"
          element={
            <ProtectedRoute>
              <ContatosPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
