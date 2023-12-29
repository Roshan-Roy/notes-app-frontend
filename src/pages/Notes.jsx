import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { FaHome } from 'react-icons/fa'
import { AiOutlineStar, AiFillStar } from "react-icons/ai"
import { FiSearch } from "react-icons/fi"
import Note from "../components/Note"
import Errors from "../components/errors"
import { MdOutlineSearchOff } from "react-icons/md"
import { TbFaceIdError, TbNotesOff } from "react-icons/tb"
import { LuStarOff } from "react-icons/lu"
import PageLoader from "../components/PageLoader"
import { IoMdAdd } from "react-icons/io"
import "../styles/notes.css"

export default function Notes() {
  const [loading, uptLoading] = useState(true)
  const [type, uptType] = useState(true)
  const [notes, uptNotes] = useState([])
  const [filteredNotes, uptFilteredNotes] = useState()
  const [searchVal, uptSearchVal] = useState("")
  const [serverError, uptServerError] = useState(false)
  const abortController = useRef()
  const performSearch = () => {
    uptFilteredNotes(notes.filter(e => {
      const searchedVal = searchVal.toLowerCase()
      const title = e.title.toLowerCase()
      const description = e.description.toLowerCase()
      return title.includes(searchedVal) || description.includes(searchedVal)
    }))
  }
  useEffect(() => {
    uptSearchVal("")
  }, [type])
  useEffect(() => {
    performSearch()
    window.scrollTo(0, 0)
  }, [notes, searchVal])
  useEffect(() => {
    abortController.current = new AbortController()
    const fetchAllNotes = async () => {
      try {
        const url = "http://localhost:5000/api/notes?sort=-updatedAt"
        const { token } = JSON.parse(sessionStorage.getItem("my-notes-user"))
        const headers = {
          "Authorization": `Bearer ${token}`
        }
        const notesList = await axios.get(url, {
          headers,
          signal: abortController.current.signal
        })
        uptNotes(notesList.data.data)
        uptLoading(false)
      } catch (e) {
        if (e.name != "CanceledError") uptServerError(true)
      }
    }
    fetchAllNotes()
    return () => {
      abortController.current.abort()
    }
  }, [])

  return (
    <section className="notes-sec">
      <div className="notes-sec-1">
        <div className="container">
          <ul className="search-bar">
            <li><label htmlFor="search"><FiSearch /></label></li>
            <li><input type="text" placeholder={type ? "All Notes" : "Starred Notes"} id="search" onChange={e => { uptSearchVal(e.target.value) }} value={searchVal} /></li>
            <li onClick={() => {
              window.scrollTo(0, 0)
              uptType(e => !e)
            }}>{type ? <AiOutlineStar /> : <AiFillStar />}</li>
            <li><Link to="/"><FaHome /></Link></li>
          </ul>
        </div>
      </div>
      <div className="notes-sec-2">
        <div className="container">
          {serverError ? <Errors msg="An error occurred !" svg={<TbFaceIdError />} /> :
            loading ? <PageLoader /> :
              notes.length === 0 && type ? <Errors msg="No notes found" svg={<TbNotesOff />} /> :
                notes.filter(e => e.starred).length === 0 && !type ? <Errors msg="No starred notes" svg={<LuStarOff />} /> :
                  filteredNotes.length === 0 ? <Errors msg="No results found" svg={<MdOutlineSearchOff />} /> :
                    type ? <div className="notes">{filteredNotes.map(e => <Note key={e._id} note={e} />)}</div> :
                      filteredNotes.filter(e => e.starred).length === 0 ? <Errors msg="No results found" svg={<MdOutlineSearchOff />} /> :
                        <div className="notes">{filteredNotes.filter(e => e.starred).map(e => <Note key={e._id} note={e} />)}</div>}
        </div>
      </div>
      <Link to="/add" className="add-btn"><IoMdAdd /></Link>
    </section>
  )
}