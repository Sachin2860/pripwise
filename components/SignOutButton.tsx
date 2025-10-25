"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/Firebase/client";
import { signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { signOutAction } from "@/lib/actions/auth.action";
import { toast } from "sonner";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      
      await signOutAction();
      router.refresh();
      
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <Button onClick={handleSignOut} className="btn-secondary">
      Sign Out
    </Button>
  );
};

export default SignOutButton;