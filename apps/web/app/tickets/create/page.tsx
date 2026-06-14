"use client";

import { apiFetch } from "@/app/services/api";
import ProtectedRoute from "@/components/protectedRoute";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function CreateTicketPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ticketTypeId, setTicketTypeId] = useState("");
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!ticketTypeId) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Please select ticket type!",
        icon: "error",
        showConfirmButton: true,
      });
      return
    }

    try {
      await apiFetch("/tickets", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          ticketTypeId,
        }),
      });

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Ticket created succefully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/dashboard");
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Kindly try again!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("create ticket error", err);
    }
  }

  useEffect(() => {
    async function loadTypes() {
      try {
        const data = await apiFetch("/ticketTypes");
        setTypes(data);
      } catch (err) {
        console.error("failed to load ticket types:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTypes();
  }, []);

  return (
    <ProtectedRoute>
      {" "}
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-96">
            <h1 className="text-2xl font-bold text-center">Create Ticket</h1>
            <input
              className="border p-2 rounded"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="border p-2 rounded"
              value={ticketTypeId}
              onChange={(e) => setTicketTypeId(e.target.value)}
            >
              <option value="">Select Ticket Type</option>
              {loading ? (
                <option disabled>Loading...</option>
              ) : (
                types.map((t) => (
                  <option key={t.id} value={t.id} className="text-black">
                    {t.name}
                  </option>
                ))
              )}
            </select>
            <button className="bg-blue-600 text-white p-2 rounded-2xl cursor-pointer hover:opacity-80 duration-200 transition-all">
              Create
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
