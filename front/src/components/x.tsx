import { Button } from '@/components/ui/button'
import { BACKEND_URL } from '@/const'
export default function X() {

  const createUser = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { name: "tung" }
        }),
      })

      if (!res.ok) {
        console.error('HTTP error:', res.status, res.statusText)
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json() // or res.text() if API returns plain text
      console.log('createUser', data)
      return data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  const listUsers = async () => {
    const res = await fetch(`${BACKEND_URL}/api/users`, {
      method: 'GET',
    })
    console.log('listUsers', await res.json())
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={createUser}>
        Create new user
      </Button>
      <Button onClick={listUsers}>
        Get all users
      </Button>
    </div>
  )
}
