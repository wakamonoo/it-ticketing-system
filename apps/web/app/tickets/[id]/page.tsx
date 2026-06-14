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
  const [user, setUser] = useState<any>(null);
  const [assignedToId, setAssignedToId] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [ticketData, activityData, departmentUserData, userData] =
          await Promise.all([
            apiFetch(`/tickets/${id}`),
            apiFetch(`/tickets/${id}/activity`),
            apiFetch("/users/department"),
            apiFetch("/users/me"),
          ]);

        setTicket(ticketData);
        setActivity(activityData);
        setUsers(departmentUserData);
        setUser(userData);
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

  const cannotAssign =
    ticket?.status === "RESOLVED" || ticket?.status === "CLOSED";

  const cannotEscalate =
    ticket?.status === "RESOLVED" ||
    ticket?.status === "CLOSED" ||
    ticket?.currentDepartment.name === "Infrastructure";

  const cannotResolve =
    ticket?.status === "RESOLVED" || ticket?.status === "CLOSED";

  const cannotClose = ticket?.status !== "RESOLVED";

  if (loading) return <div className="p-6">loading...</div>;

  if (!ticket) return <div className="p-6">ticket not found</div>;

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="border p-4 rounded bg-amber-200">
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <p className="text-gray-600">{ticket.description}</p>

          <div className="mt-3 text-sm space-y-1">
            <p>Status: {ticket.status}</p>
            <p>Type: {ticket.ticketType.name}</p>
            <p>Department: {ticket.currentDepartment.name}</p>
            <p>Created By: {ticket.createdBy.name}</p>
            <p>Assigned To: {ticket.assignedTo?.name ?? "Unassigned"}</p>
          </div>

          <div className="mt-4">
            <p className="font-bold py-2">Ticket Activity</p>
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
          </div>

          {user.role === "DEPARTMENT_MEMBER" ? (
            <div className="mt-2 border p-4 rounded space-y-2">
              <h2 className="text-xl font-semibold">Actions</h2>

              <div className="flex gap-2 flex-wrap">
                <select
                  className="border p-2"
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                      className="text-black"
                    >
                      {user.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={assignTicket}
                  disabled={cannotAssign}
                  className={`text-white px-3 py-1 rounded  duration-200 transition-all ${cannotAssign ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500 hover:opacity-80  cursor-pointer"}`}
                >
                  Assign
                </button>

                <button
                  onClick={escalateTicket}
                  disabled={cannotEscalate}
                  className={`text-white px-3 py-1 rounded  duration-200 transition-all ${cannotEscalate ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500 hover:opacity-80  cursor-pointer"}`}
                >
                  Escalate
                </button>

                <button
                  onClick={resolveTicket}
                  disabled={cannotResolve}
                  className={`text-white px-3 py-1 rounded  duration-200 transition-all ${cannotResolve ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500 hover:opacity-80  cursor-pointer"}`}
                >
                  Resolve
                </button>

                <button
                  onClick={closeTicket}
                  disabled={cannotClose}
                  className={`text-white px-3 py-1 rounded  duration-200 transition-all ${cannotClose ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500 hover:opacity-80  cursor-pointer"}`}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-xs opacity-60">
                Actions only availble for Department Members
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
