import { Link } from "react-router-dom"
import { FaHome } from 'react-icons/fa'
import "../styles/navbar.css"

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="container">
        <h1>NoteFlow</h1>
        <ul className="sm-screen">
          <li><Link to="/"><FaHome /></Link></li>
        </ul>
        <ul className="lg-screen">
          <li><Link to="/">Home</Link></li>
        </ul>
      </div>
    </div>
  )
} 