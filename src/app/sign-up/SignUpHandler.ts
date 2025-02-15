'use server'
import prisma from '@/prismaClient';
import {hash}  from 'bcryptjs';
import React from 'react'
import { POST } from '../api/resend/route';

export default async function SignUpHandler(formData:FormData) {
    console.log("Form Data:", Object.fromEntries(formData.entries()));
    const alreadyEmail = await prisma.user.findUnique({
        where: {
            email: formData.get("email") as string,
            },

    })
    if (alreadyEmail) {
        return {alreadyIsAlready:"Already has email"}
    }
    const otp = Math.floor(Math.random() * 900000 + 100000).toString()
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const hasedPassword = await hash(password,10)
    const otpExpiry = new Date(Date.now() + 3600000)
    const sendEmail = await POST(email,otp)
    if (sendEmail) {
         await prisma.user.create({
            data: {
                name:formData.get("email") as string,

                email: email,
                password:hasedPassword,
                otp: otp,
                role:formData.get("role") as string,
                otpExpiresAt: otpExpiry
                },
        })
        
            return {redirectUrl: `verifyCode?email=${encodeURIComponent(email)}`};
        
    }
}
