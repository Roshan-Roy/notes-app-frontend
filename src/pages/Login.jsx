import { Link } from "react-router-dom"
import { useAuthFunc } from "../components/AppContext"

export default function Login() {
    const { authorize } = useAuthFunc()
    const handleFormSubmit = (e) => {
        e.preventDefault()
        setTimeout(() => {
            authorize({
                name: "roshan roy",
                token: "qwerty12345678"
            })
        }, 3000)
    }
    return (
        <>
            <Link to="/">Home</Link>
            <br />
            <br />
            <h1>Login</h1>
            <form onSubmit={handleFormSubmit}>
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