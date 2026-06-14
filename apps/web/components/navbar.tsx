"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  function logout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <nav className="border-b py-4 px-8 flex gap-4 bg-amber-800">
      <Link href={"/dashboard"}>
        <p className="font-bold text-white hover:text-black duration-200 transition-all">
          Dashboard
        </p>
      </Link>

      <Link href={"/tickets/create"}>
        <p className="font-bold text-white hover:text-black duration-200 transition-all">
          Create Ticket
        </p>
      </Link>

      <Link href={"/tickets/my"}>
        <p className="font-bold text-white hover:text-black duration-200 transition-all">
          My Tickets
        </p>
      </Link>

      <Link href={"/tickets/department"}>
        <p className="font-bold text-white hover:text-black duration-200 transition-all">
          Department Queue
        </p>
      </Link>

      <button
        onClick={logout}
        className="ml-auto font-bold text-white hover:text-black duration-200 transition-all cursor-pointer"
      >
        Logout
      </button>
    </nav>
  );
}
