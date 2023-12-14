import { useRef } from "react"
import { Link } from "react-router-dom"
import { useAuthFunc } from "../components/AppContext"
import { AiOutlineInfoCircle } from "react-icons/ai"
import { FiLogOut } from "react-icons/fi"
import { FaArrowRight } from "react-icons/fa"
import "../styles/home.css"

export default function Home() {
  const dialog = useRef()
  const { authVal, unauthorize } = useAuthFunc()
  const getName = () => {
    const userObj = JSON.parse(sessionStorage.getItem("my-notes-user"))
    return userObj.name
  }
  const handleLogoutBtnClick = () => {
    dialog.current.showModal()
  }
  const handleYesBtnClick = () => {
    unauthorize()
    dialog.current.close()
  }
  const handleNoBtnClick = () => {
    dialog.current.close()
  }
  return (
    <section className="home-sec">
      <div className="home-sec-1">
        <div className="container">
          <h1>NoteFlow</h1>
          <ul className="sm-screen">
            <li><Link to="/about"><AiOutlineInfoCircle /></Link></li>
            {authVal ? <li onClick={handleLogoutBtnClick}><FiLogOut /></li> : null}
          </ul>
          <ul className="lg-screen">
            <li><Link to="/about">About</Link></li>
            {authVal ? <li onClick={handleLogoutBtnClick}>Log Out</li> : null}
          </ul>
        </div>
      </div>

      <div className="home-sec-2">
        <div className="container">

          <div className="home-text-container">
            {authVal ? <p>Hi, {getName()}</p> : <p>Unleash Your Creativity, Capture Your Thoughts</p>}
            <h1>Welcome To<br />NoteFlow</h1>
            <div className="links-container">
              {authVal ? <Link to="/notes" className="notes-link">Show Notes <FaArrowRight /></Link> : <><Link to="/signup">Sign Up</Link><Link to="/login">Log In</Link></>}
            </div>
          </div>

          <div className="home-image-container"></div>
        </div>
      </div>
      <dialog ref={dialog} className="dialog-box">
        <div className="image-container"></div>
        <h2>Comeback Soon!</h2>
        <p>Are you sure you want to logout?</p>
        <div className="btn-container">
          <button onClick={handleNoBtnClick}>No</button>
          <button onClick={handleYesBtnClick}>Logout</button>
        </div>
      </dialog>
    </section>
  )
}