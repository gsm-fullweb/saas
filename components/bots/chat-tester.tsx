<<<<<<< HEAD
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Send, 
  Bot, 
  User, 
  Play, 
  RotateCcw,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { Square } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { botService, WebhookPayload } from "@/services/bot-service"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  status?: "sending" | "sent" | "error"
  webhookResponse?: {
    success: boolean
    message: string
    response?: any
  }
}

interface ChatTesterProps {
  webhookUrl: string
  botName: string
  onTestComplete?: (success: boolean, message: string) => void
  compact?: boolean
}

export function ChatTester({ webhookUrl, botName, onTestComplete, compact = false }: ChatTesterProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<{
    total: number
    success: number
    failed: number
    averageResponseTime: number
  }>({ total: 0, success: 0, failed: 0, averageResponseTime: 0 })
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Mensagens de exemplo para teste rápido
  const sampleMessages = [
    "Olá, preciso de ajuda",
    "Qual é o preço do produto?",
    "Como faço para cancelar minha conta?",
    "Preciso de suporte técnico",
    "Quero fazer uma reclamação"
  ]

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Adicionar mensagem do usuário
  const addUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      status: "sending"
    }

    setMessages(prev => [...prev, userMessage])
    return userMessage
  }

  // Adicionar mensagem do bot
  const addBotMessage = (content: string, webhookResponse?: ChatMessage["webhookResponse"]) => {
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content,
      sender: "bot",
      timestamp: new Date(),
      status: "sent",
      webhookResponse
    }

    setMessages(prev => [...prev, botMessage])
    return botMessage
  }

  // Simular resposta do bot
  const simulateBotResponse = async (userMessage: ChatMessage) => {
    const startTime = Date.now()
    
    try {
      // Criar payload para o webhook
      const payload: WebhookPayload = {
        conversa_id: `test-${Date.now()}`,
        contato: {
          nome: "Usuário Teste",
          telefone: "+5511999999999",
          email: "teste@exemplo.com"
        },
        mensagem: {
          id: userMessage.id,
          conteudo: userMessage.content,
          tipo: "texto",
          timestamp: userMessage.timestamp.toISOString()
        },
        agente: {
          id: "agente-teste",
          nome: "Agente Teste"
        },
        empresa: {
          id: "empresa-teste",
          nome: "Empresa Teste"
        },
        metadata: {
          teste: true,
          origem: "chat-tester"
        }
      }

      // Enviar para o webhook
      const response = await botService.testarWebhook(webhookUrl)
      const responseTime = Date.now() - startTime

      // Atualizar estatísticas
      setTestResults(prev => ({
        total: prev.total + 1,
        success: response.sucesso ? prev.success + 1 : prev.success,
        failed: response.sucesso ? prev.failed : prev.failed + 1,
        averageResponseTime: (prev.averageResponseTime * prev.total + responseTime) / (prev.total + 1)
      }))

      // Adicionar resposta do bot
      if (response.sucesso) {
        addBotMessage(
          `✅ Webhook respondeu com sucesso! (${responseTime}ms)\n\nResposta: ${response.response || "Sem resposta"}`,
          {
            success: true,
            message: response.mensagem,
            response: response.response
          }
        )
      } else {
        addBotMessage(
          `❌ Erro no webhook: ${response.mensagem}\n\nTempo de resposta: ${responseTime}ms`,
          {
            success: false,
            message: response.mensagem
          }
        )
      }

      // Atualizar status da mensagem do usuário
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: response.sucesso ? "sent" : "error" }
          : msg
      ))

      return response.sucesso
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      setTestResults(prev => ({
        total: prev.total + 1,
        success: prev.success,
        failed: prev.failed + 1,
        averageResponseTime: (prev.averageResponseTime * prev.total + responseTime) / (prev.total + 1)
      }))

      addBotMessage(
        `❌ Erro na conexão: ${error instanceof Error ? error.message : "Erro desconhecido"}\n\nTempo de resposta: ${responseTime}ms`,
        {
          success: false,
          message: error instanceof Error ? error.message : "Erro desconhecido"
        }
      )

      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: "error" }
          : msg
      ))

      return false
    }
  }

  // Enviar mensagem
  const sendMessage = async () => {
    if (!inputMessage.trim() || isTesting) return

    setIsTesting(true)
    const userMessage = addUserMessage(inputMessage.trim())
    setInputMessage("")

    try {
      const success = await simulateBotResponse(userMessage)
      
      if (onTestComplete) {
        onTestComplete(success, success ? "Teste bem-sucedido!" : "Teste falhou")
      }
    } finally {
      setIsTesting(false)
    }
  }

  // Teste automático com mensagens de exemplo
  const runAutoTest = async () => {
    if (isTesting) return

    setIsTesting(true)
    let successCount = 0
    let totalCount = 0

    for (const sampleMessage of sampleMessages) {
      const userMessage = addUserMessage(sampleMessage)
      const success = await simulateBotResponse(userMessage)
      
      if (success) successCount++
      totalCount++

      // Aguardar um pouco entre as mensagens
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setIsTesting(false)
    
    const successRate = (successCount / totalCount) * 100
    toast({
      title: "Teste Automático Concluído",
      description: `${successCount}/${totalCount} mensagens enviadas com sucesso (${successRate.toFixed(1)}%)`,
    })

    if (onTestComplete) {
      onTestComplete(successCount === totalCount, `Taxa de sucesso: ${successRate.toFixed(1)}%`)
    }
  }

  // Limpar chat
  const clearChat = () => {
    setMessages([])
    setTestResults({ total: 0, success: 0, failed: 0, averageResponseTime: 0 })
  }

  // Parar teste
  const stopTest = () => {
    setIsTesting(false)
  }

  return (
    <Card className={`w-full ${compact ? '' : 'max-w-4xl mx-auto'}`}>
      {!compact && (
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>Chat de Teste - {botName}</span>
          </CardTitle>
          <CardDescription>
            Teste seu bot em tempo real. Envie mensagens e veja como o webhook responde.
          </CardDescription>
        </CardHeader>
      )}
      
              <CardContent className={`space-y-4 ${compact ? 'p-2' : ''}`}>
          {/* Estatísticas */}
          {testResults.total > 0 && !compact && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{testResults.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testResults.success}</div>
                <div className="text-sm text-gray-600">Sucessos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
                <div className="text-sm text-gray-600">Falhas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {testResults.averageResponseTime.toFixed(0)}ms
                </div>
                <div className="text-sm text-gray-600">Tempo Médio</div>
              </div>
            </div>
          )}

          {/* Controles */}
          {!compact && (
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={runAutoTest}
                disabled={isTesting}
                variant="outline"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Teste Automático
              </Button>
              
              {isTesting && (
                <Button
                  onClick={stopTest}
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Parar
                </Button>
              )}
              
              <Button
                onClick={clearChat}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          )}

        {/* Chat */}
        <div className={`border rounded-lg flex flex-col ${compact ? 'h-80' : 'h-96'}`}>
          {/* Header do Chat */}
          <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Chat de Teste</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {messages.length} mensagens
            </Badge>
          </div>

          {/* Área de Mensagens */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma mensagem ainda</p>
                  <p className="text-sm">Envie uma mensagem para testar o bot</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={message.sender === "user" ? "bg-blue-100" : "bg-gray-100"}>
                          {message.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-lg p-3 ${
                        message.sender === "user" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-100 text-gray-900"
                      }`}>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        
                        {/* Status da mensagem */}
                        <div className="flex items-center space-x-2 mt-2 text-xs">
                          <span className="text-gray-500">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          
                          {message.status === "sending" && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 animate-spin" />
                              <span>Enviando...</span>
                            </div>
                          )}
                          
                          {message.status === "sent" && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              <span>Enviado</span>
                            </div>
                          )}
                          
                          {message.status === "error" && (
                            <div className="flex items-center space-x-1 text-red-600">
                              <XCircle className="w-3 h-3" />
                              <span>Erro</span>
                            </div>
                          )}
                        </div>

                        {/* Detalhes do webhook */}
                        {message.webhookResponse && (
                          <div className={`mt-2 p-2 rounded text-xs ${
                            message.webhookResponse.success 
                              ? "bg-green-50 text-green-800" 
                              : "bg-red-50 text-red-800"
                          }`}>
                            <div className="font-medium">
                              {message.webhookResponse.success ? "✅ Webhook OK" : "❌ Webhook Error"}
                            </div>
                            <div>{message.webhookResponse.message}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Input de Mensagem */}
          <div className="p-3 border-t bg-white">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Digite sua mensagem..."
                disabled={isTesting}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTesting}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Mensagens de exemplo */}
            <div className="mt-2 flex flex-wrap gap-1">
              {sampleMessages.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(sample)}
                  disabled={isTesting}
                  className="text-xs h-6"
                >
                  {sample}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Informações */}
        {!compact && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>• As mensagens são enviadas para: <code className="bg-gray-100 px-1 rounded">{webhookUrl}</code></p>
            <p>• Use o "Teste Automático" para enviar várias mensagens de exemplo</p>
            <p>• O tempo de resposta e status são exibidos em tempo real</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
=======
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Send, 
  Bot, 
  User, 
  Play, 
  RotateCcw,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { Square } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { botService, WebhookPayload } from "@/services/bot-service"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  status?: "sending" | "sent" | "error"
  webhookResponse?: {
    success: boolean
    message: string
    response?: any
  }
}

interface ChatTesterProps {
  webhookUrl: string
  botName: string
  onTestComplete?: (success: boolean, message: string) => void
  compact?: boolean
}

export function ChatTester({ webhookUrl, botName, onTestComplete, compact = false }: ChatTesterProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<{
    total: number
    success: number
    failed: number
    averageResponseTime: number
  }>({ total: 0, success: 0, failed: 0, averageResponseTime: 0 })
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Mensagens de exemplo para teste rápido
  const sampleMessages = [
    "Olá, preciso de ajuda",
    "Qual é o preço do produto?",
    "Como faço para cancelar minha conta?",
    "Preciso de suporte técnico",
    "Quero fazer uma reclamação"
  ]

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Adicionar mensagem do usuário
  const addUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      status: "sending"
    }

    setMessages(prev => [...prev, userMessage])
    return userMessage
  }

  // Adicionar mensagem do bot
  const addBotMessage = (content: string, webhookResponse?: ChatMessage["webhookResponse"]) => {
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content,
      sender: "bot",
      timestamp: new Date(),
      status: "sent",
      webhookResponse
    }

    setMessages(prev => [...prev, botMessage])
    return botMessage
  }

  // Simular resposta do bot
  const simulateBotResponse = async (userMessage: ChatMessage) => {
    const startTime = Date.now()
    
    try {
      // Criar payload para o webhook
      const payload: WebhookPayload = {
        conversa_id: `test-${Date.now()}`,
        contato: {
          nome: "Usuário Teste",
          telefone: "+5511999999999",
          email: "teste@exemplo.com"
        },
        mensagem: {
          id: userMessage.id,
          conteudo: userMessage.content,
          tipo: "texto",
          timestamp: userMessage.timestamp.toISOString()
        },
        agente: {
          id: "agente-teste",
          nome: "Agente Teste"
        },
        empresa: {
          id: "empresa-teste",
          nome: "Empresa Teste"
        },
        metadata: {
          teste: true,
          origem: "chat-tester"
        }
      }

      // Enviar para o webhook
      const response = await botService.testarWebhook(webhookUrl)
      const responseTime = Date.now() - startTime

      // Atualizar estatísticas
      setTestResults(prev => ({
        total: prev.total + 1,
        success: response.sucesso ? prev.success + 1 : prev.success,
        failed: response.sucesso ? prev.failed : prev.failed + 1,
        averageResponseTime: (prev.averageResponseTime * prev.total + responseTime) / (prev.total + 1)
      }))

      // Adicionar resposta do bot
      if (response.sucesso) {
        addBotMessage(
          `✅ Webhook respondeu com sucesso! (${responseTime}ms)\n\nResposta: ${response.response || "Sem resposta"}`,
          {
            success: true,
            message: response.mensagem,
            response: response.response
          }
        )
      } else {
        addBotMessage(
          `❌ Erro no webhook: ${response.mensagem}\n\nTempo de resposta: ${responseTime}ms`,
          {
            success: false,
            message: response.mensagem
          }
        )
      }

      // Atualizar status da mensagem do usuário
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: response.sucesso ? "sent" : "error" }
          : msg
      ))

      return response.sucesso
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      setTestResults(prev => ({
        total: prev.total + 1,
        success: prev.success,
        failed: prev.failed + 1,
        averageResponseTime: (prev.averageResponseTime * prev.total + responseTime) / (prev.total + 1)
      }))

      addBotMessage(
        `❌ Erro na conexão: ${error instanceof Error ? error.message : "Erro desconhecido"}\n\nTempo de resposta: ${responseTime}ms`,
        {
          success: false,
          message: error instanceof Error ? error.message : "Erro desconhecido"
        }
      )

      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: "error" }
          : msg
      ))

      return false
    }
  }

  // Enviar mensagem
  const sendMessage = async () => {
    if (!inputMessage.trim() || isTesting) return

    setIsTesting(true)
    const userMessage = addUserMessage(inputMessage.trim())
    setInputMessage("")

    try {
      const success = await simulateBotResponse(userMessage)
      
      if (onTestComplete) {
        onTestComplete(success, success ? "Teste bem-sucedido!" : "Teste falhou")
      }
    } finally {
      setIsTesting(false)
    }
  }

  // Teste automático com mensagens de exemplo
  const runAutoTest = async () => {
    if (isTesting) return

    setIsTesting(true)
    let successCount = 0
    let totalCount = 0

    for (const sampleMessage of sampleMessages) {
      const userMessage = addUserMessage(sampleMessage)
      const success = await simulateBotResponse(userMessage)
      
      if (success) successCount++
      totalCount++

      // Aguardar um pouco entre as mensagens
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setIsTesting(false)
    
    const successRate = (successCount / totalCount) * 100
    toast({
      title: "Teste Automático Concluído",
      description: `${successCount}/${totalCount} mensagens enviadas com sucesso (${successRate.toFixed(1)}%)`,
    })

    if (onTestComplete) {
      onTestComplete(successCount === totalCount, `Taxa de sucesso: ${successRate.toFixed(1)}%`)
    }
  }

  // Limpar chat
  const clearChat = () => {
    setMessages([])
    setTestResults({ total: 0, success: 0, failed: 0, averageResponseTime: 0 })
  }

  // Parar teste
  const stopTest = () => {
    setIsTesting(false)
  }

  return (
    <Card className={`w-full ${compact ? '' : 'max-w-4xl mx-auto'}`}>
      {!compact && (
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>Chat de Teste - {botName}</span>
          </CardTitle>
          <CardDescription>
            Teste seu bot em tempo real. Envie mensagens e veja como o webhook responde.
          </CardDescription>
        </CardHeader>
      )}
      
              <CardContent className={`space-y-4 ${compact ? 'p-2' : ''}`}>
          {/* Estatísticas */}
          {testResults.total > 0 && !compact && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{testResults.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testResults.success}</div>
                <div className="text-sm text-gray-600">Sucessos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
                <div className="text-sm text-gray-600">Falhas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {testResults.averageResponseTime.toFixed(0)}ms
                </div>
                <div className="text-sm text-gray-600">Tempo Médio</div>
              </div>
            </div>
          )}

          {/* Controles */}
          {!compact && (
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={runAutoTest}
                disabled={isTesting}
                variant="outline"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Teste Automático
              </Button>
              
              {isTesting && (
                <Button
                  onClick={stopTest}
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Parar
                </Button>
              )}
              
              <Button
                onClick={clearChat}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          )}

        {/* Chat */}
        <div className={`border rounded-lg flex flex-col ${compact ? 'h-80' : 'h-96'}`}>
          {/* Header do Chat */}
          <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Chat de Teste</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {messages.length} mensagens
            </Badge>
          </div>

          {/* Área de Mensagens */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma mensagem ainda</p>
                  <p className="text-sm">Envie uma mensagem para testar o bot</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={message.sender === "user" ? "bg-blue-100" : "bg-gray-100"}>
                          {message.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-lg p-3 ${
                        message.sender === "user" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-100 text-gray-900"
                      }`}>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        
                        {/* Status da mensagem */}
                        <div className="flex items-center space-x-2 mt-2 text-xs">
                          <span className="text-gray-500">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          
                          {message.status === "sending" && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 animate-spin" />
                              <span>Enviando...</span>
                            </div>
                          )}
                          
                          {message.status === "sent" && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              <span>Enviado</span>
                            </div>
                          )}
                          
                          {message.status === "error" && (
                            <div className="flex items-center space-x-1 text-red-600">
                              <XCircle className="w-3 h-3" />
                              <span>Erro</span>
                            </div>
                          )}
                        </div>

                        {/* Detalhes do webhook */}
                        {message.webhookResponse && (
                          <div className={`mt-2 p-2 rounded text-xs ${
                            message.webhookResponse.success 
                              ? "bg-green-50 text-green-800" 
                              : "bg-red-50 text-red-800"
                          }`}>
                            <div className="font-medium">
                              {message.webhookResponse.success ? "✅ Webhook OK" : "❌ Webhook Error"}
                            </div>
                            <div>{message.webhookResponse.message}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Input de Mensagem */}
          <div className="p-3 border-t bg-white">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Digite sua mensagem..."
                disabled={isTesting}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTesting}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Mensagens de exemplo */}
            <div className="mt-2 flex flex-wrap gap-1">
              {sampleMessages.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(sample)}
                  disabled={isTesting}
                  className="text-xs h-6"
                >
                  {sample}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Informações */}
        {!compact && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>• As mensagens são enviadas para: <code className="bg-gray-100 px-1 rounded">{webhookUrl}</code></p>
            <p>• Use o "Teste Automático" para enviar várias mensagens de exemplo</p>
            <p>• O tempo de resposta e status são exibidos em tempo real</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
>>>>>>> 107753abbc7c201e46bfd2d1098db0e7d2541e5c
} 