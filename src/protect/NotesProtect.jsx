import { Navigate } from "react-router-dom"
import { useAuthFunc } from "../components/AppContext"

export default function NotesProtect({ e }) {
    const { authVal } = useAuthFunc()
    if (authVal) return e
    return <Navigate to="/" replace={true}/>
}