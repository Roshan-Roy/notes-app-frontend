import { AiFillStar } from "react-icons/ai"
import "../styles/note.css"
export default function Note({note}) {
    const {title,description,starred,_id} = note
    return (
        <div className="note">
         <h1>{title}</h1>
         <p>{description}</p>
         {starred?<AiFillStar/>:null}
        </div>
    )
}