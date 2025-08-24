"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "./selector";
import { validateUserSession } from "@/utils/data/validate-sesion";

export function UserRoleRenderer({ user, admin, fallback }: any) {
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [error, setError] = useState(null);
  const userState = useAppSelector((state) => state.app.usuario);

  const fetchUserRole = async () => {
    setLoadingRole(true);
    try {
      const userRole: any = await validateUserSession();
      if (userRole === "none") {
        setRole(null);
        setError(null);
      }
      setRole(userRole);
      setError(null);
    } catch (error: any) {
      setRole(null);
      setError(error.message || "Error fetching user role");
    } finally {
      setLoadingRole(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [userState]);

  if (loadingRole) {
    return (
      <>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
        </div>
      </>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (role === "admin") {
    return admin;
  } else if (role === "user") {
    return user;
  } else if (userState === "none") {
    return fallback;
  } else {
    return fallback;
  }
}
