import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // Retrieve files by their keys
    const identityCardFile = formData.get("identityCard") as File | null;
    const resumeFile = formData.get("resume") as File | null;
    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;

    let identityCardUrl = null;
    let resumeUrl = null;

    // Helper function to upload a file to Cloudinary
    // Helper function to upload a file to Cloudinary
    const uploadFile = async (file: File) => {
      console.log('Uploading file to Cloudinary...');
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Determine resource type based on file MIME type
      const isPDF = file.type === 'application/pdf';
    
      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          
          { 
            folder: "next-cloudinary-uploads", 
            
            resource_type: isPDF ? "raw" : "auto" ,
          },
          (error, result) => {
            if (error) {
              console.error('Error uploading file to Cloudinary:', error);
              return reject(error);
            }
            console.log('File uploaded to Cloudinary successfully.');
            if (!result || !result.secure_url) {
              console.error('Upload failed: No result returned');
              return reject(new Error("Upload failed: No result returned"));
            }
            console.log('File uploaded to Cloudinary with URL:', result.secure_url);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    };
    
  
      

    // Upload each file if it exists
    if (identityCardFile) {
      identityCardUrl = await uploadFile(identityCardFile);
    }
    if (resumeFile) {
      resumeUrl = await uploadFile(resumeFile);
    }
    console.log(identityCardUrl,resumeUrl);
    
    // Save the URLs in your database using Prisma
    const employee = await prisma.candidateApplication.create({
      data: {
        name:name as string,
        email: email as string,
        jobPostId:id as string,
        identityCardUrl:identityCardUrl as string,
        resumeUrl:resumeUrl as string,
        
      },
    });

    return NextResponse.json({ employee }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
