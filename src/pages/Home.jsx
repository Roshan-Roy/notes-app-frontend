import { Link } from "react-router-dom"
import { useAuthFunc } from "../components/AppContext"
import "../styles/home.css"
import { AiOutlineInfoCircle } from "react-icons/ai"
import { FiLogOut } from "react-icons/fi"
import { FaArrowRight } from "react-icons/fa"

export default function Home() {
  const { authVal, unauthorize } = useAuthFunc()
  const handleLogout = () => {
    unauthorize()
  }
  return (
    <section className="home-sec">
      <div className="home-sec-1">
        <div className="container">
          <h1>NoteFlow</h1>
          <ul className="sm-screen">
            <li><Link to="/about"><AiOutlineInfoCircle /></Link></li>
            {authVal ? <li><FiLogOut /></li> : null}
          </ul>
          <ul className="lg-screen">
            <li><Link to="/about">About</Link></li>
            {authVal?<li>Log out</li>:null}
          </ul>
        </div>
      </div>

      <div className="home-sec-2">
        <div className="container">

          <div className="home-text-container">
            {authVal ? <p>Hi roshan</p> : <p>unleash your creativity, capture your thoughts</p>}
            <h1>welcome to<br />NoteFlow</h1>
            <div className="links-container">
              {authVal ? <Link to="/notes" className="notes-link">show notes <FaArrowRight /></Link> : <><Link to="/signup">sign up</Link><Link to="/login">log in</Link></>}
            </div>
          </div>

          <div className="home-image-container"></div>

        </div>
      </div>

    </section>
  )
}