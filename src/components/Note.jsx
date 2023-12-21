import { AiFillStar } from "react-icons/ai"
import "../styles/note.css"
export default function Note({ note }) {
    const { title, description, starred, updatedAt } = note
    function formatDateTimeWithTimezone(date) {
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
        <div className="note">
            <h2>{title}</h2>
            <p className="description">{description}</p>
            {starred ? <AiFillStar /> : null}
            <hr/>
            <p className="date-time">{formatDateTimeWithTimezone(updated)}</p>
        </div>
    )
}