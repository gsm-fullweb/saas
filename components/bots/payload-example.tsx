import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PayloadExampleProps {
  payload: any
}

export function PayloadExample({ payload }: PayloadExampleProps) {
  const [showRaw, setShowRaw] = useState(false)
  const { toast } = useToast()

  const copiarPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    toast({
      title: "Payload copiado",
      description: "Exemplo de payload copiado para a área de transferência",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Exemplo de Payload</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRaw(!showRaw)}
            >
              {showRaw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showRaw ? "Visual" : "JSON"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copiarPayload}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Este é o formato dos dados que serão enviados para seu webhook
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showRaw ? (
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(payload, null, 2)}
          </pre>
        ) : (
          <Tabs defaultValue="estrutura" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="estrutura">Estrutura</TabsTrigger>
              <TabsTrigger value="dados">Dados</TabsTrigger>
              <TabsTrigger value="exemplo">Exemplo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="estrutura" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📋 Estrutura Principal</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">conversa_id</Badge>
                      <span className="text-gray-600">ID único da conversa</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">contato</Badge>
                      <span className="text-gray-600">Dados do cliente</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">mensagem</Badge>
                      <span className="text-gray-600">Conteúdo da mensagem</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">agente</Badge>
                      <span className="text-gray-600">Dados do agente (se atribuído)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">empresa</Badge>
                      <span className="text-gray-600">Dados da empresa</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">metadata</Badge>
                      <span className="text-gray-600">Informações adicionais</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="dados" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">👤 Dados do Contato</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div><strong>nome:</strong> Nome completo do cliente</div>
                    <div><strong>telefone:</strong> Número do WhatsApp</div>
                    <div><strong>email:</strong> Email (se disponível)</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">💬 Dados da Mensagem</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div><strong>id:</strong> ID único da mensagem</div>
                    <div><strong>conteudo:</strong> Texto da mensagem</div>
                    <div><strong>tipo:</strong> texto, imagem, audio, video, documento</div>
                    <div><strong>timestamp:</strong> Data/hora da mensagem</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🏢 Dados da Empresa</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div><strong>id:</strong> ID da empresa</div>
                    <div><strong>nome:</strong> Nome da empresa</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="exemplo" className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📝 Exemplo Prático</h4>
                <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                  <div><strong>conversa_id:</strong> "conv-123456"</div>
                  <div><strong>contato.nome:</strong> "João Silva"</div>
                  <div><strong>contato.telefone:</strong> "+5511999999999"</div>
                  <div><strong>mensagem.conteudo:</strong> "Olá, preciso de ajuda com meu pedido"</div>
                  <div><strong>mensagem.tipo:</strong> "texto"</div>
                  <div><strong>agente.nome:</strong> "Maria Santos" (se atribuído)</div>
                  <div><strong>empresa.nome:</strong> "Minha Empresa"</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
} 