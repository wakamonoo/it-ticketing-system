"use client";

import { apiFetch } from "@/app/services/api";
import ProtectedRoute from "@/components/protectedRoute";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
  userMessage?: string;
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
  const [showEscalatedModal, setShowEscalatedModal] = useState(false);
  const [escalatedMessage, setEscalatedMessage] = useState("");
  const [showResolvedModal, setShowResolvedModal] = useState(false);
  const [resolvedMessage, setResolvedMessage] = useState("");
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [closedMessage, setClosedMessage] = useState("");
  const router = useRouter();

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

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Ticket assigned succefully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      router.replace("/tickets/department");
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Kindly try again!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("CLOSE ERROR:", err);
      router.replace("/tickets/department");
    }
  }

  async function escalateTicket() {
    try {
      await apiFetch(`/tickets/${id}/escalate`, {
        method: "PATCH",
        body: JSON.stringify({
          userMessage: escalatedMessage,
        }),
      });

      setShowEscalatedModal(false);
      setEscalatedMessage("");

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Ticket escalated succefully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      router.replace("/tickets/department");
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Kindly try again!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("CLOSE ERROR:", err);
      router.replace("/tickets/department");
    }
  }

  async function resolveTicket() {
    try {
      await apiFetch(`/tickets/${id}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({
          userMessage: resolvedMessage,
        }),
      });

      setShowResolvedModal(false);
      setResolvedMessage("");

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Ticket resolved succefully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      router.replace("/tickets/department");
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Kindly try again!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("CLOSE ERROR:", err);
      router.replace("/tickets/department");
    }
  }

  async function closeTicket() {
    try {
      await apiFetch(`/tickets/${id}/close`, {
        method: "PATCH",
        body: JSON.stringify({
          userMessage: closedMessage,
        }),
      });

      setShowClosedModal(false);
      setClosedMessage("");

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Ticket closed succefully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      router.replace("/tickets/department");
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Kindly try again!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("CLOSE ERROR:", err);
      router.replace("/tickets/department");
    }
  }

  const statusColor: Record<string, string> = {
    OPEN: "bg-yellow-200",
    IN_PROGRESS: "bg-orange-200",
    ESCALATED: "bg-purple-200",
    RESOLVED: "bg-green-200",
    CLOSED: "bg-gray-200",
  };

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
      <>
        <div className="p-6 space-y-6">
          <div
            className={`border p-4 rounded ${statusColor[ticket.status] ?? "bg-amber-200"}`}
          >
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
            <p className="text-gray-600">{ticket.description}</p>

            <div className="mt-3 text-sm space-y-1">
              <p className="font-sm">
                <span className="font-semibold">Status: </span>
                {ticket.status}
              </p>
              <p className="font-sm">
                <span className="font-semibold">Type: </span>
                {ticket.ticketType.name}
              </p>
              <p className="font-sm">
                <span className="font-semibold">Department: </span>
                {ticket.currentDepartment.name}
              </p>
              <p className="font-sm">
                <span className="font-semibold">Created by: </span>
                {ticket.createdBy.name}
              </p>
              <p className="font-sm">
                <span className="font-semibold">Assigned to: </span>
                {ticket.assignedTo?.name ?? "Unassigned"}
              </p>
            </div>

            <div className="mt-4 border-t">
              <p className="font-bold py-2 text-lg">Activity Log</p>
              <div className="space-y-2">
                {activity.map((a) => (
                  <div key={a.id} className="text-sm border-b pb-2">
                    <p className="font-bold text-base">{a.type}</p>
                    <p className="font-sm">{a.message}</p>
                    {a.userMessage && (
                      <p className="font-sm">
                        <span className="font-semibold">
                          Remarks:{" "}
                        </span>
                        {a.userMessage}
                      </p>
                    )}
                    <p className="text-gray-500">
                      by {a.user.name} |{" "}
                      {new Date(a.createdAt).toLocaleString()}
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
                    title={
                      cannotAssign
                        ? "This ticket is already marked as resolved or closed"
                        : "Assign ticket"
                    }
                    className={`text-white px-3 py-1 rounded  duration-200 transition-all ${cannotAssign ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500 hover:opacity-80  cursor-pointer"}`}
                  >
                    Assign
                  </button>

                  <button
                    onClick={() => setShowEscalatedModal(true)}
                    disabled={cannotEscalate}
                    title={
                      cannotEscalate
                        ? "This ticket is already marked as either resolved, closed or in the last pipeline"
                        : "Escalate ticket"
                    }
                    className={`text-white px-3 py-1 rounded  duration-200 transition-all ${cannotEscalate ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500 hover:opacity-80  cursor-pointer"}`}
                  >
                    Escalate
                  </button>

                  <button
                    onClick={() => setShowResolvedModal(true)}
                    disabled={cannotResolve}
                    title={
                      cannotResolve
                        ? "This ticket is already marked as resolved or closed"
                        : "Resolve ticket"
                    }
                    className={`text-white px-3 py-1 rounded  duration-200 transition-all ${cannotResolve ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500 hover:opacity-80  cursor-pointer"}`}
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() => setShowClosedModal(true)}
                    disabled={cannotClose}
                    title={
                      cannotClose
                        ? "This ticket must be resolved first"
                        : "Close ticket"
                    }
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
        {showEscalatedModal && (
          <div
            onClick={() => setShowEscalatedModal(false)}
            className="inset-0 z-100 backdrop-blur-xs flex items-center justify-center fixed"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-amber-200 p-6 rounded w-84 space-y-4"
            >
              <h2 className="text-xl font-bold">Escalate Ticket</h2>

              <textarea
                className="w-full border p-2 rounded"
                placeholder="Optional message for the next department..."
                value={escalatedMessage}
                onChange={(e) => setEscalatedMessage(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEscalatedModal(false)}
                  className="bg-red-400 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-80 duration-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={escalateTicket}
                  className="bg-blue-600 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-80 duration-200 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {showResolvedModal && (
          <div
            onClick={() => setShowResolvedModal(false)}
            className="inset-0 z-100 backdrop-blur-xs flex items-center justify-center fixed"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-amber-200 p-6 rounded w-84 space-y-4"
            >
              <h2 className="text-xl font-bold">Resolve Ticket</h2>

              <textarea
                className="w-full border p-2 rounded"
                placeholder="Optional message for the next department..."
                value={resolvedMessage}
                onChange={(e) => setResolvedMessage(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowResolvedModal(false)}
                  className="bg-red-400 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-80 duration-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={resolveTicket}
                  className="bg-blue-600 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-80 duration-200 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {showClosedModal && (
          <div
            onClick={() => setShowClosedModal(false)}
            className="inset-0 z-100 backdrop-blur-xs flex items-center justify-center fixed"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-amber-200 p-6 rounded w-84 space-y-4"
            >
              <h2 className="text-xl font-bold">Close Ticket</h2>

              <textarea
                className="w-full border p-2 rounded"
                placeholder="Optional message for the next department..."
                value={closedMessage}
                onChange={(e) => setClosedMessage(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowClosedModal(false)}
                  className="bg-red-400 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-80 duration-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={closeTicket}
                  className="bg-blue-600 text-white py-2 px-4 rounded-2xl cursor-pointer hover:opacity-80 duration-200 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </ProtectedRoute>
  );
}
