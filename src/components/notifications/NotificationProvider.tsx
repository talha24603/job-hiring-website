"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"

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
  const session = useSession()
  const user = session.data?.user
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  const fetchNotifications = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(`/api/notifications/${user.id}`)
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

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [session])

  // Set up real-time updates (could be replaced with WebSockets for production)
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        fetchNotifications()
      }
    }, 60000) // Refresh every minute

    return () => clearInterval(interval)
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
