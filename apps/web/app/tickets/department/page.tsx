"use client";

import { apiFetch } from "@/app/services/api";
import ProtectedRoute from "@/components/protectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTicketAlt } from "react-icons/fa";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdBy: {
    name: string;
  };
};

export default function DepartmentPage() {
  const [unassigned, setUnassigned] = useState<Ticket[]>([]);
  const [assigned, setAssigned] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch("/tickets/department");

        setUnassigned(data.unassigned);
        setAssigned(data.assigned);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const statusColor: Record<string, string> = {
    OPEN: "bg-yellow-200",
    IN_PROGRESS: "bg-orange-200",
    ESCALATED: "bg-purple-200",
    RESOLVED: "bg-green-200",
    CLOSED: "bg-gray-200",
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-8">
        <h1 className="text-3xl font-bold">Department Qeue</h1>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-200" />
            <p className="font-bold text-sm">Open</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-200" />
            <p className="font-bold text-sm">In Progress</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-200" />
            <p className="font-bold text-sm">Escalated</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-200" />
            <p className="font-bold text-sm">Resolved</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-200" />
            <p className="font-bold text-sm">Closed</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Unassigned Tickets</h2>

          <div className="space-y-3">
            {unassigned.length === 0 ? (
              <div className="flex flex-col items-center p-8">
                <FaTicketAlt className="text-4xl text-amber-600" />
                <p className="text-sm text-amber-600">No Unassigned Ticket</p>
              </div>
            ) : (
              unassigned.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className={`block border rounded p-4 hover:-translate-y-2 duration-200 transition-all ${statusColor[ticket.status] ?? "bg-amber-200"}`}
                >
                  <h3 className="font-semibold">{ticket.title}</h3>

                  <p>{ticket.description}</p>

                  <p className="text-sm text-gray-500">
                    {ticket.createdBy.name}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Assigned Tickets</h2>

          <div className="space-y-3">
            {assigned.length === 0 ? (
              <div className="flex flex-col items-center p-8">
                <FaTicketAlt className="text-4xl text-amber-600" />
                <p className="text-sm text-amber-600">No Unassigned Ticket</p>
              </div>
            ) : (
              assigned.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className={`block border rounded p-4 hover:-translate-y-2 duration-200 transition-all ${statusColor[ticket.status] ?? "bg-amber-200"}`}
                >
                  <h3 className="font-semibold">{ticket.title}</h3>

                  <p>{ticket.description}</p>

                  <p className="text-sm text-gray-500">
                    {ticket.createdBy.name}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
