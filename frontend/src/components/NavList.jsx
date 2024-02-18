import { NavListElemenet } from "./NavListElement"

import "./NavList.css"


export const NavList = () => {
    return (
        <ul className="nav-list_items">
            <NavListElemenet text="Кальулятор"/>
            <NavListElemenet text="Контакты"/>
            <NavListElemenet text="О нас"/>
        </ul>
    )
};

