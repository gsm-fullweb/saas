"use client"

import { AdminGuard } from "@/components/auth/admin-guard"
import { AssignmentManager } from "@/components/admin/assignment-manager"

export default function AtribuicoesPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <AssignmentManager tipo="conversa" />
        </div>
      </div>
    </AdminGuard>
  )
}
