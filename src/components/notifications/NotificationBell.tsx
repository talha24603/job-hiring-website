"use client"

import type React from "react"
import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useNotifications } from "./NotificationProvider"
import NotificationList from "./NotificationList"
import { cn } from "@/lib/utils"

interface NotificationBellProps {
  className?: string
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const { unreadCount } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("text-[#404145] hover:text-[#1dbf73] hover:bg-transparent relative", className)}
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationList onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}

export default NotificationBell
