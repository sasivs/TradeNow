import { Link } from "react-router-dom";

function NavTitle(props){
    return (
        <div className="nav-title">
            <h3><Link to="/">{props.title}</Link></h3>
        </div>
    );
}

export default NavTitle;