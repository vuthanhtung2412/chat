import { useEffect, useState } from "react"
import { Room } from "@/types"
import { Link } from "react-router"
import { BACKEND_URL } from "@/const"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { User } from "@/types"
import { NewRoomDialog } from "./new-room-dialog"

type AppSidebarProps = {
  user: User | null
}

export function AppSidebar({ user }: AppSidebarProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  // Fetch rooms function to load and refresh room list
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms`)
      if (response.ok) {
        const { data } = await response.json()
        setRooms(data)
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    }
  }
  // Initial load of rooms
  useEffect(() => {
    fetchRooms()
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <NewRoomDialog onRoomCreated={fetchRooms} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Rooms</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {rooms.map((room) => (
                <SidebarMenuItem key={room.name}>
                  <SidebarMenuButton asChild>
                    <Link to={`/rooms/${room.id}`}>{room.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup 
      </SidebarContent>
      <SidebarFooter className="px-4">
        {user ? (`${user.name}, ID:${user.id}`) : "Not logged in"}
      </SidebarFooter>
    </Sidebar>
  )
}
