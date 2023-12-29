import Navbar from "../components/Navbar"
import "../styles/about.css"
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa"
import { Link } from "react-router-dom"

export default function About() {
  return (
    <>
      <Navbar />
      <section className="about-section">
        <div className="container">
          <h1>About</h1>
          <p><b>NoteFLow</b> is a dynamic web application I designed and devloped using the <b>MERN</b> stack, showcasing my skills in front-end, back-end, and database management. Here's a snapshot of the project</p>
          <h2>Tech Stack</h2>
          <p><b>Frontend : </b>React.js</p>
          <p><b>Backend : </b>Node.js (express)</p>
          <p><b>Database : </b>MongoDB</p>
          <p><b>Design : </b>CSS (responsive)</p>
          <h2>Key Achievements</h2>
          <p>Implemented secure <b>user authentication</b> for a personalized experience.
          </p>
          <p>Developed a comprehensive note management system, allowing users to <b>create, edit, delete, search, and star</b> notes for easy access.</p>
          <p>Utilized <b>React</b> for a responsive and engaging front-end experience.</p>
          <p>Leveraged <b>Express.js</b> to handle server-side operations efficiently.</p>
          <p>Employed <b>MongoDB</b> for robust data storage and retrieval.</p>
          <h2>User Interaction</h2>
          <p>Prioritized <b>user experience</b>, making note-taking intuitive and efficient.</p>
          <p>Implemented features like <b>search and star</b> functionality for enhanced usability.</p>
        </div>
        <footer>
          <p>Devloped by</p>
          <h3>Roshan Roy</h3>
          <ul>
            <li><Link to="https://www.linkedin.com/in/roshan-roy-8a960b270" target="_blank"><FaLinkedin /></Link></li>
            <li><Link to="https://www.instagram.com/rosshhaan__?igsh=YTQwZjQ0NmI0OA==" target="_blank"><FaInstagram /></Link></li>
            <li><Link to="https://github.com/Roshan-Roy" target="_blank"><FaGithub /></Link></li>
          </ul>
        </footer>
      </section>

    </>
  )
}