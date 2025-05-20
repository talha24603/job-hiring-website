// src/components/DeleteJobDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface DeleteJobDialogProps {
  openDelete: boolean;
  setOpenDelete: (open: boolean) => void;
  deleteJobId: string;
  onDeleteSuccess?: () => void;
}

export default function DeleteJobDialog({
  openDelete,
  setOpenDelete,
  deleteJobId,
  onDeleteSuccess,
}: DeleteJobDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/delete-job/${deleteJobId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete job');
      }

      // Call success callback if provided
      onDeleteSuccess?.();
      
      // Close the dialog
      setOpenDelete(false);
    } catch (error: any) {
      console.error("Error while deleting job:", error);
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setOpenDelete(false);
  };

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogTrigger asChild>
        <span></span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Job</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this job? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="text-red-500 text-sm mb-4">
            Error: {error}
          </div>
        )}
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </Button>
          <Button 
            onClick={handleCancel} 
            disabled={isDeleting}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}