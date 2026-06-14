"use client";
import ProtectedRoute from "@/components/protectedRoute";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import Loader from "@/components/loader";

type Stats = {
  myTickets: number;
  openTickets: number;
  inProgressTickets: number;
  escalatedTickets: number;
  resolvedTickets: number;
  closedTickets: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, userData] = await Promise.all([
          apiFetch("/dashboard/stats"),
          apiFetch("/users/me"),
        ]);
        setStats(statsData);
        setUser(userData);
      } catch (err) {
        console.error("dashboard error:", err);
        setStats(null);
        setUser(null);
      }
    }

    load();
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-amber-800">TICKETING DASHBOARD</h1>
          <h4 className="text-lg font-bold">Hello {user?.name}!</h4>
        </div>

        {!stats ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-4 rounded bg-blue-100">
              My Tickets: {stats.myTickets}
            </div>

            <div className="border p-4 rounded bg-yellow-100">
              Open Tickets: {stats.openTickets}
            </div>

            <div className="border p-4 rounded bg-orange-100">
              In Progress Tickets: {stats.inProgressTickets}
            </div>

            <div className="border p-4 rounded bg-purple-100">
              Escalated Tickets: {stats.escalatedTickets}
            </div>

            <div className="border p-4 rounded bg-green-100">
              Resolved Tickets: {stats.resolvedTickets}
            </div>

            <div className="border p-4 rounded bg-gray-200">
              Closed Tickets: {stats.closedTickets}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
