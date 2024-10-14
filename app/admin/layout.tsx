'use client'

import React, { ReactNode, useState } from "react";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";

interface LayoutProps {
    children: ReactNode;
}

const CustomLayout: React.FC<LayoutProps> = ({ children }) => {
    const [hideNavs, setHideNavs] = useState<boolean>(true)

    const toggleMenu = () => {
      setHideNavs(!hideNavs)
    }

    return (
      <div>
        <SideNav isHidden={hideNavs} />
        <TopNav toggleMenu={toggleMenu} />
        <main className="absolute w-full md:w-5/6 top-14 right-0 z-8">
            {children}
        </main>
      </div>
    );
  };
  
  export default CustomLayout;