import { AiFillStar } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import "../styles/note.css"

export default function Note({ note }) {
    const { _id, title, description, starred, updatedAt } = note
    const navigate = useNavigate()
    const formatDateTimeWithTimezone = (date) => {
        const options = {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }
        return new Intl.DateTimeFormat(undefined, options).format(date);
    }
    const updated = new Date(updatedAt)
    return (
        <div className="note" onClick={() => { navigate(`/update/${_id}`) }}>
            <h2>{title}</h2>
            <p className="description">{description}</p>
            {starred ? <AiFillStar /> : null}
            <hr />
            <p className="date-time">{formatDateTimeWithTimezone(updated)}</p>
        </div>
    )
}