"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../services/api";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem("token", data.token);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Login succesful",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/dashboard");
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Login failed, kindly try again!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("login error:", err);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
          <h1 className="text-2xl font-bold text-center">Login</h1>
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
          <button
            className="bg-blue-600 text-white p-2 rounded-2xl cursor-pointer hover:opacity-80 duration-200 transition-all"
            type="submit"
          >
            Login
          </button>
        </form>
        <button
          onClick={() => router.push("/register")}
          className="bg-red-400 text-white p-2 rounded-2xl cursor-pointer hover:opacity-80 duration-200 transition-all"
          type="submit"
        >
          Register
        </button>
      </div>
    </div>
  );
}
