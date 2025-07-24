import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"
import { ChatTester } from "./chat-tester"
import { Bot } from "@/services/bot-service"

interface FloatingChatButtonProps {
  bot: Bot
  onTestComplete?: (success: boolean, message: string) => void
}

export function FloatingChatButton({ bot, onTestComplete }: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botão Flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          size="icon"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </Button>
      </div>

      {/* Chat Flutuante */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white rounded-lg shadow-2xl border">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Teste: {bot.nome}</h3>
                  <p className="text-sm text-gray-600">Chat de teste em tempo real</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-hidden p-2">
              <ChatTester
                webhookUrl={bot.webhookUrl}
                botName={bot.nome}
                onTestComplete={onTestComplete}
                compact={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
} 