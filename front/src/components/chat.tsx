import { cn } from "@/lib/utils"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import { Room, RoomMessage } from "@/types"
import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "react-router"
import { User } from "@/types"
import { BACKEND_URL, WS_URL } from "@/const"
import { ScrollArea } from "@radix-ui/react-scroll-area"

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
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const { room_id } = useParams()
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef<number>(0)
  const maxReconnectAttempts = 5

  // Clean up function
  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onopen = null
      wsRef.current.onmessage = null
      wsRef.current.onclose = null
      wsRef.current.onerror = null

      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "Component unmounting")
      }
      wsRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  // WebSocket connection function
  const connectWebSocket = useCallback(() => {
    if (!room_id || !user?.id) {
      console.error('Missing room_id or user.id')
      return
    }

    // Clean up existing connection
    cleanup()

    setIsConnecting(true)
    console.log(`Connecting to WebSocket for room ${room_id} and user ${user.id}`)

    // Create WebSocket connection
    const wsUrl = `${WS_URL}?user_id=${user.id}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
      setIsConnecting(false)
      reconnectAttemptsRef.current = 0

      // Join the room after connection is established
      const joinMessage: WSMessage = {
        topic: `room:${room_id}`,
        event: "phx_join",
        payload: {},
        ref: Date.now().toString() // Add reference for tracking
      }
      ws.send(JSON.stringify(joinMessage))
    }

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data)
        console.log('Received message:', message)

        // Handle join confirmation
        if (message.event === "phx_reply") {
          if (message.payload.status === "ok") {
            console.log('Successfully joined room')
          } else {
            console.error('Failed to join room:', message.payload.response)
          }
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

        // Handle presence updates if needed
        if (message.event === "presence_state" || message.event === "presence_diff") {
          console.log('Presence update:', message.payload)
          // Handle user presence updates here if needed
        }

      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason)
      setIsConnected(false)
      setIsConnecting(false)

      // Only attempt to reconnect if it wasn't a normal closure and we haven't exceeded max attempts
      if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000) // Exponential backoff, max 30s
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`)

        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1
          connectWebSocket()
        }, delay)
      } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached')
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
      setIsConnecting(false)
    }

  }, [room_id, user?.id, cleanup])

  // WebSocket connection effect
  useEffect(() => {
    connectWebSocket()

    // Cleanup on unmount or dependency change
    return cleanup
  }, [connectWebSocket, cleanup])

  // Fetch initial messages and room data
  useEffect(() => {
    if (!room_id) return

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/rooms/${room_id}/messages`)
        if (response.ok) {
          const { data } = await response.json()
          setMessages((data as RoomMessage[]).reverse())
        } else {
          console.error(`Failed to fetch messages: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        console.error(`Failed to fetch messages of room ${room_id}:`, error)
      }
    }

    const fetchRoom = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/rooms/${room_id}`)
        if (response.ok) {
          const { data } = await response.json()
          setRoom(data)
        } else {
          console.error(`Failed to fetch room: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        console.error(`Failed to fetch room ${room_id}:`, error)
      }
    }

    fetchMessages()
    fetchRoom()
  }, [room_id])

  const sendMessage = useCallback((messageContent: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected')
      return false
    }

    if (!messageContent.trim()) {
      console.error('Message content is empty')
      return false
    }

    const message: WSMessage = {
      topic: `room:${room_id}`,
      event: "new_msg",
      payload: { message: messageContent },
      ref: Date.now().toString()
    }

    try {
      wsRef.current.send(JSON.stringify(message))
      return true
    } catch (error) {
      console.error('Failed to send message:', error)
      return false
    }
  }, [room_id])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() && isConnected) {
      const success = sendMessage(input.trim())
      if (success) {
        setInput("")
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }


  // Add this useEffect to auto-scroll to bottom when messages change
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      {messages.map((message, index) => {
        const isLast = index === messages.length - 1;
        return (
          <div
            key={index}
            ref={isLast ? lastMessageRef : null}
          >
            <strong>{message.userName}</strong>
            <br />
            {message.content}
            <br />
            ---
          </div>
        );
      })}
    </div>
  );


  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      {/* Sticky header */}
      {room && (
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4 backdrop-blur-sm">
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

      {/* Scrollable content area (messages + input) */}
      <div className="flex flex-1 flex-col overflow-auto">
        <ScrollArea className="flex-1 px-6">
          {messages.length ? messageList : null}
        </ScrollArea>

        <div className="sticky bottom-0 border-t bg-background px-6 pb-6 pt-4">
          <form
            onSubmit={handleSubmit}
            className="border-input bg-card focus-within:ring-ring/10 relative flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
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
      </div>
    </div>
  );
}
