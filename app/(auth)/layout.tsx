import { checkAuth } from "@/lib/actions/auth.action"; 
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export const dynamic = 'force-dynamic';

const Authlayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await checkAuth();
  if (isUserAuthenticated) redirect("/");
  return <div className="auth-layout">{children}</div>;
};

export default Authlayout;