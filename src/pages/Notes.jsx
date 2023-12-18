import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { FaHome } from 'react-icons/fa'
import { AiOutlineStar } from "react-icons/ai"
import { AiFillStar } from "react-icons/ai"
import { FiSearch } from "react-icons/fi"
import Note from "../components/Note"
import Errors from "../components/errors"
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
    uptFilteredNotes(notes.filter(e => e.title.startsWith(searchVal)))
  }
  useEffect(() => {
    uptSearchVal("")
  }, [type])
  useEffect(() => {
    performSearch()
  }, [notes, searchVal])
  useEffect(() => {
    abortController.current = new AbortController()
    const fetchAllNotes = async () => {
      try {
        const url = "http://localhost:5000/api/notes"
        const { token } = JSON.parse(sessionStorage["my-notes-user"])
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
              uptType(e => !e)
            }}>{type ? <AiOutlineStar /> : <AiFillStar />}</li>
            <li><Link to="/"><FaHome /></Link></li>
          </ul>
        </div>
      </div>
      <div className="notes-sec-2">
        <div className="container">
          {serverError ? <Errors msg="something went wrong" /> :
            loading ? <h1>loading...</h1> :
              notes.length === 0 && type ? <Errors msg="No notes added" /> :
                notes.length === 0 ? <Errors msg="no starred notes" /> :
                  filteredNotes.length === 0 ? <Errors msg="no match found" /> :
                    type ? filteredNotes.map(e => <Note key={e._id} note={e} />) :
                      filteredNotes.filter(e => e.starred).length === 0 ? <Errors msg="no match found" /> :
                        filteredNotes.filter(e => e.starred).map(e => <Note key={e._id} note={e} />)}
        </div>
      </div>
    </section>
  )
}