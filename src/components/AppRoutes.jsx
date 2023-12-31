import { Routes, Route, Navigate } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import Signup from "../pages/Signup"
import Login from "../pages/Login"
import Notes from "../pages/Notes"
import AuthProtect from "../protect/AuthProtect"
import NotesProtect from "../protect/NotesProtect"
import AddNote from "../pages/AddNote"
import UptNote from "../pages/UptNote"

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<AuthProtect e={<Signup />} />} />
            <Route path="/login" element={<AuthProtect e={<Login />} />} />
            <Route path="/notes" element={<NotesProtect e={<Notes />} />} />
            <Route path="/add" element={<NotesProtect e={<AddNote />} />} />
            <Route path="/update/:id" element={<NotesProtect e={<UptNote />} />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}