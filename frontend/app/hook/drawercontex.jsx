import { createContext, useContext, useState } from "react";

const DrawerContext = createContext();

export const useDrawer = () => useContext(DrawerContext);

export default function DrawerProvider({ children }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const openDrawer = () => setShowDrawer(true);
    const closeDrawer = () => setShowDrawer(false);

    return (
        <DrawerContext.Provider value={{ showDrawer, openDrawer, closeDrawer }}>
            {children}
        </DrawerContext.Provider>
    );
}
