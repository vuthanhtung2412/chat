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
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/rooms`)
        if (response.ok) {
          const { data: data } = await response.json()
          setRooms(data)
        }
      } catch (error) {
        console.error('Failed to fetch rooms:', error)
      }
    }

    fetchRooms()
  }, [])
  return (
    <Sidebar>
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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
