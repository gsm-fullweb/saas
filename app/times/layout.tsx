import type React from "react"
import { AdminGuard } from "@/components/auth/admin-guard"

export default function TimesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminGuard>{children}</AdminGuard>
}
