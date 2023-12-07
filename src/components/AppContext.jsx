import { useContext, createContext, useState } from "react"
import AppRoutes from "./AppRoutes"

const AuthContext = createContext()

export function useAuthFunc() {
    return useContext(AuthContext)
}

export default function AppContext() {
    const [authVal, updateAuthVal] = useState(() => {
        //return sessionStorage.getItem("my-notes-user") ? true : false
        return false
    })
    const authorize = (e) => {
        sessionStorage.setItem("my-notes-user", JSON.stringify(e))
        updateAuthVal(true)
    }
    const unauthorize = () => {
        sessionStorage.removeItem("my-notes-user")
        updateAuthVal(false)
    }
    return (
        <AuthContext.Provider value={{ authVal, authorize, unauthorize }}>
            <AppRoutes />
        </AuthContext.Provider>
    )
}