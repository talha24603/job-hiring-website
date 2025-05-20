'use client'
import React, { useMemo } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket;
}

const SocketContext = React.createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};



export const SocketProvider = (props: { children: React.ReactNode }) => {
  let socket = useMemo(
    () =>
      io(process.env.NEXT_PUBLIC_APP_URL, {
        path: '/api/socket', // this must match the path defined in your API route
      }), 
    []
  )
  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  )
}
