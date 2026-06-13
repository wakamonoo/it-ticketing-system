"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/login") {
    return null;
  }

  function logout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <nav className="border-b p-4 flex gap-4">
      <Link href={"/dashboard"}>Dashboard</Link>

      <Link href={"/tickets/create"}>Create Ticket</Link>

      <Link href={"/tickets/my"}>My Tickets</Link>

      <Link href={"/tickets/department"}>Department Queue</Link>

      <button onClick={logout} className="ml-auto">
        Logout
      </button>
    </nav>
  );
}
