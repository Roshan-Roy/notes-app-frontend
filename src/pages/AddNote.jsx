import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import "../styles/addnote.css"

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
    const [errors, uptErrors] = useState({
        titleError: "",
        noteError: "",
        serverError: ""
    })
    const uptTitleError = (msg) => {
        uptErrors(e => ({ ...e, titleError: msg }))
    }
    const uptNoteError = (msg) => {
        uptErrors(e => ({ ...e, noteError: msg }))
    }
    const uptServerError = (msg) => {
        uptErrors(e => ({ ...e, serverError: msg }))
    }
    const validate = (title, note) => {
        let titleValidated = false
        let noteValidated = false
        if (title === "") uptTitleError("Title must not be empty")
        else if (title.length > 30) uptTitleError("Max length is 30 characters")
        else {
            uptTitleError("")
            titleValidated = true
        }
        if (note === "") uptNoteError("Note must not be empty")
        else if (note.length > 1000) uptNoteError("Max length is 1000 characters")
        else {
            uptNoteError("")
            noteValidated = true
        }
        return titleValidated && noteValidated
    }
    const handleSaveBtn = async () => {
        if (!onceChecked) uptOnceChecked(true)
        if (validate(inpObj.title.trim(), inpObj.note.trim())) {
            uptDisabled(true)
            uptServerError("")
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
                    uptServerError("Something went wrong")
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
        return () => {
            abortController.current.abort()
        }
    }, [])

    return (
        <section className="add-note">
            <div className="header">
                <div className="container">
                    <h2>Add Note</h2>
                    <Link to="/notes">Notes</Link>
                    <Link to="/">Home</Link>
                </div>
            </div>
            <div className="add-upt-inputs">
                <div className="container">
                    <input type="text" value={inpObj.title} placeholder="Title" onChange={i => uptInpObj(e => ({ ...e, title: i.target.value }))} disabled={disabled} />
                    <p className="error inp">{errors.titleError}</p>
                    <textarea value={inpObj.note} placeholder="Note" onChange={i => uptInpObj(e => ({ ...e, note: i.target.value }))} disabled={disabled}></textarea>
                    <p className="error inp">{errors.noteError}</p>
                </div>
            </div>
            <div className="save-footer">
                <div className="container">
                    <p className="error server">{errors.serverError}</p>
                    <button onClick={handleSaveBtn} disabled={disabled}>{disabled ? "saving" : "save"}</button>
                    <p onClick={() => {
                        if (!disabled) uptStarred(e => !e)
                    }}>{starred ? "starred" : "not Starred"}</p>
                </div>
            </div>
            <dialog ref={dialog} className="dialog-box">
                <h2>Note Created</h2>
                <button onClick={handleContinueBtnClick}>Okay</button>
            </dialog>
        </section>
    )
}