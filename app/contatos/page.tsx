"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  Phone,
  Mail,
  MessageCircle,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Tag,
} from "lucide-react"
import type { Contato } from "@/lib/supabase"

// Mock data para demonstração
const mockContatos: Contato[] = [
  {
    id: "1",
    empresa_id: "1",
    telefone: "+5511999887766",
    nome: "João Silva",
    email: "joao@email.com",
    qualificacao: "cliente",
    tags: ["vip", "premium"],
    observacoes: "Cliente há 2 anos, sempre pontual nos pagamentos",
    criado_em: "2024-01-15T10:30:00Z",
    atualizado_em: "2024-01-20T14:20:00Z",
  },
  {
    id: "2",
    empresa_id: "1",
    telefone: "+5511888776655",
    nome: "Maria Santos",
    email: "maria@empresa.com",
    qualificacao: "lead",
    tags: ["interessado", "follow-up"],
    observacoes: "Demonstrou interesse no produto premium",
    criado_em: "2024-01-18T09:15:00Z",
    atualizado_em: "2024-01-18T09:15:00Z",
  },
  {
    id: "3",
    empresa_id: "1",
    telefone: "+5511777665544",
    nome: "Pedro Costa",
    email: null,
    qualificacao: "prospect",
    tags: ["potencial"],
    observacoes: null,
    criado_em: "2024-01-20T16:45:00Z",
    atualizado_em: "2024-01-20T16:45:00Z",
  },
  {
    id: "4",
    empresa_id: "1",
    telefone: "+5511666554433",
    nome: null,
    email: null,
    qualificacao: "spam",
    tags: ["bloqueado"],
    observacoes: "Mensagens promocionais não solicitadas",
    criado_em: "2024-01-19T11:20:00Z",
    atualizado_em: "2024-01-19T11:20:00Z",
  },
  {
    id: "5",
    empresa_id: "1",
    telefone: "+5511555443322",
    nome: "Ana Oliveira",
    email: "ana@startup.com",
    qualificacao: "cliente",
    tags: ["startup", "desconto"],
    observacoes: "Startup em crescimento, cliente desde o início",
    criado_em: "2024-01-10T08:00:00Z",
    atualizado_em: "2024-01-22T10:30:00Z",
  },
]

const qualificacaoColors = {
  lead: "bg-blue-100 text-blue-800",
  cliente: "bg-green-100 text-green-800",
  prospect: "bg-yellow-100 text-yellow-800",
  spam: "bg-red-100 text-red-800",
}

const qualificacaoLabels = {
  lead: "Lead",
  cliente: "Cliente",
  prospect: "Prospect",
  spam: "Spam",
}

export default function ContatosPage() {
  const [contatos] = useState<Contato[]>(mockContatos)
  const [busca, setBusca] = useState("")
  const [filtroQualificacao, setFiltroQualificacao] = useState<string>("todos")
  const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [novoContato, setNovoContato] = useState({
    nome: "",
    telefone: "",
    email: "",
    qualificacao: "lead" as Contato["qualificacao"],
    tags: "",
    observacoes: "",
  })

  // Filtrar contatos
  const contatosFiltrados = useMemo(() => {
    return contatos.filter((contato) => {
      const matchBusca =
        busca === "" ||
        contato.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        contato.telefone.includes(busca) ||
        contato.email?.toLowerCase().includes(busca.toLowerCase())

      const matchQualificacao = filtroQualificacao === "todos" || contato.qualificacao === filtroQualificacao

      return matchBusca && matchQualificacao
    })
  }, [contatos, busca, filtroQualificacao])

  // Estatísticas
  const estatisticas = useMemo(() => {
    const total = contatos.length
    const leads = contatos.filter((c) => c.qualificacao === "lead").length
    const clientes = contatos.filter((c) => c.qualificacao === "cliente").length
    const prospects = contatos.filter((c) => c.qualificacao === "prospect").length
    const spam = contatos.filter((c) => c.qualificacao === "spam").length

    return { total, leads, clientes, prospects, spam }
  }, [contatos])

  const formatarTelefone = (telefone: string) => {
    return telefone.replace(/(\+55)(\d{2})(\d{5})(\d{4})/, "$1 ($2) $3-$4")
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  const iniciarConversa = (contato: Contato) => {
    // Aqui seria a lógica para iniciar uma nova conversa
    console.log("Iniciar conversa com:", contato.nome || contato.telefone)
  }

  const editarContato = (contato: Contato) => {
    setContatoSelecionado(contato)
    setNovoContato({
      nome: contato.nome || "",
      telefone: contato.telefone,
      email: contato.email || "",
      qualificacao: contato.qualificacao,
      tags: contato.tags?.join(", ") || "",
      observacoes: contato.observacoes || "",
    })
    setDialogAberto(true)
  }

  const salvarContato = () => {
    // Aqui seria a lógica para salvar o contato
    console.log("Salvar contato:", novoContato)
    setDialogAberto(false)
    setContatoSelecionado(null)
    setNovoContato({
      nome: "",
      telefone: "",
      email: "",
      qualificacao: "lead",
      tags: "",
      observacoes: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contatos</h1>
          <p className="text-muted-foreground">Gerencie sua base de contatos e leads</p>
        </div>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setContatoSelecionado(null)
                setNovoContato({
                  nome: "",
                  telefone: "",
                  email: "",
                  qualificacao: "lead",
                  tags: "",
                  observacoes: "",
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Contato
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{contatoSelecionado ? "Editar Contato" : "Novo Contato"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={novoContato.nome}
                    onChange={(e) => setNovoContato({ ...novoContato, nome: e.target.value })}
                    placeholder="Nome do contato"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={novoContato.telefone}
                    onChange={(e) => setNovoContato({ ...novoContato, telefone: e.target.value })}
                    placeholder="+5511999887766"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={novoContato.email}
                  onChange={(e) => setNovoContato({ ...novoContato, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualificacao">Qualificação</Label>
                  <Select
                    value={novoContato.qualificacao}
                    onValueChange={(value: Contato["qualificacao"]) =>
                      setNovoContato({ ...novoContato, qualificacao: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="spam">Spam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={novoContato.tags}
                    onChange={(e) => setNovoContato({ ...novoContato, tags: e.target.value })}
                    placeholder="vip, premium, desconto"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={novoContato.observacoes}
                  onChange={(e) => setNovoContato({ ...novoContato, observacoes: e.target.value })}
                  placeholder="Observações sobre o contato..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvarContato}>{contatoSelecionado ? "Salvar" : "Criar"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.leads}</p>
                <p className="text-xs text-muted-foreground">Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.clientes}</p>
                <p className="text-xs text-muted-foreground">Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.prospects}</p>
                <p className="text-xs text-muted-foreground">Prospects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.spam}</p>
                <p className="text-xs text-muted-foreground">Spam</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, telefone ou email..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filtroQualificacao} onValueChange={setFiltroQualificacao}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Qualificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="lead">Leads</SelectItem>
                <SelectItem value="cliente">Clientes</SelectItem>
                <SelectItem value="prospect">Prospects</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Contatos */}
      <div className="grid gap-4">
        {contatosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum contato encontrado</h3>
              <p className="text-muted-foreground">
                {busca || filtroQualificacao !== "todos"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece adicionando seu primeiro contato"}
              </p>
            </CardContent>
          </Card>
        ) : (
          contatosFiltrados.map((contato) => (
            <Card key={contato.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`/placeholder-user.jpg`} />
                      <AvatarFallback>{contato.nome ? contato.nome.charAt(0).toUpperCase() : "?"}</AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{contato.nome || "Sem nome"}</h3>
                        <Badge className={qualificacaoColors[contato.qualificacao]}>
                          {qualificacaoLabels[contato.qualificacao]}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {formatarTelefone(contato.telefone)}
                        </div>
                        {contato.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contato.email}
                          </div>
                        )}
                      </div>

                      {contato.tags && contato.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          {contato.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">Criado em {formatarData(contato.criado_em)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => iniciarConversa(contato)}>
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => editarContato(contato)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {contato.observacoes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Observações:</strong> {contato.observacoes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
