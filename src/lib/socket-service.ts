"use client"

import io, { type Socket } from "socket.io-client"
import { useEffect, useState } from "react"

// Socket instance that will be shared across the app
let socket: Socket | null = null

// URL for the Socket.IO server
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"

// Initialize the socket connection
export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    })

    // Set up event listeners
    socket.on("connect", () => {
      console.log("Connected to notification server")
    })

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
    })

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from notification server:", reason)
    })
  }

  return socket
}

// Authenticate the socket connection with user ID
export const authenticateSocket = (userId: string) => {
  if (socket) {
    socket.emit("authenticate", userId)
  }
}

// Close the socket connection
export const closeSocket = () => {
  if (socket) {
    socket.close()
    socket = null
  }
}

// Custom hook to use the socket
export const useSocket = (userId?: string) => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize the socket
    const socketInstance = initializeSocket()

    // Update connection status
    const handleConnect = () => {
      setIsConnected(true)
      if (userId) {
        authenticateSocket(userId)
      }
    }

    const handleDisconnect = () => {
      setIsConnected(false)
    }

    socketInstance.on("connect", handleConnect)
    socketInstance.on("disconnect", handleDisconnect)

    // Set initial connection status
    setIsConnected(socketInstance.connected)

    // Authenticate if already connected and userId is provided
    if (socketInstance.connected && userId) {
      authenticateSocket(userId)
    }

    // Clean up event listeners
    return () => {
      socketInstance.off("connect", handleConnect)
      socketInstance.off("disconnect", handleDisconnect)
    }
  }, [userId])

  return { socket, isConnected }
}
