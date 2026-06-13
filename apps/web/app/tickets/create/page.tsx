"use client";

import { apiFetch } from "@/app/services/api";
import ProtectedRoute from "@/components/protectedRoute";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTicketPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ticketTypeId, setTicketTypeId] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await apiFetch("/tickets", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          ticketTypeId,
        }),
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("create ticket error", err);
      alert("failed to create ticket");
    }
  }

  return (
    <ProtectedRoute>
      {" "}
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-96">
          <h1 className="text-2xl font-bold">Create Ticket</h1>
          <input
            className="border p-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="border p-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="border p-2"
            placeholder="Ticket Type Id"
            value={ticketTypeId}
            onChange={(e) => setTicketTypeId(e.target.value)}
          />
        </form>

        <button className="bg-black text-white p-2">Create</button>
      </div>
    </ProtectedRoute>
  );
}
