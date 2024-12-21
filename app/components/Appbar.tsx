"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Music, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Appbar() {
  const session = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <Link className="flex items-center justify-center" href="#">
          <Music className="h-6 w-6 mr-2 text-indigo-400" />
          <span className="font-bold text-xl text-white">FanTune</span>
        </Link>
        
        <nav className="ml-auto items-center space-x-4 sm:space-x-6 hidden md:flex">
          <Link className="text-sm font-medium text-gray-300 hover:text-indigo-400" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-gray-300 hover:text-indigo-400" href="#how-it-works">
            How It Works
          </Link>
          {session.data?.user && <button className="p-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600" onClick={() => signOut()}>Logout</button>}
          {!session.data?.user && <button className="p-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600" onClick={() => signIn()}>Sign In</button>}
          <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
            Get Started
          </Button>
        </nav>

        <button
          className="ml-auto md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <ChevronDown className={`h-6 w-6 text-gray-300 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}