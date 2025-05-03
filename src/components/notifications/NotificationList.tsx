"use client"

import React from "react"
import { formatDistanceToNow } from "date-fns"
import { Check, BellOff, Briefcase, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useNotifications, type Notification } from "./NotificationProvider"
import Link from "next/link"

interface NotificationListProps {
  onClose?: () => void
}
const getNotificationIcon = (type: string) => {
    switch (type) {
      case "JOB":
        return <Briefcase className="h-5 w-5 text-blue-500" />
      case "ALERT":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "INFO":
      default:
        return <Info className="h-5 w-5 text-green-500" />
    }
  }
const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications()

 

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id)
    }
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[450px]">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[#1dbf73] hover:text-[#19a463] hover:bg-[#e4f9f0]"
            onClick={markAllAsRead}
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Mark all as read
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1dbf73]"></div>
            <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-gray-100 rounded-full p-3 mb-2">
              <BellOff className="h-6 w-6 text-gray-400" />
            </div>
            <h4 className="text-sm font-medium text-gray-700">No notifications yet</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
              We'll notify you when there are new messages or updates
            </p>
          </div>
        ) : (
          <div>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                {index > 0 && <Separator />}
                <NotificationItem notification={notification} onClick={() => handleNotificationClick(notification)} />
              </React.Fragment>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t text-center">
        <Link
          href="/notifications"
          className="text-xs text-[#1dbf73] hover:text-[#19a463] font-medium"
          onClick={onClose}
        >
          View all notifications
        </Link>
      </div>
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onClick: () => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })

  // Determine the URL based on notification type and jobPostId
  const getNotificationUrl = () => {
    if (notification.type === "JOB" && notification.jobPostId) {
      return `/apply-job/${notification.jobPostId}`
    }
    return "/notifications"
  }

  return (
    <Link href={getNotificationUrl()} onClick={onClick}>
      <div
        className={cn(
          "flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer",
          !notification.isRead && "bg-blue-50",
        )}
      >
        <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm", !notification.isRead && "font-medium")}>{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
        </div>
        {!notification.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>}
      </div>
    </Link>
  )
}

// Helper function to conditionally join class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}

export default NotificationList
