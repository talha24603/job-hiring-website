"use client"

import { useEffect } from "react"
import { initializeSocket, authenticateSocket } from "@/lib/socket-service"

interface SocketInitializerProps {
  userId: string
}

export default function SocketInitializer({ userId }: SocketInitializerProps) {
  useEffect(() => {
    // Initialize socket connection
    const socket = initializeSocket()

    // Authenticate with user ID
    if (socket.connected) {
      authenticateSocket(userId)
    } else {
      socket.on("connect", () => {
        authenticateSocket(userId)
      })
    }

    return () => {
      socket.off("connect")
    }
  }, [userId])

  return null // This component doesn't render anything
}
