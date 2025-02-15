'use client'
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react"; 

export default function Navbar({ user }: { user?: any }) {
  const userImage = user?.image;
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 w-full border-green-700 bg-gradient-to-r from-[#fdfdfd] to-[#ffffff]">
      {/* Logo */}
      <div className="flex items-center gap-2 text-[#388E3C] text-2xl font-extrabold tracking-wide">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8 text-[#2E7D32]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 7V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1m4 0V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1m-14 0h14M4 7h16M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7"
          />
        </svg>
        Career<span className="text-[#1B5E20]">Connect</span>
      </div>

      <div className="flex flex-row items-center gap-5">
        {/* Navigation Links */}
        <ul className="flex space-x-6 text-[#263238] font-medium">
          <li>
            <Link
              href="/"
              className="hover:text-[#388E3C] text-gray-700 cursor-pointer transition-colors duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/news"
              className="hover:text-[#388E3C] text-gray-700 cursor-pointer transition-colors duration-200"
            >
              Newstand
            </Link>
          </li>
          <li>
            <Link
              href="/about-us"
              className="hover:text-[#388E3C] text-gray-700 cursor-pointer transition-colors duration-200"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/employer-profile"
              className="hover:text-[#388E3C] text-gray-700 cursor-pointer transition-colors duration-200"
            >
              My Profile
            </Link>
          </li>
        </ul>

        {/* Profile Image with Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#388E3C] cursor-pointer">
              {userImage ? (
                <Image
                  src={userImage}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/images/profile-image.webp"
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="center"
            sideOffset={5}
            className="bg-white border border-gray-200 shadow-lg rounded-md w-48"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/team">Team</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
