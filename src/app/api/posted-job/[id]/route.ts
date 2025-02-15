import prisma from "@/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req:Request,{params}:{params:{id:string}}) {
    try {
        const jobData = prisma.jobPost.findUnique({
            where: {
                id: params.id
                }
        })
        if (!jobData) {
            return NextResponse.json({error:"job not found"},{status:404})
        }
        return NextResponse.json({jobData})
    } catch (error) {
        return NextResponse.json({error:"server error"},{status:500})
    }

}