import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { FaHome, FaRegListAlt } from "react-icons/fa"
import { AiOutlineStar, AiFillStar } from "react-icons/ai"
import { MdDelete, MdErrorOutline, MdOutlineDoneOutline } from "react-icons/md"
import { useParams, useNavigate } from "react-router-dom"
import PageLoader from "../components/PageLoader"
import BtnLoader from "../components/BtnLoader"
import Errors from "../components/Errors"
import axios from "axios"

export default function UptNote() {
    const reqUrl = useRef(`${import.meta.env.VITE_SERVER_URL}/api/notes/${useParams().id}`)
    const navigate = useNavigate()
    const dialog_1 = useRef()
    const dialog_2 = useRef()
    const dialog_3 = useRef()
    const dialog_4 = useRef()
    const [btnDisabled, uptBtnDisabled] = useState(true)
    const [inpDisabled, uptInpDisabled] = useState(false)
    const [loading, uptLoading] = useState(true)
    const abortController = useRef()
    const [fetchError, uptFetchError] = useState({
        state: true,
        message: ""
    })
    const [initialValues, uptInitialValues] = useState({
        title: "",
        note: ""
    })
    const [inpObj, uptInpObj] = useState({
        title: "",
        note: ""
    })
    const [error, uptErrors] = useState({
        shown: false,
        message: ""
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
        else if (title.length > 50) errorArr.push("Title length < 50")
        else titleValidated = true

        if (note === "") errorArr.push("Note is empty")
        else if (note.length > 2500) errorArr.push("Note length > 2500")
        else noteValidated = true

        if (noteValidated && titleValidated) hideError()
        else showError(errorArr.join(", "))

        return titleValidated && noteValidated
    }
    const getAuth = () => {
        const { token } = JSON.parse(sessionStorage.getItem("my-notes-user"))
        return {
            "Authorization": `Bearer ${token}`
        }
    }
    const handleSaveBtnClick = async () => {
        if (validate(inpObj.title.trim(), inpObj.note.trim())) {
            uptInpDisabled(true)
            uptBtnDisabled(true)
            try {
                await axios.patch(reqUrl.current, {
                    title: inpObj.title.trim(),
                    description: inpObj.note.trim(),
                    starred: inpObj.starred
                }, {
                    headers: getAuth(),
                    signal: abortController.current.signal
                })
                uptInitialValues({
                    title: inpObj.title.trim(),
                    note: inpObj.note.trim(),
                    starred: inpObj.starred
                })
                uptInpDisabled(false)
                dialog_1.current.showModal()
            } catch (e) {
                if (e.name != "CanceledError") {
                    uptBtnDisabled(false)
                    uptInpDisabled(false)
                    showError("Something went wrong")
                }
            }
        }
    }
    const handleDeleteBtnClick = () => {
        dialog_2.current.showModal()
    }
    const handleContinueBtnClick = () => {
        dialog_1.current.close()
    }
    const handleNoBtnClick = () => {
        dialog_2.current.close()
    }
    const handleYesBtnClick = async () => {
        handleNoBtnClick()
        dialog_3.current.showModal()
        try {
            await axios.delete(reqUrl.current, {
                headers: getAuth(),
                signal: abortController.current.signal
            })
            dialog_3.current.close()
            dialog_4.current.showModal()
        } catch (e) {
            if (e.name != "CanceledError") {
                dialog_3.current.close()
                showError("Something went wrong")
            }
        }
    }
    const handleOkayBtnClick = () => {
        navigate("/notes")
    }

    useEffect(() => {
        validate(inpObj.title.trim(), inpObj.note.trim())
        const cmpInitialAndCurrent = () => {
            const { title, note, starred } = initialValues
            const curTitle = inpObj.title.trim()
            const curNote = inpObj.note.trim()
            const curStarred = inpObj.starred
            if (title === curTitle && note === curNote && starred === curStarred) return uptBtnDisabled(true)
            return uptBtnDisabled(false)
        }
        cmpInitialAndCurrent()
    }, [inpObj])

    useEffect(() => {
        abortController.current = new AbortController()
        const fetchANote = async () => {
            try {
                const note = await axios.get(reqUrl.current, {
                    headers: getAuth(),
                    signal: abortController.current.signal
                })
                const { title, description, starred } = note.data.data
                uptLoading(false)
                uptInpObj({ title, note: description, starred })
                uptInitialValues({ title, note: description, starred })
            } catch (e) {
                if (e.name !== "CanceledError") {
                    if (e.response && e.response.status === 404) {
                        uptFetchError({ status: true, message: "Not found" })
                    } else {
                        uptFetchError({ status: true, message: "Something went wrong" })
                    }
                }
            }
        }
        fetchANote()
        return () => {
            abortController.current.abort()
        }
    }, [])

    if (fetchError.status) {
        return <section className="upt-note"><Errors msg={fetchError.message} svg={<MdErrorOutline />} /></section>
    }

    return (
        <section className="upt-note">
            {loading ? <PageLoader /> : <><div className="header">
                <div className="container">
                    <h2>NoteFlow</h2>
                    <div className="links-container sm">
                        <Link to="/notes"><FaRegListAlt /></Link>
                        <Link to="/"><FaHome /></Link>
                    </div>
                    <div className="links-container lg">
                        <Link to="/notes">Notes</Link>
                        <Link to="/">Home</Link>
                    </div>
                </div>

            </div>
                <div className="add-upt-inputs">
                    <div className="container">
                        <input type="text" spellCheck={false} value={inpObj.title} placeholder="Title" onChange={i => uptInpObj(e => ({ ...e, title: i.target.value }))} disabled={inpDisabled} />
                        <textarea value={inpObj.note} spellCheck={false} placeholder="Note" onChange={i => uptInpObj(e => ({ ...e, note: i.target.value }))} disabled={inpDisabled}></textarea>
                    </div>
                </div>
                <div className="save-footer">
                    {error.shown ? <p className="error-div">{error.message}</p> : null}
                    <div className="container">
                        <button onClick={handleSaveBtnClick} className={btnDisabled ? "disabled" : null} disabled={btnDisabled}>{btnDisabled && inpDisabled ? "Saving" : "Save changes"}</button>
                        <div onClick={handleDeleteBtnClick}><MdDelete /></div>
                        <div onClick={() => {
                            if (!inpDisabled) uptInpObj(e => ({ ...e, starred: !e.starred }))
                        }}>{inpObj.starred ? <AiFillStar /> : <AiOutlineStar />}</div>
                    </div>
                </div></>}
            <dialog ref={dialog_1} className="dialog-box-2">
                <MdOutlineDoneOutline />
                <p>Note Updated successfully</p>
                <button onClick={handleContinueBtnClick}>Continue</button>
            </dialog>
            <dialog ref={dialog_2} className="dialog-box-3">
                <h3>Are you sure you want <br />to delete?</h3>
                <div className="btn-container">
                    <button onClick={handleYesBtnClick}>Yes</button>
                    <button onClick={handleNoBtnClick}>No</button>
                </div>
            </dialog>
            <dialog ref={dialog_3} className="dialog-box-4">
                <div className="wrapper">
                    <h3>Deleting</h3>
                    <BtnLoader/>
                </div>
            </dialog>
            <dialog ref={dialog_4} className="dialog-box-2">
                <MdOutlineDoneOutline />
                <p>Note deleted successfully</p>
                <button onClick={handleOkayBtnClick}>OK</button>
            </dialog>
        </section>
    )
}