"use client";

import { useForm } from "react-hook-form";
import API from "@/util/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [apiError, setApiError] = useState("");

  const loginsubmit = async (data) => {
    try {
      const response = await API.post("/auth/login", data);

      router.push("/admin/dashboard");
      // TODO: redirect or save token
    } catch (err) {
      console.error("Login failed:", err);
      setApiError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <form
      className="bg-gray-50 border border-gray-200 shadow px-6 py-4 rounded-2xl w-full max-w-sm mx-auto mt-10"
      onSubmit={handleSubmit(loginsubmit)}
    >
      <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

      <div className="flex flex-col mb-4">
        <label className="pb-1 pl-1 font-medium">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="border border-gray-300 rounded-2xl px-3 py-2"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col mb-4">
        <label className="pb-1 pl-1 font-medium">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="border border-gray-300 rounded-2xl px-3 py-2"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {apiError && (
        <p className="text-red-600 text-sm text-center mb-3">{apiError}</p>
      )}

      <div className="flex items-center justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-500 px-6 py-2 text-white text-sm rounded-2xl disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}
