import { useState } from "react"
import { User } from "@/types"
import { BACKEND_URL } from "../const"

export function useAuthDialog() {
  const [usernameError, setUsernameError] = useState<string>("")
  const [user, setUser] = useState<User | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleUsernameSubmit = async (username: string) => {
    setIsConnecting(true)
    setUsernameError("")

    try {
      // Try to get existing user
      const response = await fetch(`${BACKEND_URL}/api/users/name/${username}`)

      if (response.ok) {
        // User exists
        const { data: user } = await response.json()
        setUser(user)
        console.log('User found:', user)
      } else {
        console.log('User not found, creating new user...')
        // User doesn't exist, create new user
        const createResponse = await fetch(`${BACKEND_URL}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: { name: username }
          }),
        })

        if (createResponse.ok) {
          const { data: newUser } = await createResponse.json()
          console.log('User created:', newUser)
          setUser(newUser)
        } else {
          setUsernameError('Failed to create user')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      setUsernameError('Connection error')
    } finally {
      setIsConnecting(false)
    }
  }

  return {
    user,
    usernameError,
    setUsernameError,
    isConnecting,
    setIsConnecting,
    handleUsernameSubmit,
  }
} 
