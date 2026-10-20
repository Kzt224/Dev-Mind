import { createContext, useContext, useState } from "react";

const NavBarHeightContext = createContext(0);

export const useNavBarHeight = () => useContext(NavBarHeightContext);

export default function NavBarHeightProvider({ children }){
  const [NavBarHeight, setNavBarHeight] = useState(0);

  return (
    <NavBarHeightContext.Provider value={{ NavBarHeight, setNavBarHeight }}>
      {children}
    </NavBarHeightContext.Provider>
  );
};
