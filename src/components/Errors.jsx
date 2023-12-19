import "../styles/Error.css"
export default function Errors({ svg, msg }) {
  return (
    <div className="notes-error-wrapper">
      <div className="notes-error">
        <div>{svg}</div>
        <h3>{msg}</h3>
      </div>
    </div>
  )
}