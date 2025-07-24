<<<<<<< HEAD
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
=======
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
>>>>>>> 107753abbc7c201e46bfd2d1098db0e7d2541e5c
} 