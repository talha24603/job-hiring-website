import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import React from 'react'
import { toast } from "sonner";

export default function UserImageChange({ open, setOpen, userId }: { open: boolean; setOpen: (open: boolean)=> void; userId:string  }) 
 {
    const [image, setImage] = useState<string | null>(null);
    console.log('image',image);
    

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    },

  });
  
    useEffect(() => {
        const uploadImage = async () => {
            console.log("Image before upload:", image) 
            console.log('userid',userId);
                       
            if (!image ) return;
          try {
            const response = await fetch("/api/update-user-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId,image }), // Wrap image in an object
            });
            const data = await response.json();
            console.log("Server response:", data); 
            if (!response.ok) {
              throw new Error("Failed to upload image");
            }
            if(response.ok){
              toast.info('image updated successfully')
            }
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        };
    
        uploadImage(); 
    
      
  },[image])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      
    </DialogHeader>
    <div className="flex flex-col items-center">
      <div
        {...getRootProps()}
        className="relative w-40 h-40 rounded-full border-4 border-green-600 flex items-center justify-center overflow-hidden shadow-lg cursor-pointer"
      >
        <input {...getInputProps()} />
        {image ? (
          <img src={image} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
            <Camera className="text-gray-500" size={40} />
            <span className="text-gray-500 text-sm">Upload Image</span>
          </div>
        )}
      </div>
      <Button onClick={() => setImage(null)} className="mt-4 bg-red-500 hover:bg-red-600">
        Remove Image
      </Button>
    </div>
  </DialogContent>
</Dialog>

  )
}
  