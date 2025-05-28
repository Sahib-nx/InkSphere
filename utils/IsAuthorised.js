// hooks/useAuthCheck.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const useAuthCheck = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);     // Is user logged in?
  const [authLoading, setAuthLoading] = useState(true);    // Is auth check still running?

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/user/verifyToken", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          setAuthorized(true);
        } else {
          throw new Error("Unauthorized");
        }
      } catch (err) {
        toast.error("Bad Authentication! Kindly login again.");
        router.push("/logn");
      } finally {
        setAuthLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  return { authorized, authLoading };
};

export default useAuthCheck;
