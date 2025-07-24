import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Wifi, WifiOff } from "lucide-react"
import { botService } from "@/services/bot-service"

interface BotStatusIndicatorProps {
  webhookUrl: string
  botName: string
  onStatusChange?: (status: "online" | "offline" | "checking") => void
  showDetails?: boolean
}

export function BotStatusIndicator({ 
  webhookUrl, 
  botName, 
  onStatusChange,
  showDetails = false 
}: BotStatusIndicatorProps) {
  const [status, setStatus] = useState<"online" | "offline" | "checking">("checking")
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const checkStatus = async () => {
    setStatus("checking")
    setErrorMessage(null)
    const startTime = Date.now()

    try {
      const response = await botService.testarWebhook(webhookUrl)
      const endTime = Date.now()
      const responseTimeMs = endTime - startTime

      setResponseTime(responseTimeMs)
      setLastCheck(new Date())

      if (response.sucesso) {
        setStatus("online")
        onStatusChange?.("online")
      } else {
        setStatus("offline")
        setErrorMessage(response.mensagem)
        onStatusChange?.("offline")
      }
    } catch (error) {
      const endTime = Date.now()
      const responseTimeMs = endTime - startTime
      
      setResponseTime(responseTimeMs)
      setLastCheck(new Date())
      setStatus("offline")
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido")
      onStatusChange?.("offline")
    }
  }

  // Verificar status automaticamente
  useEffect(() => {
    checkStatus()
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkStatus, 30000)
    
    return () => clearInterval(interval)
  }, [webhookUrl])

  const getStatusIcon = () => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "offline":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "checking":
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Online"
      case "offline":
        return "Offline"
      case "checking":
        return "Verificando..."
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border-green-200"
      case "offline":
        return "bg-red-100 text-red-800 border-red-200"
      case "checking":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge 
        variant="outline" 
        className={`flex items-center space-x-1 ${getStatusColor()}`}
      >
        {getStatusIcon()}
        <span className="text-xs font-medium">{getStatusText()}</span>
      </Badge>

      {showDetails && (
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          {responseTime !== null && (
            <span>{responseTime}ms</span>
          )}
          
          {lastCheck && (
            <span>
              Última verificação: {lastCheck.toLocaleTimeString()}
            </span>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={checkStatus}
            disabled={status === "checking"}
            className="h-6 px-2"
          >
            <Wifi className="w-3 h-3" />
          </Button>
        </div>
      )}

      {showDetails && errorMessage && status === "offline" && (
        <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  )
} 