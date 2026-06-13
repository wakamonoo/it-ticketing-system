"use client";
import ProtectedRoute from "@/components/protectedRoute";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

type Stats = {
  myTickets: number;
  openTickets: number;
  resolvedTickets: number;
  closedTickets: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch("/dashboard/stats");
        setStats(data);
      } catch (err) {
        console.error("dashboard error:", err);
      }
    }

    load();
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {!stats ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            My Tickets: {stats.myTickets}
          </div>

          <div className="border p-4 rounded">
            Open Tickets: {stats.openTickets}
          </div>

          <div className="border p-4 rounded">
            Resolved Tickets: {stats.resolvedTickets}
          </div>

          <div className="border p-4 rounded">
            Closed Tickets: {stats.closedTickets}
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
