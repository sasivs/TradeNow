import { Link } from "react-router-dom";

function NavItemRight(props){
    return (
        <div className={`nav-item nav-item-right ${props.active ? "active":""}`}>
            <Link to={props.link} onClick={props.onClick}>{props.name}</Link>
        </div>
    )
}

export default NavItemRight;