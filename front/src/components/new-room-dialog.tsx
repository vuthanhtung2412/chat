import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CirclePlus } from 'lucide-react';
import { useState } from "react"
import { useNavigate } from "react-router"
import { getBackendUrl } from "@/config";
// Callback prop for refreshing parent room list
type NewRoomDialogProps = {
  onRoomCreated?: () => Promise<void> | void
}

export function NewRoomDialog({ onRoomCreated }: NewRoomDialogProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [roomName, setRoomName] = useState("Based Room")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${getBackendUrl()}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room: {
            name: roomName
          }
        })
      })

      if (response.ok) {
        const { data } = await response.json()
        setRoomName("Based Room")
        setOpen(false)
        // notify parent to refresh room list
        await onRoomCreated?.()
        navigate(`/rooms/${data.id}`)
      }
    } catch (error) {
      console.error('Failed to create room:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full flex items-center justify-center"
          variant="outline"
        >
          <CirclePlus className="mr-2 h-4 w-4" /> New Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Room</DialogTitle>
          </DialogHeader>
          <br />
          <Input
            id="name-1"
            name="name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room name"
            required
          />
          <br />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
