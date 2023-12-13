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
        name: "",
        username: "",
        password: "",
        cPassword: ""
    })
    const [valErrors, uptValErrors] = useState({
        nameError: "",
        userNameError: "",
        passwordError: "",
        confirmPasswordError: "",
        serverError: ""
    })
    const uptNameError = msg => {
        uptValErrors(e => ({ ...e, nameError: msg }))
    }
    const uptUsernameError = msg => {
        uptValErrors(e => ({ ...e, userNameError: msg }))
    }
    const uptPasswordError = msg => {
        uptValErrors(e => ({ ...e, passwordError: msg }))
    }
    const uptConfirmPasswordError = msg => {
        uptValErrors(e => ({ ...e, confirmPasswordError: msg }))
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
            const { name, username, password } = inpVals
            try {
                const responseData = await axios.post("http://localhost:5000/api/signup", {
                    name,
                    username,
                    password
                }, {
                    signal: abortController.current.signal
                })
                authorize(responseData.data)
            } catch (e) {
                if (e.name !== "CanceledError") {
                    uptLoading(false)
                    if (e.response && e.response.status === 400) {
                        uptUsernameError("Username already exists")
                    } else {
                        uptServerError("Something went wrong, Try again !")
                    }
                }
            }
        }
    }

    const validate = ({ name, username, password, cPassword }) => {
        let nameValidated = false
        let usernameValidated = false
        let passwordValidated = false
        let cPasswordValidated = false

        const nameRegex = /^[a-zA-Z\s]{2,30}$/
        const usernameRegex = /^[a-z_][a-z0-9_]{4,19}$/

        if (name === "")
            uptNameError("Must not be empty")
        else if (name.length < 2)
            uptNameError("Minimum 2 characters required")
        else if (name.length > 20)
            uptNameError("Maximum 30 characters allowed")
        else if (!nameRegex.test(name))
            uptNameError("Enter a valid name")
        else {
            uptNameError("")
            nameValidated = true
        }

        if (username === "")
            uptUsernameError("Must not be empty")
        else if (username.length < 5)
            uptUsernameError("Minimum 5 characters required")
        else if (username.length > 20)
            uptUsernameError("Maximum 20 characters allowed")
        else if (!usernameRegex.test(username))
            uptUsernameError("Enter a valid username")
        else {
            uptUsernameError("")
            usernameValidated = true
        }

        if (password === "")
            uptPasswordError("Must not be empty")
        else if (password.length < 6)
            uptPasswordError("Minimum 6 characters required")
        else if (password.length > 12)
            uptPasswordError("Maximum 12 characters are allowed")
        else {
            uptPasswordError("")
            passwordValidated = true
        }

        if (cPassword !== password)
            uptConfirmPasswordError("Passwords do not match")
        else {
            uptConfirmPasswordError("")
            cPasswordValidated = true
        }

        return nameValidated && usernameValidated && passwordValidated && cPasswordValidated

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
                    <div className="bg-register signup">
                        <div className="bg-text">
                            <h1>Nurturing Creativity</h1>
                            <p>Explore, ideate, and let NoteFlow be the conduit for your most inspired thoughts</p>
                        </div>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <h1>Sign Up</h1>

                        <div className="inp-wrapper">
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" placeholder="Enter your name" onChange={elm => uptInpVals({ ...inpVals, name: elm.target.value.trim() })} disabled={loading} />
                        </div>
                        <div className="error">
                            <p>{valErrors.nameError}</p>
                        </div>

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

                        <div className="inp-wrapper">
                            <label htmlFor="cpassword">Confirm</label>
                            <input id="cpassword" type={pwVisible ? "text" : "password"} placeholder="Re-enter your password" onChange={elm => uptInpVals({ ...inpVals, cPassword: elm.target.value })} disabled={loading} />
                        </div>
                        <div className="error">
                            <p>{valErrors.confirmPasswordError}</p>
                        </div>

                        <div className="btn-container">
                            <button type="submit" className={loading?"disabled":null} disabled={loading}>Sign Up</button>
                        {loading ? <BtnLoader /> : null}
                </div>
                <div className="error server">
                    <p>{valErrors.serverError}</p>
                </div>
                <p>Already Have An Account ? <Link to="/login">Log In</Link></p>
            </form>
        </div>
            </div >
        </section >
    )
}