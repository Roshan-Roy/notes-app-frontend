import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import "../styles/addnote.css"
import { FaHome, FaRegListAlt } from "react-icons/fa"
import { AiOutlineStar } from "react-icons/ai"
import { AiFillStar } from "react-icons/ai"

export default function AddNote() {
    const [onceChecked, uptOnceChecked] = useState(false)
    const [disabled, uptDisabled] = useState(false)
    const [starred, uptStarred] = useState(false)
    const dialog = useRef()
    const abortController = useRef()
    const [inpObj, uptInpObj] = useState({
        title: "",
        note: ""
    })
    const [error, uptErrors] = useState({
        shown: false,
        message: "nf"
    })
    const showError = (msg) => {
        uptErrors({ shown: true, message: msg })
    }
    const hideError = () => {
        uptErrors({ shown: false, message: "" })
    }
    const validate = (title, note) => {
        let titleValidated = false
        let noteValidated = false
        const errorArr = []

        if (title === "") errorArr.push("Title is empty")
        else if (title.length > 30) errorArr.push("Title length < 30")
        else titleValidated = true

        if (note === "") errorArr.push("Note is empty")
        else if (note.length > 1000) errorArr.push("Note length > 1000")
        else noteValidated = true

        if (noteValidated && titleValidated) hideError()
        else showError(errorArr.join(", "))

        return titleValidated && noteValidated
    }
    const handleSaveBtn = async () => {
        if (!onceChecked) uptOnceChecked(true)
        if (validate(inpObj.title.trim(), inpObj.note.trim())) {
            uptDisabled(true)
            const apiUrl = "http://localhost:5000/api/notes"
            const { token } = JSON.parse(sessionStorage.getItem("my-notes-user"))
            const headers = {
                "Authorization": `Bearer ${token}`
            }
            try {
                const createdNote = await axios.post(apiUrl, {
                    title: inpObj.title.trim(),
                    description: inpObj.note.trim(),
                    starred
                }, {
                    headers,
                    signal: abortController.current.signal
                })
                dialog.current.showModal()
                uptInpObj(e => ({ title: "", note: "" }))
                uptOnceChecked(false)
                uptDisabled(false)
                uptStarred(false)
            } catch (e) {
                if (e.name != "canceledError") {
                    uptDisabled(false)
                    showError("Something went wrong")
                }
            }
        }
    }
    const handleContinueBtnClick = () => {
        dialog.current.close()
    }

    useEffect(() => {
        if (onceChecked) validate(inpObj.title.trim(), inpObj.note.trim())
    }, [inpObj])

    useEffect(() => {
        abortController.current = new AbortController()
        window.scrollTo(0, 0)
        return () => {
            abortController.current.abort()
        }
    }, [])

    return (
        <section className="add-note">
            <div className="header">
                <div className="container">
                    <h2>Add Note</h2>
                    <div className="links-container sm">
                        <Link to="/notes"><FaRegListAlt /></Link>
                        <Link to="/"><FaHome /></Link>
                    </div>
                </div>
            </div>
            <div className="add-upt-inputs">
                <div className="container">
                    <input type="text" value={inpObj.title} placeholder="Title" onChange={i => uptInpObj(e => ({ ...e, title: i.target.value }))} disabled={disabled} />
                    <textarea value={inpObj.note} placeholder="Note" onChange={i => uptInpObj(e => ({ ...e, note: i.target.value }))} disabled={disabled}></textarea>
                </div>
            </div>
            <div className="save-footer">
                {error.shown ? <p className="error-div">{error.message}</p> : null}
                <div className="container">
                    <button onClick={handleSaveBtn} className={disabled ? "disabled" : null} disabled={disabled}>{disabled ? "Saving" : "Save"}</button>
                    <div className={disabled ? "disabled" : null} onClick={() => {
                        if (!disabled) uptStarred(e => !e)
                    }}>{starred ? <AiFillStar /> : <AiOutlineStar />}</div>
                </div>
            </div>
            <dialog ref={dialog} className="dialog-box">
                <h2>Note Created</h2>
                <button onClick={handleContinueBtnClick}>Okay</button>
            </dialog>
        </section>
    )
}