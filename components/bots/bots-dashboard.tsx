<<<<<<< HEAD
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  CheckCircle, 
  XCircle, 
  Activity,
  TrendingUp,
  MessageSquare,
  Zap
} from "lucide-react"
import { Bot as BotType } from "@/services/bot-service"

interface BotsDashboardProps {
  bots: BotType[]
}

export function BotsDashboard({ bots }: BotsDashboardProps) {
  const totalBots = bots.length
  const botsAtivos = bots.filter(bot => bot.ativo).length
  const botsInativos = totalBots - botsAtivos
  
  // Calcular estatísticas de teste
  const botsComTeste = bots.filter(bot => bot.ultimoTeste)
  const testesSucesso = botsComTeste.filter(bot => bot.ultimoTeste?.sucesso).length
  const testesFalha = botsComTeste.length - testesSucesso
  
  // Bot mais recente
  const botMaisRecente = bots.length > 0 
    ? bots.reduce((maisRecente, bot) => 
        new Date(bot.criadoEm) > new Date(maisRecente.criadoEm) ? bot : maisRecente
      )
    : null

  return (
    <div className="space-y-6">
      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Bots */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBots}</div>
            <p className="text-xs text-muted-foreground">
              {totalBots === 0 ? "Nenhum bot configurado" : `${botsAtivos} ativos, ${botsInativos} inativos`}
            </p>
          </CardContent>
        </Card>

        {/* Status dos Bots */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-600">{botsAtivos}</div>
              <div className="text-2xl font-bold text-gray-400">/</div>
              <div className="text-2xl font-bold text-red-600">{botsInativos}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              {totalBots > 0 ? `${((botsAtivos / totalBots) * 100).toFixed(1)}% ativos` : "Nenhum bot"}
            </p>
          </CardContent>
        </Card>

        {/* Testes Realizados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos Testes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-600">{testesSucesso}</div>
              <div className="text-2xl font-bold text-gray-400">/</div>
              <div className="text-2xl font-bold text-red-600">{testesFalha}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              {botsComTeste.length > 0 ? `${botsComTeste.length} bots testados` : "Nenhum teste realizado"}
            </p>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {botsComTeste.length > 0 
                ? `${((testesSucesso / botsComTeste.length) * 100).toFixed(1)}%`
                : "0%"
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa de sucesso nos testes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações dos Bots */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações dos Bots</CardTitle>
          <CardDescription>Dados importantes sobre seus bots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {botMaisRecente && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Bot Mais Recente</p>
                  <p className="text-sm text-blue-700">{botMaisRecente.nome}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {new Date(botMaisRecente.criadoEm).toLocaleDateString()}
                </Badge>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900">Webhooks Ativos</p>
                <p className="text-sm text-purple-700">{botsAtivos} de {totalBots}</p>
              </div>
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
=======
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  CheckCircle, 
  XCircle, 
  Activity,
  TrendingUp,
  MessageSquare,
  Zap
} from "lucide-react"
import { Bot as BotType } from "@/services/bot-service"

interface BotsDashboardProps {
  bots: BotType[]
}

export function BotsDashboard({ bots }: BotsDashboardProps) {
  const totalBots = bots.length
  const botsAtivos = bots.filter(bot => bot.ativo).length
  const botsInativos = totalBots - botsAtivos
  
  // Calcular estatísticas de teste
  const botsComTeste = bots.filter(bot => bot.ultimoTeste)
  const testesSucesso = botsComTeste.filter(bot => bot.ultimoTeste?.sucesso).length
  const testesFalha = botsComTeste.length - testesSucesso
  
  // Bot mais recente
  const botMaisRecente = bots.length > 0 
    ? bots.reduce((maisRecente, bot) => 
        new Date(bot.criadoEm) > new Date(maisRecente.criadoEm) ? bot : maisRecente
      )
    : null

  return (
    <div className="space-y-6">
      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Bots */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBots}</div>
            <p className="text-xs text-muted-foreground">
              {totalBots === 0 ? "Nenhum bot configurado" : `${botsAtivos} ativos, ${botsInativos} inativos`}
            </p>
          </CardContent>
        </Card>

        {/* Status dos Bots */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-600">{botsAtivos}</div>
              <div className="text-2xl font-bold text-gray-400">/</div>
              <div className="text-2xl font-bold text-red-600">{botsInativos}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              {totalBots > 0 ? `${((botsAtivos / totalBots) * 100).toFixed(1)}% ativos` : "Nenhum bot"}
            </p>
          </CardContent>
        </Card>

        {/* Testes Realizados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos Testes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-600">{testesSucesso}</div>
              <div className="text-2xl font-bold text-gray-400">/</div>
              <div className="text-2xl font-bold text-red-600">{testesFalha}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              {botsComTeste.length > 0 ? `${botsComTeste.length} bots testados` : "Nenhum teste realizado"}
            </p>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {botsComTeste.length > 0 
                ? `${((testesSucesso / botsComTeste.length) * 100).toFixed(1)}%`
                : "0%"
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa de sucesso nos testes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações dos Bots */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações dos Bots</CardTitle>
          <CardDescription>Dados importantes sobre seus bots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {botMaisRecente && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Bot Mais Recente</p>
                  <p className="text-sm text-blue-700">{botMaisRecente.nome}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {new Date(botMaisRecente.criadoEm).toLocaleDateString()}
                </Badge>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900">Webhooks Ativos</p>
                <p className="text-sm text-purple-700">{botsAtivos} de {totalBots}</p>
              </div>
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
>>>>>>> 107753abbc7c201e46bfd2d1098db0e7d2541e5c
} 