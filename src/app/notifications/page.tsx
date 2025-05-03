"use client"

import type React from "react"

import { useState } from "react"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { formatDistanceToNow, format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Info, AlertTriangle, Bell, Trash2, Check, Filter } from "lucide-react"
import type { Notification } from "@/components/notifications/NotificationProvider"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, loading } = useNotifications()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedType, setSelectedType] = useState<string | null>(null)

  // Filter notifications based on active tab and selected type
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread" && notification.isRead) return false
    if (activeTab === "read" && !notification.isRead) return false
    if (selectedType && notification.type !== selectedType) return false
    return true
  })

  // Group notifications by date
  const groupedNotifications: Record<string, Notification[]> = {}

  filteredNotifications.forEach((notification) => {
    const date = new Date(notification.createdAt).toDateString()
    if (!groupedNotifications[date]) {
      groupedNotifications[date] = []
    }
    groupedNotifications[date].push(notification)
  })

  // Get unique notification types for filter
  const notificationTypes = Array.from(new Set(notifications.map((n) => n.type)))

  return (
    <div className="container max-w-4xl py-8 mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Notifications</h1>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setSelectedType(null)}>
            <Filter className="h-4 w-4" />
            {selectedType ? `Filter: ${selectedType}` : "All Types"}
          </Button>

          {activeTab === "unread" && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-green-600"
              onClick={markAllAsRead}
            >
              <Check className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Type filter buttons */}
      {notificationTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {notificationTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(selectedType === type ? null : type)}
              className={selectedType === type ? "bg-[#1dbf73] hover:bg-[#19a463]" : ""}
            >
              {type}
            </Button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No notifications found</h3>
            <p className="text-gray-500 max-w-md">
              {activeTab === "unread"
                ? "You have no unread notifications at the moment."
                : activeTab === "read"
                  ? "You have no read notifications."
                  : "You don't have any notifications yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([date, notifications]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(new Date(date), "MMMM d, yyyy")}
              </h3>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => Promise<void>
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMarkAsRead }) => {
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

  const getNotificationUrl = () => {
    if (notification.type === "JOB" && notification.jobPostId) {
      return `/apply-job/${notification.jobPostId}`
    }
    return "#"
  }

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
  const formattedTime = format(new Date(notification.createdAt), "h:mm a")

  const handleClick = async () => {
    if (!notification.isRead) {
      await onMarkAsRead(notification.id)
    }
  }

  return (
    <Card className={notification.isRead ? "" : "border-l-4 border-l-blue-500"}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm ${!notification.isRead ? "font-medium" : ""}`}>{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {timeAgo} at {formattedTime}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>

            {notification.type === "JOB" && notification.jobPostId && (
              <div className="mt-2">
                <Link
                  href={getNotificationUrl()}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  onClick={handleClick}
                >
                  View Job
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper functions
function isToday(dateString: string): boolean {
  return new Date(dateString).toDateString() === new Date().toDateString()
}

function isYesterday(dateString: string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return new Date(dateString).toDateString() === yesterday.toDateString()
}
