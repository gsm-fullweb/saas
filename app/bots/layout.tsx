import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gerenciamento de Bots - SaaS ChatHook",
  description: "Crie e gerencie bots conectados via webhook para automatizar o atendimento",
}

export default function BotsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        {children}
      </div>
    </div>
  )
} 