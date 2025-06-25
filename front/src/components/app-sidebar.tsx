import { useEffect, useState, useRef } from "react"
import { Room } from "@/types"
import { Link } from "react-router"
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
import { Input } from "@/components/ui/input"
// const uFuzzy = require('@leeoniya/ufuzzy');
import uFuzzy from "@leeoniya/ufuzzy"
import { getBackendUrl } from "@/config"

type AppSidebarProps = {
  user: User | null
}

export function AppSidebar({ user }: AppSidebarProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const uf = useRef(new uFuzzy({ intraMode: 1, intraIns: 1 }))
  // Fetch rooms function to load and refresh room list
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/rooms`)
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
        <Input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
          placeholder="Filter room by name" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold">
            Rooms
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {rooms.map((room, id) => (
                searchTerm === "" ||
                uf.current.filter(rooms.map((r) => r.name), searchTerm)?.includes(id)
              ) && (
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
      <SidebarFooter className="px-4">
        {user ? (`${user.name}, ID:${user.id}`) : "Not logged in"}
      </SidebarFooter>
    </Sidebar>
  )
}
