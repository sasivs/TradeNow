import { Link } from "react-router-dom";

import './regLoginParent.css'

function RegLoginParent(props) {
  return (
    <div className="row main-row">
      <div className="col-4 side-container">
        <div className="side-head">
          <h3>{props.side_head[0]}</h3>
          <h3>{props.side_head[1]}</h3>
          <h3>{props.side_head[2]}</h3>
          <h3>{props.side_head[3]}</h3>
        </div>
        <div className="title-head">
          <h1><Link to={"/"}>{props.title}</Link></h1>
        </div>
      </div>
      <div className="col form-container">
        <div className="welcome-head">
          <h2>Welcome to {props.title}</h2>
        </div>
        <div className="child-head">
          <h3 className='child-title title'>{props.childTitle}</h3>
        </div>
        <props.childComponent/>
      </div>
    </div>
  );
}

export default RegLoginParent;