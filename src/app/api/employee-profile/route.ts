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

    // Retrieve fields from form data (id is omitted because the form doesn't send it)
    const name = formData.get("name") as string | null;
    const userId = formData.get("userId") as string | null;

    const email = formData.get("email") as string | null;
    const phone = formData.get("phone") as string | null;
    const skills = formData.get("skills") as string | null;
    const education = formData.get("education") as string | null;
    const linkedin = formData.get("linkedin") as string | null;
    const github = formData.get("github") as string | null;

    // Retrieve resume file (profilePic has been removed)
    const resumeFile = formData.get("resume") as File | null;
    console.log("Resume file received:", resumeFile);

    let resumeUrl = null;

    // Helper function to upload a file to Cloudinary
    const uploadFile = async (file: Blob) => {
      console.log('Uploading file to Cloudinary...');
    
      const buffer = Buffer.from(await file.arrayBuffer()); // Convert Blob to Buffer
    
      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "next-cloudinary-uploads",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) {
              console.error('Error uploading file to Cloudinary:', error);
              return reject(error);
            }
            if (!result || !result.secure_url) {
              return reject(new Error("Upload failed: No result returned"));
            }
            console.log('File uploaded to Cloudinary with URL:', result.secure_url);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    };
    
    // Upload resume file if it exists
    if (resumeFile && resumeFile instanceof Blob) {
      resumeUrl = await uploadFile(resumeFile);
    }
    

    // Save the updated profile in the database
    const candidateProfile = await prisma.employeeProfile.upsert({
      where: { email: email as string },
      update: {
        name: name as string,
        phone: phone as string,
        skills: skills as string,
        education: education as string,
        linkedin: linkedin as string,
        github: github as string,
        resumeUrl: resumeUrl as string,
      },
      create: {
        userId: userId as string,
        name: name as string,
        email: email as string,
        phone: phone as string,
        skills: skills as string,
        education: education as string,
        linkedin: linkedin as string,
        github: github as string,
        resumeUrl: resumeUrl as string,
      },
    });

    return NextResponse.json({ candidateProfile }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
