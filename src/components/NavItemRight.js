import { Link } from "react-router-dom";

function NavItemRight(props){
    return (
        <div className="nav-item nav-item-right">
            <Link to={props.link}>{props.name}</Link>
        </div>
    )
}

export default NavItemRight;