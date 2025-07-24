"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

import { 
  Bot, 
  Plus, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  Copy,
  ExternalLink,
  AlertCircle,
  Settings,
  MessageSquare
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { ChatTester } from "@/components/bots/chat-tester"
import { FloatingChatButton } from "@/components/bots/floating-chat-button"
import { BotStatusIndicator } from "@/components/bots/bot-status-indicator"
import { BotsDashboard } from "@/components/bots/bots-dashboard"
import { CORSConfigGuide } from "@/components/bots/cors-config-guide"

interface Bot {
  id: string
  nome: string
  webhookUrl: string
  descricao?: string
  ativo: boolean
  ultimoTeste?: {
    sucesso: boolean
    timestamp: string
    mensagem?: string
  }
  criadoEm: string
  atualizadoEm: string
}

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [botEditando, setBotEditando] = useState<Bot | null>(null)
  const [testandoWebhook, setTestandoWebhook] = useState(false)
  const [resultadoTeste, setResultadoTeste] = useState<{
    sucesso: boolean
    mensagem: string
  } | null>(null)
  const [showChatTester, setShowChatTester] = useState(false)
  const [botParaTestar, setBotParaTestar] = useState<Bot | null>(null)
  const [showFloatingChat, setShowFloatingChat] = useState(false)
  const [showCORSGuide, setShowCORSGuide] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: "",
    webhookUrl: "",
    descricao: "",
    ativo: true
  })

  // Carregar bots salvos do localStorage (simulação)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const botsSalvos = localStorage.getItem("bots")
      if (botsSalvos) {
        setBots(JSON.parse(botsSalvos))
      }
    }
  }, [])

  // Salvar bots no localStorage
  const salvarBots = (novosBots: Bot[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("bots", JSON.stringify(novosBots))
    }
    setBots(novosBots)
  }

  const limparFormulario = () => {
    setFormData({
      nome: "",
      webhookUrl: "",
      descricao: "",
      ativo: true
    })
    setResultadoTeste(null)
  }

  const abrirModalCriacao = () => {
    setBotEditando(null)
    limparFormulario()
    setModalAberto(true)
  }

  const abrirModalEdicao = (bot: Bot) => {
    setBotEditando(bot)
    setFormData({
      nome: bot.nome,
      webhookUrl: bot.webhookUrl,
      descricao: bot.descricao || "",
      ativo: bot.ativo
    })
    setModalAberto(true)
  }

  const testarWebhook = async () => {
    if (!formData.webhookUrl.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL de webhook válida",
        variant: "destructive"
      })
      return
    }

    setTestandoWebhook(true)
    setResultadoTeste(null)

    try {
      // Usar proxy para evitar problemas de CORS
      const response = await fetch('/api/webhook-proxy', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl: formData.webhookUrl,
          payload: {
            teste: true,
            timestamp: new Date().toISOString(),
            mensagem: "Teste de conexão do bot",
            dados: {
              conversa_id: "teste-123",
              contato: {
                nome: "Usuário Teste",
                telefone: "+5511999999999"
              },
              mensagem: "Esta é uma mensagem de teste"
            }
          }
        })
      })

      if (response.ok) {
        setResultadoTeste({
          sucesso: true,
          mensagem: "Conexão bem-sucedida! O webhook está funcionando corretamente."
        })
        toast({
          title: "Sucesso!",
          description: "Webhook testado com sucesso",
        })
      } else {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
          } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
        
        // Verificar se é erro de CORS
        if (errorMessage.includes('CORS') || errorMessage.includes('blocked by CORS policy')) {
          setResultadoTeste({
            sucesso: false,
            mensagem: `Erro de CORS detectado. O n8n precisa ser configurado para aceitar requisições do seu domínio.`
          })
          toast({
            title: "Erro de CORS",
            description: "Configure o CORS no n8n para resolver este problema.",
            variant: "destructive"
          })
        } else {
          setResultadoTeste({
            sucesso: false,
            mensagem: `Erro na conexão: ${errorMessage}`
          })
          toast({
            title: "Erro no teste",
            description: "Falha ao testar o webhook. Verifique a URL e tente novamente.",
            variant: "destructive"
          })
        }
      } finally {
        setTestandoWebhook(false)
      }
  }

  const salvarBot = () => {
    if (!formData.nome.trim() || !formData.webhookUrl.trim()) {
      toast({
        title: "Erro",
        description: "Nome e URL do webhook são obrigatórios",
        variant: "destructive"
      })
      return
    }

    const novoBot: Bot = {
      id: botEditando?.id || Date.now().toString(),
      nome: formData.nome.trim(),
      webhookUrl: formData.webhookUrl.trim(),
      descricao: formData.descricao.trim() || undefined,
      ativo: formData.ativo,
      ultimoTeste: resultadoTeste ? {
        sucesso: resultadoTeste.sucesso,
        timestamp: new Date().toISOString(),
        mensagem: resultadoTeste.mensagem
      } : undefined,
      criadoEm: botEditando?.criadoEm || new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }

    if (botEditando) {
      // Editar bot existente
      const botsAtualizados = bots.map(bot => 
        bot.id === botEditando.id ? novoBot : bot
      )
      salvarBots(botsAtualizados)
      toast({
        title: "Bot atualizado",
        description: "Bot atualizado com sucesso",
      })
    } else {
      // Criar novo bot
      salvarBots([...bots, novoBot])
      toast({
        title: "Bot criado",
        description: "Bot criado com sucesso",
      })
      
      // Abrir chat de teste para o novo bot
      setBotParaTestar(novoBot)
      setShowChatTester(true)
    }

    setModalAberto(false)
    limparFormulario()
  }

  const excluirBot = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este bot?")) {
      const botsAtualizados = bots.filter(bot => bot.id !== id)
      salvarBots(botsAtualizados)
      toast({
        title: "Bot excluído",
        description: "Bot removido com sucesso",
      })
    }
  }

  const alternarStatusBot = (id: string) => {
    const botsAtualizados = bots.map(bot => 
      bot.id === id ? { ...bot, ativo: !bot.ativo } : bot
    )
    salvarBots(botsAtualizados)
    toast({
      title: "Status alterado",
      description: `Bot ${bots.find(b => b.id === id)?.ativo ? 'desativado' : 'ativado'} com sucesso`,
    })
  }

  const copiarWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "URL copiada",
      description: "URL do webhook copiada para a área de transferência",
    })
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Bots</h1>
          <p className="text-gray-600">Crie e gerencie bots conectados via webhook</p>
        </div>
        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogTrigger asChild>
            <Button onClick={abrirModalCriacao} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Bot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {botEditando ? "Editar Bot" : "Criar Novo Bot"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Nome do Bot */}
              <div>
                <Label htmlFor="nome">Nome do Bot *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Bot de Atendimento Automático"
                />
              </div>

              {/* URL do Webhook */}
              <div>
                <Label htmlFor="webhookUrl">URL do Webhook *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="webhookUrl"
                    value={formData.webhookUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://n8n-n8n.n1n956.easypanel.host/webhook/conversa"
                    className="flex-1"
                  />
                  <Button
                    onClick={testarWebhook}
                    disabled={testandoWebhook || !formData.webhookUrl.trim()}
                    variant="outline"
                    size="sm"
                  >
                    {testandoWebhook ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <TestTube className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Insira a URL do webhook que receberá as mensagens
                </p>
              </div>

              {/* Resultado do Teste */}
              {resultadoTeste && (
                <div className={`p-3 rounded-lg border ${
                  resultadoTeste.sucesso 
                    ? "bg-green-50 border-green-200" 
                    : "bg-red-50 border-red-200"
                }`}>
                  <div className="flex items-center space-x-2">
                    {resultadoTeste.sucesso ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      resultadoTeste.sucesso ? "text-green-800" : "text-red-800"
                    }`}>
                      {resultadoTeste.sucesso ? "Conexão bem-sucedida" : "Falha na conexão"}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${
                    resultadoTeste.sucesso ? "text-green-700" : "text-red-700"
                  }`}>
                    {resultadoTeste.mensagem}
                  </p>
                  
                  {/* Botão para mostrar guia de CORS se for erro de CORS */}
                  {!resultadoTeste.sucesso && resultadoTeste.mensagem.includes('CORS') && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCORSGuide(true)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Ver Guia de Configuração CORS
                      </Button>
                    </div>
                  )}
                </div>
              )}



              {/* Descrição */}
              <div>
                <Label htmlFor="descricao">Descrição (opcional)</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva o que este bot faz..."
                  rows={3}
                />
              </div>

              {/* Status Ativo */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
                />
                <Label htmlFor="ativo">Bot ativo</Label>
              </div>

              {/* Ações */}
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setModalAberto(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={salvarBot}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {botEditando ? "Salvar Alterações" : "Criar Bot"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dashboard */}
      <BotsDashboard bots={bots} />

      {/* Lista de Bots */}
      <div className="space-y-4">
        {bots.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum bot configurado
              </h3>
              <p className="text-gray-600 mb-4">
                Crie seu primeiro bot para automatizar o atendimento via webhook.
              </p>
              <Button onClick={abrirModalCriacao} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Bot
              </Button>
            </CardContent>
          </Card>
        ) : (
          bots.map((bot) => (
            <Card key={bot.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Bot className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{bot.nome}</h3>
                      <Badge variant={bot.ativo ? "default" : "secondary"}>
                        {bot.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <BotStatusIndicator 
                        webhookUrl={bot.webhookUrl}
                        botName={bot.nome}
                        showDetails={true}
                      />
                    </div>
                    
                    {bot.descricao && (
                      <p className="text-gray-600 mb-3">{bot.descricao}</p>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                          {bot.webhookUrl}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copiarWebhookUrl(bot.webhookUrl)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Criado em: {formatarData(bot.criadoEm)}</span>
                        {bot.ultimoTeste && (
                          <div className="flex items-center space-x-1">
                            {bot.ultimoTeste.sucesso ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span>
                              Último teste: {formatarData(bot.ultimoTeste.timestamp)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alternarStatusBot(bot.id)}
                    >
                      {bot.ativo ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBotParaTestar(bot)
                        setShowChatTester(true)
                      }}
                      title="Chat de Teste"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBotParaTestar(bot)
                        setShowFloatingChat(true)
                      }}
                      title="Chat Flutuante"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => abrirModalEdicao(bot)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => excluirBot(bot.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Chat de Teste */}
      {showChatTester && botParaTestar && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Chat de Teste - {botParaTestar.nome}</h2>
            <Button
              variant="outline"
              onClick={() => setShowChatTester(false)}
            >
              Fechar Chat
            </Button>
          </div>
          <ChatTester
            webhookUrl={botParaTestar.webhookUrl}
            botName={botParaTestar.nome}
            onTestComplete={(success, message) => {
              toast({
                title: success ? "Teste Concluído" : "Teste Falhou",
                description: message,
                variant: success ? "default" : "destructive"
              })
            }}
          />
        </div>
      )}

      {/* Chat Flutuante */}
      {showFloatingChat && botParaTestar && (
        <FloatingChatButton
          bot={botParaTestar}
          onTestComplete={(success, message) => {
            toast({
              title: success ? "Teste Concluído" : "Teste Falhou",
              description: message,
              variant: success ? "default" : "destructive"
            })
          }}
        />
      )}

      {/* Guia de Configuração CORS */}
      {showCORSGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CORSConfigGuide
              webhookUrl={formData.webhookUrl}
              onClose={() => setShowCORSGuide(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
} 