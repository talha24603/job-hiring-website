'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { useSocket } from '@/context/socket'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

export default function page() {
    const [email, setEmail] = useState('');
    const [roomId, setRoomId] = useState('');
    const { socket } = useSocket();
    const router = useRouter();

    const handleRoomJoin = (data: any) => {
        console.log(`Data from BE ${data}`);
        const { roomId } = data;
        router.push(`/video-call/room/${roomId}`)

    }

    const handleSubmitForm = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            socket.emit('join-room', { email, roomId });
        },
        [email, roomId, socket]

    )
    useEffect(() => {
        socket.on('join-room', handleRoomJoin);

        return () => {
            socket.off('join-room', handleRoomJoin);
        }

    }, [socket, handleRoomJoin])




    return (
        <div className=' h-screen flex flex-col gap-2 justify-center items-center'>
            <form onSubmit={handleSubmitForm} className='w-52 flex flex-col gap-2 justify-center items-center'>

                <Input
                    className=''
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    type='email'
                />
                <Input
                    className=''
                    placeholder='Enter your room code'
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    type='text'
                />
                <Button className='bg-white text-gray-500 border hover:bg-slate-100' type='submit'>Enter Room</Button>
            </form>
        </div>
    )
}
