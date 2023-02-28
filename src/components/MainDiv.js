import SvgCurve from "./SvgCurve"
import MainText from "./MainText";

import './MainContainer.css'

function MainDiv(){
    return (
        <div>
            <div className="main-container">
                <MainText/>
            </div>
            <div>
                <SvgCurve/>
            </div>
        </div>
    )
}

export default MainDiv; 