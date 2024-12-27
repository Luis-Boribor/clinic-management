'use client'

import React, { ReactNode, useState } from "react";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import PatientFinder from "../components/PatientFinder";

interface LayoutProps {
    children: ReactNode;
}

const CustomLayout: React.FC<LayoutProps> = ({ children }) => {
    const [hideNavs, setHideNavs] = useState<boolean>(true)
    const [showPatientFinder, setShowPatientFinder] = useState<boolean>(true)
    const [goTo, setGoTo] = useState<string>('')

    const togglePatientFinder = () => {
      setShowPatientFinder(!showPatientFinder)
    }

    const setFinderPath = (link: string) => {
      togglePatientFinder()
      setGoTo(link)
    }

    const toggleMenu = () => {
      setHideNavs(!hideNavs)
    }

    return (
      <div>
        <SideNav isHidden={hideNavs} toggleMenu={toggleMenu} finderFunction={setFinderPath} />
        <TopNav toggleMenu={toggleMenu} />
        <PatientFinder isHidden={showPatientFinder} goTo={goTo} toggle={togglePatientFinder} />
        <main className="absolute w-full md:w-5/6 top-14 right-0 z-8">
            {children}
        </main>
      </div>
    );
  };
  
  export default CustomLayout;