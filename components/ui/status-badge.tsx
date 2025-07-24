import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "aberta" | "em_andamento" | "aguardando" | "fechada"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    aberta: {
      label: "Aberta",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
    em_andamento: {
      label: "Em Andamento",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
    aguardando: {
      label: "Aguardando",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    fechada: {
      label: "Fechada",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  )
}
