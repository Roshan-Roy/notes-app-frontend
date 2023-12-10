import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function Login() {
    return (
        <>
            <Navbar/>
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Username" />
                <br />
                <input type="password" placeholder="Password" />
                <br />
                <button type="submit">Login</button>
            </form>
            <br />
            <p>Create a new account <Link to="/signup">Sign up</Link></p>
        </>
    )
}