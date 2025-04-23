import React from 'react'
import { CldUploadWidget } from 'next-cloudinary';

export default function uploadFiles() {
  return (
    <div>
      <CldUploadWidget uploadPreset='employeedata'></CldUploadWidget>
    </div>
  )
}
