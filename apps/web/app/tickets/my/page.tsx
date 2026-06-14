"use client";

import { apiFetch } from "@/app/services/api";
import ProtectedRoute from "@/components/protectedRoute";
import { useEffect, useState } from "react";
import { FaTicketAlt } from "react-icons/fa";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  ticketType: {
    name: string;
  };
  assignedTo?: {
    name: string;
  };
};

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await apiFetch("/tickets/my");
        setTickets(data);
      } catch (err) {
        console.error("fetch tickets error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  if (loading) {
    return <div className="p-6">loading tickets...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center p-8">
            <FaTicketAlt className="text-4xl text-amber-600" />
            <p className="text-sm text-amber-600">You have no tickets created</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border p-4 rounded bg-amber-200">
                <h2 className="font-semibold">{ticket.title}</h2>
                <p className="text-sm text-gray-600">{ticket.description}</p>

                <div className="mt-2 text-sm">
                  <p>Status: {ticket.status}</p>
                  <p>Type: {ticket.ticketType?.name}</p>
                  <p>Assigned To: {ticket.assignedTo?.name || "Unassigned"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
