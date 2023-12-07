import { Routes, Route, Navigate } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import Contact from "../pages/Contact"
import Signup from "../pages/Signup"
import Login from "../pages/Login"
import Notes from "../pages/Notes"
import AuthProtect from "../protect/AuthProtect"
import NotesProtect from "../protect/NotesProtect"
export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<AuthProtect e={<Signup />} />} />
            <Route path="/login" element={<AuthProtect e={<Login />} />} />
            <Route path="/Notes" element={<NotesProtect e={<Notes />} />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}