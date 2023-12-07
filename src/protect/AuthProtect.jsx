import { Navigate } from "react-router-dom"
import { useAuthFunc } from "../components/AppContext"

export default function AuthProtect({ e }) {
    const { authVal } = useAuthFunc()
    if (authVal) return <Navigate to="/" replace={true} />
    return e
}