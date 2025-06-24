import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UsernameDialogProps {
  isOpen: boolean
  onSubmit: (username: string) => void
  error?: string
  isConnecting?: boolean
}

export function UsernameDialog({ isOpen, onSubmit, error, isConnecting }: UsernameDialogProps) {
  const [username, setUsername] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onSubmit(username.trim())
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center">Join Online Chat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="text-white"
              disabled={isConnecting}
              autoFocus
            />
          </div>
          {error && (
            <Alert className="border-red-400/20 bg-red-900/20">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            disabled={!username.trim() || isConnecting}
            className="w-full"
          >
            {isConnecting ? "Authenticating..." : "Join Chat"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
