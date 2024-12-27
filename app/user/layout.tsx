import React, { ReactNode } from "react";
import UserNav from "../components/UserNav";
// import { SessionProvider } from "next-auth/react";

interface LayoutProps {
    children: ReactNode;
}

const CustomLayout: React.FC<LayoutProps> = ({ children }) => {

    return (
      <div>
        {/* <SessionProvider> */}
            <UserNav />
            <main className="absolute w-full right-0 z-8">
                {children}
            </main>
        {/* </SessionProvider> */}
      </div>
    );
  };
  
  export default CustomLayout;