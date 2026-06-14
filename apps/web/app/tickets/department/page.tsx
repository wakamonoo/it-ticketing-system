"use client";

import { apiFetch } from "@/app/services/api";
import ProtectedRoute from "@/components/protectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-8">
        <h1 className="text-3xl font-bold">Department Qeue</h1>

        <div>
          <h2 className="text-xl font-semibold mb-4">Unassigned Tickets</h2>

          <div className="space-y-3">
            {unassigned.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="block border rounded p-4 bg-amber-200"
              >
                <h3 className="font-semibold">{ticket.title}</h3>

                <p>{ticket.description}</p>

                <p className="text-sm text-gray-500">{ticket.createdBy.name}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Assigned Tickets</h2>

          <div className="space-y-3">
            {assigned.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="block border rounded p-4 bg-amber-200"
              >
                <h3 className="font-semibold">{ticket.title}</h3>

                <p>{ticket.description}</p>

                <p className="text-sm text-gray-500">{ticket.createdBy.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
