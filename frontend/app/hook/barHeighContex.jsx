import { createContext, useContext, useState } from "react";

const BottomBarHeightContext = createContext(0);

export const useBottomBarHeight = () => useContext(BottomBarHeightContext);

export default function BottomBarHeightProvider({ children }){
  const [bottomBarHeight, setBottomBarHeight] = useState(0);

  return (
    <BottomBarHeightContext.Provider value={{ bottomBarHeight, setBottomBarHeight }}>
      {children}
    </BottomBarHeightContext.Provider>
  );
};
