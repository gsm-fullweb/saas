import { Badge } from "@/components/ui/badge"

interface PriorityBadgeProps {
  priority: "baixa" | "media" | "alta" | "urgente"
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityConfig = {
    baixa: {
      label: "Baixa",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
    media: {
      label: "Média",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
    alta: {
      label: "Alta",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    },
    urgente: {
      label: "Urgente",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  }

  const config = priorityConfig[priority]

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  )
}
