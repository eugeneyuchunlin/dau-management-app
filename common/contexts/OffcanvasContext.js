import { createContext } from "react";

const OffcanvasContext = createContext();

export const OffcanvasProvider = ({ children, onHide }) => {

    return <>
        <OffcanvasContext.Provider value={{ onHide }}>
            {children}
        </OffcanvasContext.Provider>
    </>
}

export default OffcanvasContext;