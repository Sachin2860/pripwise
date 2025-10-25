import { checkAuth } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SignOutButton from "@/components/SignOutButton"; 

export const dynamic = 'force-dynamic';

const Rootlayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated= await checkAuth();
 if (!isUserAuthenticated) redirect('/sign-in');
  return (
    <div className="root-layout">
      <nav>
        <div className="flex justify-between items-center mb-2 py-6">
          <div className="flex items-center gap-2">
            <link href="/" />
            <img src="/logo.svg" alt="Logo" width={38} height={32} />
            <h2 className="text-primary-100 whitespace-nowrap">PrepWise</h2>
            <link/>
          </div>
          
          <SignOutButton />
        </div>
        
        {children}
      </nav>
    </div>
  );
};

export default Rootlayout;