import { signOut } from "@/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import React from "react";
  
  export default function NavDropdowmMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    return (
      <DropdownMenu open={open} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <button className="hidden" aria-hidden="true">Open</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="center" className="mt-2 bg-white border border-gray-200 shadow-lg rounded-md">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem onClick={()=>signOut}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  