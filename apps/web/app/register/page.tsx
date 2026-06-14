"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../services/api";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch("/departments");
        setDepartments(data);
      } catch (err) {
        console.error("failed to fetch departments:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          departmentId,
        }),
      });

      localStorage.setItem("token", data.token);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Registered succesfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed, kindly try again!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("registration error:", err);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">Select Department</option>
          {loading ? (
            <option disabled>Loading...</option>
          ) : (
            departments.map((d) => (
              <option key={d.id} value={d.id} className="text-black">
                {d.name}
              </option>
            ))
          )}
        </select>
        <button
          className="bg-blue-600 rounded-2xl text-white p-2 cursor-pointer hover:opacity-80 duration-200 transition-all"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
}
