import prisma from "@/prismaClient";

export async function POST(req:Request) {
    try{
    const {userId,image} =await req.json();
    console.log('userId,image',{userId,image});
    
    const uploadImage = await prisma.user.update({
        where:{
            id:userId

        },
        data:{
            image:image 
        },
    })
    return new Response(JSON.stringify({image}),{status:201})
} catch (error) {
    return new Response(JSON.stringify({error:"something went wrong"}),{status:500})
}
}