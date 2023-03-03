import { Link } from "react-router-dom";

function NavItemLeft(props){
    return (
        <div className="nav-item nav-item-left">
            <Link to={props.link}>{props.name}</Link>
        </div>
    )
}

export default NavItemLeft;