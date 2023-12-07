import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import "../styles/signup.css"
//import { useAuthFunc } from "../components/AppContext"

export default function Signup() {
    //const { authorize } = useAuthFunc()
    const onceChecked = useRef(false)
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
        confirmPasswordError: ""
    })
    const uptNameError = msg => {
        uptValErrors(e => ({ ...e, nameError: msg }))
    }
    const uptUserNameError = msg => {
        uptValErrors(e => ({ ...e, userNameError: msg }))
    }
    const uptPasswordError = msg => {
        uptValErrors(e => ({ ...e, passwordError: msg }))
    }
    const uptConfirmPasswordError = msg => {
        uptValErrors(e => ({ ...e, confirmPasswordError: msg }))
    }
    const handleFormSubmit = (e) => {
        e.preventDefault()
        validate(inpVals)
        if (!onceChecked.current)
            onceChecked.current = true
    }

    const validate = ({ name, username, password, cPassword }) => {
        let nameValidated = false;
        if (name === "") {
            uptNameError("Name is required")
        } else {
            const nameRegex = /^[a-zA-Z\s]{2,20}$/
            if(nameRegex.test(name)){
                uptNameError("")
                nameValidated=true
            }else{
                uptNameError("Invalid Name")
            }
        }
        return nameValidated
    }

    useEffect(() => {
        if (onceChecked.current)
            validate(inpVals)
    }, [inpVals])

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
                    <input type="password" placeholder="Password" onChange={elm => uptInpVals({ ...inpVals, password: elm.target.value.trim() })} />
                    <div className="error" >
                        <p>{valErrors.passwordError}</p>
                    </div>
                    <input type="password" placeholder="Confirm password" onChange={elm => uptInpVals({ ...inpVals, cPassword: elm.target.value.trim() })} />
                    <div className="error">
                        <p>{valErrors.confirmPasswordError}</p>
                    </div>
                    <button type="submit">Sign up</button>
                </form>
                <p>Already have an account ? <Link to="/login">Login</Link></p>
            </div>
        </section>
    )
}