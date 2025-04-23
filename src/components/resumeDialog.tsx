"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Download, CreditCard, X } from 'lucide-react'
import Image from "next/image"

interface IdCardDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  idCardUrl: string
  applicantName: string
}

export default function IdCardDialog({ open, setOpen, idCardUrl, applicantName }: IdCardDialogProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleDownload = () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a")
    link.href = idCardUrl
    link.download = `${applicantName.replace(/\s+/g, "_")}_ID.${getFileExtension(idCardUrl)}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getFileExtension = (url: string) => {
    // Extract file extension from URL or default to jpg
    const match = url.match(/\.([a-zA-Z0-9]+)($|\?)/)
    return match ? match[1] : "jpg"
  }

  const isImageFile = (url: string) => {
    const ext = getFileExtension(url).toLowerCase()
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)
  }

  const isPdfFile = (url: string) => {
    return getFileExtension(url).toLowerCase() === "pdf"
  }

  const handleLoad = () => {
    setLoading(false)
    setError(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            {applicantName}'s ID Card
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 min-h-[40vh] relative border rounded-md overflow-hidden bg-gray-50">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <p className="text-sm text-gray-500">Loading ID card...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-2 text-center p-4">
                <div className="rounded-full bg-red-100 p-3">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-lg font-medium text-gray-900">Unable to display ID card</p>
                <p className="text-sm text-gray-500 max-w-md">
                  The ID card might be in a format that can't be previewed. Please try downloading it instead.
                </p>
                <Button onClick={handleDownload} className="mt-2 gap-2">
                  <Download className="h-4 w-4" />
                  Download ID Card
                </Button>
              </div>
            </div>
          )}

          {/* Conditional rendering based on file type */}
          {isImageFile(idCardUrl) ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="relative max-w-full max-h-[60vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={idCardUrl || "/placeholder.svg"}
                  alt={`${applicantName}'s ID Card`}
                  className="max-h-[60vh] object-contain"
                  onLoad={handleLoad}
                  onError={handleError}
                  style={{ display: loading || error ? "none" : "block" }}
                />
              </div>
            </div>
          ) : isPdfFile(idCardUrl) ? (
            <iframe
              src={`${idCardUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full"
              onLoad={handleLoad}
              onError={handleError}
              style={{ display: loading || error ? "none" : "block" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-2 text-center p-4">
                <div className="rounded-full bg-yellow-100 p-3">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-lg font-medium text-gray-900">ID Card Preview Not Available</p>
                <p className="text-sm text-gray-500 max-w-md">
                  This file format cannot be previewed. Please download to view the ID card.
                </p>
                <Button onClick={handleDownload} className="mt-2 gap-2">
                  <Download className="h-4 w-4" />
                  Download ID Card
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            This document contains sensitive information and should be handled securely.
          </p>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            
