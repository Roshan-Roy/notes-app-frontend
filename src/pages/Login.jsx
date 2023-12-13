import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import "../styles/auth-pages.css"
import axios from 'axios'
import BtnLoader from "../components/BtnLoader"
import Navbar from "../components/Navbar"
import { useAuthFunc } from "../components/AppContext"
import { PiEyeBold } from "react-icons/pi"
import { PiEyeClosedBold } from "react-icons/pi"

export default function Signup() {
    const { authorize } = useAuthFunc()
    const abortController = useRef()
    const [pwVisible, uptPwVisible] = useState(false)
    const [onceChecked, uptOnceChecked] = useState(false)
    const [loading, uptLoading] = useState(false)
    const [inpVals, uptInpVals] = useState({
        username: "",
        password: ""
    })
    const [valErrors, uptValErrors] = useState({
        userNameError: "",
        passwordError: "",
        serverError: ""
    })
    const uptUsernameError = msg => {
        uptValErrors(e => ({ ...e, userNameError: msg }))
    }
    const uptPasswordError = msg => {
        uptValErrors(e => ({ ...e, passwordError: msg }))
    }
    const uptServerError = msg => {
        uptValErrors(e => ({ ...e, serverError: msg }))
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        if (!onceChecked)
            uptOnceChecked(true)
        uptServerError("")
        if (validate(inpVals)) {
            uptLoading(true)
            const { username, password } = inpVals
            try {
                const responseData = await axios.post("http://localhost:5000/api/login", {
                    username,
                    password
                }, {
                    signal: abortController.current.signal
                })
                authorize(responseData.data)
            } catch (e) {
                if (e.name !== "CanceledError") {
                    uptLoading(false)
                    if (e.response && e.response.status === 401) {
                        const message = e.response.data.message
                        if (message === "user not found")
                            uptUsernameError(message)
                        else
                            uptPasswordError(message)
                    } else {
                        uptServerError("Something went wrong, Try again !")
                    }
                }
            }
        }
    }

    const validate = ({ username, password }) => {
        let usernameValidated = false
        let passwordValidated = false

        const usernameRegex = /^[a-z_][a-z0-9_]{4,19}$/

        if (username === "")
            uptUsernameError("Must not be empty")
        else if (!usernameRegex.test(username))
            uptUsernameError("Enter a valid username")
        else {
            uptUsernameError("")
            usernameValidated = true
        }

        if (password === "")
            uptPasswordError("Must not be empty")
        else {
            uptPasswordError("")
            passwordValidated = true
        }

        return usernameValidated && passwordValidated

    }
    const togglePwVisibility = () => {
        uptPwVisible(e => !e)
    }

    useEffect(() => {
        if (onceChecked)
            validate(inpVals)
    }, [inpVals])

    useEffect(() => {
        abortController.current = new AbortController()
        return () => {
            abortController.current.abort()
        }
    }, [])

    return (
        <section className="auth-sec">
            <Navbar />
            <div className="auth-sec-2">
                <div className="container">
                    <div className="bg-register login">
                        <div className="bg-text">
                            <h1>Capturing your thoughts</h1>
                            <p> Elevate your note-taking experience, embrace the infinite possibilities with NoteFlow</p>
                        </div>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <h1 className="login">Log In</h1>

                        <div className="inp-wrapper">
                            <label htmlFor="username">Username</label>
                            <input id="username" type="text" placeholder="Enter you username" onChange={elm => uptInpVals({ ...inpVals, username: elm.target.value.trim() })} disabled={loading} />
                        </div>
                        <div className="error">
                            <p>{valErrors.userNameError}</p>
                        </div>

                        <div className="inp-wrapper password">
                            <label htmlFor="password">Password</label>
                            <div className="inp-password-container">
                                <input id="password" type={pwVisible ? "text" : "password"} placeholder="Enter your password" onChange={elm => uptInpVals({ ...inpVals, password: elm.target.value })} disabled={loading} />
                                <div className="eye-container" onClick={togglePwVisibility}>{pwVisible ? <PiEyeBold /> : <PiEyeClosedBold />}</div>
                            </div>
                        </div>
                        <div className="error" >
                            <p>{valErrors.passwordError}</p>
                        </div>

                        <div className="btn-container">
                            <button type="submit" className={loading ? "disabled" : null} disabled={loading}>Log In</button>
                            {loading ? <BtnLoader /> : null}
                        </div>
                        <div className="error server">
                            <p>{valErrors.serverError}</p>
                        </div>
                        <p> Need An Account ? <Link to="/signup">Sign Up</Link></p>
                    </form>
                </div>
            </div >
        </section >
    )
}