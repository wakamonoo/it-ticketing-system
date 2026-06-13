"use client";
import ProtectedRoute from "@/components/protectedRoute";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, []);
  return (
    <ProtectedRoute>
      <div className="p-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
    </ProtectedRoute>
  );
}
