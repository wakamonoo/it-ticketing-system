"use client";

import { apiFetch } from "@/app/services/api";
import ProtectedRoute from "@/components/protectedRoute";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
  closedAt?: string;
  ticketType: { name: string };
  createdBy: { name: string };
  assignedTo?: { name: string };
  currentDepartment: { name: string };
};

type Activity = {
  id: string;
  type: string;
  message?: string;
  createdAt: string;
  user: {
    name: string;
  };
};

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [assignedToId, setAssignedToId] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [ticketData, activityData] = await Promise.all([
          apiFetch(`/tickets/${id}`),
          apiFetch(`/tickets/${id}/activity`),
        ]);

        const departmentUser = await apiFetch("/users/department");

        setTicket(ticketData);
        setActivity(activityData);
        setUsers(departmentUser);
      } catch (err) {
        console.error("load ticker error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  async function assignTicket() {
    try {
      if (!assignedToId) {
        alert("Select a user first");
        return;
      }

      await apiFetch(`/tickets/${id}/assign`, {
        method: "PATCH",
        body: JSON.stringify({
          assignedToId,
        }),
      });

      window.location.reload();
    } catch (err) {
      console.error("ASSIGN ERROR:", err);
    }
  }

  async function escalateTicket() {
    try {
      await apiFetch(`/tickets/${id}/escalate`, {
        method: "PATCH",
      });

      window.location.reload();
    } catch (err) {
      console.error("ESCALATE ERROR:", err);
    }
  }

  async function resolveTicket() {
    try {
      await apiFetch(`/tickets/${id}/resolve`, {
        method: "PATCH",
      });

      window.location.reload();
    } catch (err) {
      console.error("RESOLVE ERROR:", err);
    }
  }

  async function closeTicket() {
    try {
      await apiFetch(`/tickets/${id}/close`, {
        method: "PATCH",
      });

      window.location.reload();
    } catch (err) {
      console.error("CLOSE ERROR:", err);
    }
  }

  if (loading) return <div className="p-6">loading...</div>;

  if (!ticket) return <div className="p-6">ticket not found</div>;

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="border p-4 rounded">
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <p className="text-gray-600">{ticket.description}</p>

          <div className="mt-3 text-sm space-y-1">
            <p>Status: {ticket.status}</p>
            <p>Type: {ticket.ticketType.name}</p>
            <p>Department: {ticket.currentDepartment.name}</p>
            <p>Created By: {ticket.createdBy.name}</p>
            <p>Assigned To: {ticket.assignedTo?.name ?? "Unassigned"}</p>
          </div>

          <div className="space-y-2">
            {activity.map((a) => (
              <div key={a.id} className="text-sm border-b pb-2">
                <p>{a.type}</p>
                <p className="text-gray-500">
                  by {a.user.name} | {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="border p-4 rounded space-y-2">
            <h2 className="text-xl font-semibold">Actions</h2>

            <div className="flex gap-2 flex-wrap">
              <select
                className="border p-2"
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <button
                onClick={assignTicket}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Assign
              </button>

              <button
                onClick={escalateTicket}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Escalate
              </button>

              <button
                onClick={resolveTicket}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Resolve
              </button>

              <button
                onClick={closeTicket}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
