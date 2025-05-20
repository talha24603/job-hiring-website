"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { useSocket } from "@/lib/socket-service"

export interface Notification {
  id: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  userId: string
  jobPostId?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  fetchNotifications: () => Promise<void>
  loading: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const userId = session?.user?.id as string

  // Connect to the Socket.IO server
  const { socket, isConnected } = useSocket(userId)

  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  const fetchNotifications = async () => {
    if (!session?.user) {
      setLoading(false)
      return
    }
    const id = session.user.id as string
    try {
      setLoading(true)
      const response = await axios.get(`/api/notifications/${id}`)
      setNotifications(response.data)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}`, { isRead: true })
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
      )
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.patch("/api/notifications/mark-all-read")
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  // Listen for new notifications via Socket.IO
  useEffect(() => {
    if (socket && isConnected) {
      const handleNotification = (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev])

        // Optionally show a toast or play a sound
        try {
          // Play notification sound if available
          const audio = new Audio("/notification1.mp3")
          audio.play().catch((e) => console.log("Audio play prevented:", e))

          // You can also show a browser notification
          if (Notification.permission === "granted") {
            new Notification("New Notification", {
              body: notification.message,
              icon: "/favicon.ico",
            })
          }
        } catch (e) {
          console.log("Notification feature not available")
        }
      }

      socket.on("notification", handleNotification)

      return () => {
        socket.off("notification", handleNotification)
      }
    }
  }, [socket, isConnected])

  // Initial fetch of notifications
  useEffect(() => {
    if (session?.user) {
      fetchNotifications()
    }
  }, [session])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
        loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
