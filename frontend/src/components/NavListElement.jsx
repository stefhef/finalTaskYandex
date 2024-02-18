import "./NavListElement.css"

export const NavListElemenet = (props) => {
    return (
        <li className="nav-item">
            <a className="nav-link" href="#"><p>{props.text}</p></a>
        </li>
    )
}