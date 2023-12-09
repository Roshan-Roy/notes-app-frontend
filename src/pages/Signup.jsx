import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import "../styles/signup.css"
import axios from 'axios'
import BtnLoader from "../components/BtnLoader"
//import { useAuthFunc } from "../components/AppContext"

export default function Signup() {
    //const { authorize } = useAuthFunc()
    const abortController = useRef()
    const onceChecked = useRef(false)
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
        if (!onceChecked.current)
            onceChecked.current = true
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
                console.log(responseData)
            } catch (e) {
                if (e.name !== "CanceledError") {
                    uptLoading(false)
                    const errorStatusCode = e.response.status
                    if (errorStatusCode === 400) {
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
            uptNameError("Name is required")
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
            uptUsernameError("Username is required")
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
            uptPasswordError("Password is required")
        else if (password.length < 6)
            uptPasswordError("Minimum 6 characters required")
        else if (password.length > 12)
            uptPasswordError("Maximum 12 characters are allowed")
        else {
            uptPasswordError("")
            passwordValidated = true
        }

        if (cPassword === "")
            uptConfirmPasswordError("Re-enter your password")
        else if (cPassword !== password)
            uptConfirmPasswordError("Passwords do not match")
        else {
            uptConfirmPasswordError("")
            cPasswordValidated = true
        }

        return nameValidated && usernameValidated && passwordValidated && cPasswordValidated

    }

    useEffect(() => {
        if (onceChecked.current)
            validate(inpVals)
    }, [inpVals])

    useEffect(() => {
        abortController.current = new AbortController()
        return () => {
            abortController.current.abort()
        }
    }, [])

    return (
        <section className="signup-sec">
            <div className="signup-sec-1">
                <h1>NoteFlow</h1>
                <Link to="/">Home</Link>
            </div>
            <div className="signup-sec-2">
                <h1>Sign Up</h1>
                <form onSubmit={handleFormSubmit}>
                    <input type="text" placeholder="Name" onChange={elm => uptInpVals({ ...inpVals, name: elm.target.value.trim() })} />
                    <div className="error">
                        <p>{valErrors.nameError}</p>
                    </div>
                    <input type="text" placeholder="Username" onChange={elm => uptInpVals({ ...inpVals, username: elm.target.value.trim() })} />
                    <div className="error">
                        <p>{valErrors.userNameError}</p>
                    </div>
                    <input type="password" placeholder="Password" onChange={elm => uptInpVals({ ...inpVals, password: elm.target.value })} />
                    <div className="error" >
                        <p>{valErrors.passwordError}</p>
                    </div>
                    <input type="password" placeholder="Confirm password" onChange={elm => uptInpVals({ ...inpVals, cPassword: elm.target.value })} />
                    <div className="error">
                        <p>{valErrors.confirmPasswordError}</p>
                    </div>
                    <div className="btn-container">
                        <button type="submit" disabled={loading}>Sign Up</button>
                        {loading ? <BtnLoader /> : null}
                    </div>
                    <div className="error server">
                        <p>{valErrors.serverError}</p>
                    </div>
                </form>
                <p>Already have an account ? <Link to="/login">Log In</Link></p>
            </div>
        </section>
    )
}