'use client'
import React, { useCallback, useEffect } from 'react'
import { useSocket } from '@/context/socket'
import { Button } from '@/components/ui/button'
import peer from '../../../../service/peer'

export default function Page() {
  const [remoteSocketId, setRemoteSocketId] = React.useState('')
  const [myStream, setMyStream] = React.useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = React.useState<MediaStream | null>(null)
  const { socket } = useSocket()
  console.log('remoteStream',remoteStream);
  

  const handleNewUserJoined = ({ email, id }: { email: string; id: string }) => {
    setRemoteSocketId(id)
    console.log(`new user joined ${email}`)
  }

  const handleIncomingCall = useCallback(async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
   // console.log('incoming call', from, offer)
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    setMyStream(stream)
    const ans = await peer.getAnswer(offer)
    socket.emit("call-accepted", ({ to:from, ans }))


  }, [socket])

  const sendStream = useCallback(
    () => {
      if (myStream) {
        for (const track of myStream.getTracks()) {
          peer.peer.addTrack(track, myStream)
          console.log("[sendStream] Adding track:", track);

        }
      }

    },
    [myStream],
  )


  const handleCallAccept = useCallback(async ({ from, ans }: { from: string; ans: RTCSessionDescriptionInit }) => {

    await peer.setLocalDescription(ans)
    console.log('Call Accepted');
    sendStream()




  }, [sendStream])

  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      const offer = await peer.getOffer()
      socket.emit('call-user', { to: remoteSocketId, offer })
      setMyStream(stream)
    } catch (error) {
      console.error('Error accessing media devices.', error)
    }
  }, [remoteSocketId, socket])

  const handleNegoNeeded = useCallback(async () => {
    console.log('[handleNegoNeeded] negotiation needed event fired');
    const offer = await peer.getOffer();
    console.log('[handleNegoNeeded] new offer created:', offer);
    socket.emit('peer-nego-needed', { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);
  

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
    }
  }, [handleNegoNeeded])

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, [])

  const handleNegoNeededIncoming = useCallback(async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("peer-nego-done", { to: from, ans })

  }, [socket])

  const handleNegoNeedFinal = useCallback(
    async ({ ans }: { ans: RTCSessionDescriptionInit }) => {
      await peer.setLocalDescription(ans);
    },
    [],
  )


  useEffect(() => {
    socket.on('user-joined', handleNewUserJoined)
    socket.on('incoming-call', handleIncomingCall)
    socket.on('call-accepted', handleCallAccept)
    socket.on('peer-nego-needed', handleNegoNeededIncoming)
    socket.on('peer-nego-final', handleNegoNeedFinal)

    return () => {
      socket.off('user-joined', handleNewUserJoined)
      socket.off('incoming-call', handleIncomingCall)
      socket.off('call-accepted', handleCallAccept)
      socket.off('peer-nego-needed', handleNegoNeededIncoming)

      socket.off('peer-nego-final', handleNegoNeedFinal)

    }
  }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccept, handleNegoNeededIncoming, handleNegoNeedFinal])

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome!</h1>
        <h2 className="text-xl mb-6 text-gray-700">
          {remoteSocketId ? 'Connected' : 'No one in room'}
        </h2>
        <p className="mb-4 text-gray-600">My Stream</p>
        {remoteSocketId && (
          <Button
            onClick={handleCallUser}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded mb-6"
          >
            Call
          </Button>
        )}
        {myStream &&
        <Button
        onClick={sendStream}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px
        4 rounded mb-6"
        >Accept Call</Button>
}
        {myStream && (
          <div className="mx-auto border rounded-lg overflow-hidden" style={{ width: 300, height: 300 }}>
            <video
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%' }}
              ref={(video) => {
                if (video) {
                  video.srcObject = myStream;
                }
              }}
            />
          </div>
        )}
      </div>
      {remoteStream && (
        <div className="mx-auto border rounded-lg overflow-hidden" style={{ width: 300, height: 300 }}>
          <video
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%' }}
            ref={(video) => {
              if (video) {
                video.srcObject = remoteStream;
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
