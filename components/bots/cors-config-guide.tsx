import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  AlertCircle, 
  CheckCircle, 
  Copy, 
  ExternalLink,
  Settings,
  Code,
  Terminal
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CORSConfigGuideProps {
  webhookUrl?: string
  onClose?: () => void
}

export function CORSConfigGuide({ webhookUrl, onClose }: CORSConfigGuideProps) {
  const [activeTab, setActiveTab] = useState<'n8n' | 'docker' | 'env'>('n8n')
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência`,
    })
  }

  const n8nConfig = `# Configuração CORS para n8n
# Adicione estas variáveis ao seu arquivo .env do n8n

N8N_CORS_ALLOW_ORIGIN="*"
N8N_CORS_ALLOW_CREDENTIALS=true
N8N_CORS_ALLOW_METHODS="GET,POST,PUT,DELETE,OPTIONS"
N8N_CORS_ALLOW_HEADERS="Content-Type,Authorization,X-Requested-With"`

  const dockerConfig = `# Docker Compose para n8n com CORS configurado
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_CORS_ALLOW_ORIGIN=*
      - N8N_CORS_ALLOW_CREDENTIALS=true
      - N8N_CORS_ALLOW_METHODS=GET,POST,PUT,DELETE,OPTIONS
      - N8N_CORS_ALLOW_HEADERS=Content-Type,Authorization,X-Requested-With
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped

volumes:
  n8n_data:`

  const testCommand = `curl -X POST "${webhookUrl || 'https://n8n-n8n.n1n956.easypanel.host/webhook/AgentSaas'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "teste": true,
    "timestamp": "${new Date().toISOString()}",
    "mensagem": "Teste de conexão"
  }'`

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuração de CORS para n8n
            </CardTitle>
            <CardDescription>
              Resolva problemas de CORS configurando o n8n para aceitar requisições do seu frontend
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Fechar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Alert sobre o problema */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Problema de CORS Detectado</h4>
              <p className="text-sm text-amber-700 mt-1">
                O erro indica que o n8n não está configurado para aceitar requisições do seu domínio local. 
                Siga as configurações abaixo para resolver o problema.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b">
          <Button
            variant={activeTab === 'n8n' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('n8n')}
          >
            Configuração n8n
          </Button>
          <Button
            variant={activeTab === 'docker' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('docker')}
          >
            Docker Compose
          </Button>
          <Button
            variant={activeTab === 'env' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('env')}
          >
            Variáveis de Ambiente
          </Button>
        </div>

        {/* Conteúdo das tabs */}
        <div className="space-y-4">
          {activeTab === 'n8n' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Acesse o arquivo de configuração do n8n</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Localize o arquivo <code className="bg-gray-100 px-1 rounded">.env</code> na raiz do seu projeto n8n.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Adicione as configurações de CORS</h4>
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{n8nConfig}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(n8nConfig, "Configuração CORS")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. Reinicie o n8n</h4>
                <p className="text-sm text-gray-600">
                  Após adicionar as configurações, reinicie o serviço n8n para aplicar as mudanças.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'docker' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Configuração via Docker Compose</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Se você está usando Docker, use este arquivo <code className="bg-gray-100 px-1 rounded">docker-compose.yml</code>:
                </p>
              </div>

              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{dockerConfig}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(dockerConfig, "Docker Compose")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Comandos para executar:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-600" />
                    <code className="bg-blue-100 px-2 py-1 rounded text-sm">
                      docker-compose down
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-600" />
                    <code className="bg-blue-100 px-2 py-1 rounded text-sm">
                      docker-compose up -d
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Variáveis de Ambiente Principais</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Estas são as variáveis mais importantes para resolver problemas de CORS:
                </p>
              </div>

              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">N8N_CORS_ALLOW_ORIGIN</h5>
                      <p className="text-sm text-gray-600">Permite origens específicas ou todas (*)</p>
                    </div>
                    <Badge variant="outline">*</Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">N8N_CORS_ALLOW_CREDENTIALS</h5>
                      <p className="text-sm text-gray-600">Permite credenciais nas requisições</p>
                    </div>
                    <Badge variant="outline">true</Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">N8N_CORS_ALLOW_METHODS</h5>
                      <p className="text-sm text-gray-600">Métodos HTTP permitidos</p>
                    </div>
                    <Badge variant="outline">GET,POST,PUT,DELETE,OPTIONS</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Teste de conexão */}
        <div className="space-y-4">
          <h4 className="font-medium">Teste de Conexão</h4>
          <p className="text-sm text-gray-600">
            Após configurar o CORS, teste a conexão usando este comando:
          </p>

          <div className="relative">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{testCommand}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(testCommand, "Comando de teste")}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Resposta Esperada</h4>
                <p className="text-sm text-green-700 mt-1">
                  Se a configuração estiver correta, você deve receber uma resposta HTTP 200 
                  sem erros de CORS.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links úteis */}
        <div className="space-y-3">
          <h4 className="font-medium">Links Úteis</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://docs.n8n.io/hosting/environment-variables/environment-variables/', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentação n8n
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Guia CORS
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 