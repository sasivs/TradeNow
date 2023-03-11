import { Route, Switch } from "react-router-dom";

import MainDiv from "./components/MainDiv";
import MainNavbar from "./components/Navbar";
import SignUp from "./components/SignUp";

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          <MainNavbar />
          <MainDiv />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
