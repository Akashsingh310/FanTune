"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export function Appbar() {
const session = useSession();
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold">Beatify</div>
        <div>
            {session.data?.user && <button className="m-2 p-2 bg-blue-400 text-white rounded hover:bg-blue-500 focus:outline-none" onClick={() => signOut()}>Logout</button>}
            {!session.data?.user && <button className="m-2 p-2 bg-blue-400 text-white rounded hover:bg-blue-500 focus:outline-none" onClick={() => signIn()}>Sign In</button>}
        </div>
      </div>
    </div>
  );
}
