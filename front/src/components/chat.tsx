import { cn } from "@/lib/utils"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import { Room, RoomMessage } from "@/types"
import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router"
import { User } from "@/types"
import { BACKEND_URL } from "@/const"

type ChatProps = {
  user: User
}

// Phoenix WebSocket message format
type WSMessage = {
  topic: string;
  event: string;
  payload: {
    content?: string;
    userName?: string;
    insertedAt?: string;
    // For outgoing join and new_msg, payload: {message: string}
    message?: string;
    status?: string;
    response?: any;
  };
  ref?: string | null;
};

export default function Chat({ user }: ChatProps) {
  const [messages, setMessages] = useState<RoomMessage[]>([])
  const [room, setRoom] = useState<Room | null>(null)
  const [input, setInput] = useState<string>("")
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const { room_id } = useParams()
  const wsRef = useRef<WebSocket | null>(null)
  const refCounterRef = useRef<number>(1)

  // WebSocket connection and message handling
  useEffect(() => {
    if (!room_id || !user) return

    // Create WebSocket connection
    const wsUrl = `ws://localhost:4000/socket/websocket?user_id=${user.id}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)

      // Join the room
      const joinMessage: WSMessage = {
        topic: `room:${room_id}`,
        event: "phx_join",
        payload: {},
        ref: refCounterRef.current.toString()
      }
      ws.send(JSON.stringify(joinMessage))
      refCounterRef.current++
    }

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data)
        console.log('Received message:', message)

        // Handle join confirmation
        if (message.event === "phx_reply" && message.payload.status === "ok") {
          console.log('Successfully joined room')
          return
        }

        // Handle new messages
        if (message.event === "new_msg" && message.payload.content) {
          const newMessage: RoomMessage = {
            content: message.payload.content,
            userName: message.payload.userName || 'Unknown',
            insertedAt: message.payload.insertedAt || new Date().toISOString()
          }

          setMessages(prevMessages => [...prevMessages, newMessage])
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
    }

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [room_id, user])

  // Fetch initial messages and room data
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/rooms/${room_id}/messages`)
        if (response.ok) {
          const { data: data } = await response.json()
          setMessages((data as RoomMessage[]).reverse())
        }
      } catch (error) {
        console.error(`Failed to fetch messages of room ${room_id}:`, error)
      }
    }

    const fetchRoom = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/rooms/${room_id}`)
        if (response.ok) {
          const { data: data } = await response.json()
          setRoom(data)
        }
      } catch (error) {
        console.error(`Failed to fetch room ${room_id}:`, error)
      }
    }

    fetchMessages()
    fetchRoom()
  }, [room_id])

  const sendMessage = (messageContent: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected')
      return
    }

    const message: WSMessage = {
      topic: `room:${room_id}`,
      event: "new_msg",
      payload: { message: messageContent },
      ref: refCounterRef.current.toString()
    }

    wsRef.current.send(JSON.stringify(message))
    refCounterRef.current++
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className="max-w-[80%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
        >
          <strong>
            {message.userName}
          </strong>
          <br />
          {message.content}
        </div>
      ))}
    </div>
  )

  return (
    <div
      className={cn(
        "ring-none flex h-full w-full flex-col items-stretch border-none",
      )}
    >
      {room && (
        <div className="flex items-center justify-between border-b-2 px-6 py-4">
          <h1 className="text-2xl font-bold">{room.name}</h1>
          <div className={cn(
            "flex items-center gap-2 text-sm",
            isConnected ? "text-green-600" : "text-red-600"
          )}>
            <div className={cn(
              "h-2 w-2 rounded-full",
              isConnected ? "bg-green-600" : "bg-red-600"
            )} />
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>
      )}
      <div className="flex-1 content-center overflow-y-auto px-6">
        {messages.length ? messageList : null}
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
      >
        <AutoResizeTextarea
          onKeyDown={handleKeyDown}
          onChange={(v) => setInput(v)}
          value={input}
          placeholder={isConnected ? "Enter a message" : "Connecting..."}
          disabled={!isConnected}
          className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none disabled:opacity-50"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-1 right-1 size-6 rounded-full"
              disabled={!isConnected || !input.trim()}
            >
              <ArrowUpIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={12}>Submit</TooltipContent>
        </Tooltip>
      </form>
    </div>
  )
}
