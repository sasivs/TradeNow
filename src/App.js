import { Route } from "react-router-dom";

import MainDiv from "./components/MainDiv";
import MainNavbar from "./components/Navbar";
import SignUp from "./components/SignUp";

function App(){
    return (
        <div>
            <Route path="/">
                <MainNavbar/>
                <MainDiv/>
            </Route>
            <Route path="/signup">
                <SignUp/>
            </Route>
        </div>
    );
}

export default App;