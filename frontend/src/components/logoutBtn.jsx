"use client";

import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include", // required to send cookie
      }
    );
    localStorage.removeItem("token");
    router.push("/admin-login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 w-full py-2 px-4 rounded-md text-white cursor-pointer hover:bg-red-600 transition-colors"
    >
      Log Out
    </button>
  );
}
