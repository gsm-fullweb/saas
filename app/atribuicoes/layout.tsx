"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function AtribuicoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
