import { cn } from "@/lib/utils"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import { Room, RoomMessage } from "@/types"
import { useState, useEffect } from "react"
import { useParams } from "react-router"
import { BACKEND_URL } from "@/const"

export default function Chat({ className, ...props }: React.ComponentProps<"div">) {
  const [messages, setMessages] = useState<RoomMessage[]>([])
  const [room, setRoom] = useState<Room | null>(null)
  const [input, setInput] = useState<string>("")
  const { room_id } = useParams()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/rooms/${room_id}/messages`)
        if (response.ok) {
          const { data: data } = await response.json()
          setMessages(data)
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
        console.error(`Failed to fetch messages of room ${room_id}:`, error)
      }
    }

    fetchMessages()
    fetchRoom()
  }, [room_id])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // void append({ content: input, role: "user" })
    console.log("Submitting message:", input)
    setInput("")
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
          className,
        )}
        {...props}
      >
        {room && (
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold">{room.name}</h1>
          </div>)}
        <div className="flex-1 content-center overflow-y-auto px-6">{messages.length ? messageList : null}</div>
        <form
          onSubmit={handleSubmit}
          className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
        >
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={(v) => setInput(v)}
            value={input}
            placeholder="Enter a message"
            className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="absolute bottom-1 right-1 size-6 rounded-full">
                <ArrowUpIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Submit</TooltipContent>
          </Tooltip>
        </form>
      </div >
  )
}
